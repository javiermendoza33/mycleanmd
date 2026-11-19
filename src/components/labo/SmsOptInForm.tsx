"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { submitSmsOptIn, type SmsState } from "@/app/labo/(site)/sms/actions";
import { CONSENT_TEXT } from "@/labo/clinic/sms";

function Submit() {
  const { pending } = useFormStatus();
  return <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Saving…" : "Sign up for updates"}</button>;
}

/** The /sms opt-in form. The consent box is UNCHECKED until the visitor ticks it; an email-only sign-up is fine. */
export default function SmsOptInForm() {
  const [state, action] = useActionState(submitSmsOptIn, { status: "idle" } as SmsState);

  if (state.status === "success") {
    return (
      <div className="tile" id="signup">
        <h3>{state.emailOnly ? "You’re on the email list." : "You’re on the list."}</h3>
        <p>{state.emailOnly
          ? "We will send updates by email only. We will never text you unless you tick the text box."
          : "You will get one confirmation text. Reply STOP at any time to cancel, or HELP for help."}</p>
      </div>
    );
  }

  const consentWithLinks = CONSENT_TEXT.replace(" See our Privacy Policy and SMS Terms.", "");
  return (
    <form action={action} className="tile" id="signup">
      <h3>Get text updates</h3>
      <p style={{ fontSize: ".9rem", color: "var(--muted)" }}>About 1–4 messages a month. Texting is optional.</p>
      {state.status === "error" && <p className="formerr" role="alert">{state.message}</p>}
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        <label>Your website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="fld"><label htmlFor="sms-name">First name *</label>
        <input id="sms-name" name="firstName" type="text" placeholder="First name" autoComplete="given-name" required /></div>
      <div className="fld"><label htmlFor="sms-mobile">Mobile number (for texts)</label>
        <input id="sms-mobile" name="mobile" type="tel" inputMode="tel" placeholder="(206) 555-0100" autoComplete="tel" /></div>
      <div className="fld"><label htmlFor="sms-email">Email</label>
        <input id="sms-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" /></div>
      <label className="consent">
        <input type="checkbox" name="consent" value="yes" />
        <span>{consentWithLinks} See our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/sms">SMS Terms</Link>.</span>
      </label>
      <p className="note" style={{ marginTop: 4 }}>
        Texting is optional. Leave the box unchecked and add an email to get updates by email only — we will never text you without this box checked.
      </p>
      <Submit />
    </form>
  );
}
