"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { submitMethodSmsOptIn, type SmsState } from "@/app/labo/method/sms/actions";
import { METHOD_CONSENT_TEXT } from "@/labo/method/sms";
import { PRACTICE } from "@/labo/content";

function Submit() { const { pending } = useFormStatus(); return <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Saving…" : "Sign up for updates"}</button>; }

/** The thelabomethod.com/sms opt-in form. The consent box is UNCHECKED until the visitor ticks it; an email-only sign-up is fine. */
export default function MethodSmsOptInForm() {
  const [state, action] = useActionState(submitMethodSmsOptIn, { status: "idle" } as SmsState);
  if (state.status === "success") return <div className="tile smsform" id="signup"><h2>{state.emailOnly ? "You're on the email list." : "You're on the list."}</h2><p>{state.emailOnly ? "We will send updates by email only. We will never text you unless you tick the text box." : "You will get one confirmation text. Reply STOP at any time to cancel, or HELP for help."}</p></div>;
  const text = METHOD_CONSENT_TEXT.replace(" See our Privacy Policy and SMS Terms.", "");
  return (
    <form action={action} className="tile smsform" id="signup">
      <h2>Get text updates</h2>
      <p className="sub">About 2–6 messages a month. Texting is optional.</p>
      {state.status === "error" && <p className="formerr" role="alert">{state.message}</p>}
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}><label>Your website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="fld"><label htmlFor="msms-name">First name *</label><input id="msms-name" name="firstName" type="text" placeholder="First name" autoComplete="given-name" required /></div>
      <div className="fld"><label htmlFor="msms-mobile">Mobile number (for texts)</label><input id="msms-mobile" name="mobile" type="tel" inputMode="tel" placeholder="(206) 555-0100" autoComplete="tel" /></div>
      <div className="fld"><label htmlFor="msms-email">Email *</label><input id="msms-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></div>
      <label className="scheck"><input type="checkbox" name="consent" value="yes" /><span>{text} See our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/sms">SMS Terms</Link>.</span></label>
      <p className="note">Texting is optional. Leave the box unchecked and we will send updates by email only — we never text without this box checked.</p>
      <Submit />
    </form>
  );
}
