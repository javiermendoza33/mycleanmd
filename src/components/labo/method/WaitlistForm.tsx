"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { joinWaitlist, type WaitlistState } from "@/app/labo/method/start/actions";
import { mc, type Lang } from "@/labo/method/i18n";
import { US_STATES } from "@/labo/method/states";

function Submit({ label, saving }: { label: string; saving: string }) { const { pending } = useFormStatus(); return <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? saving : label}</button>; }

/** The opening-list form on the coming-soon page: an email and, if they like, a state. Nothing about health. */
export default function WaitlistForm({ lang }: { lang: Lang }) {
  const s = mc(lang).t.soon;
  const [state, action] = useActionState(joinWaitlist, { status: "idle" } as WaitlistState);
  if (state.status === "success") return <div className="tile smsform wlform" role="status"><h2>{s.okH}</h2><p>{s.okP}</p></div>;
  return (
    <form action={action} className="tile smsform wlform">
      <h2>{s.formH}</h2>
      {state.status === "error" && <p className="formerr" role="alert">{state.error === "email" ? s.errEmail : s.errSave}</p>}
      <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}><label>Your website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <input type="hidden" name="lang" value={lang} />
      <div className="fld"><label htmlFor="wl-email">{s.email} *</label><input id="wl-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></div>
      <div className="fld"><label htmlFor="wl-state">{s.state}</label><select id="wl-state" name="state" defaultValue="" autoComplete="address-level1"><option value="">{s.choose}</option>{US_STATES.map((x) => <option key={x.code} value={x.code}>{x.name}</option>)}</select></div>
      <Submit label={s.submit} saving={s.saving} />
      <p className="note">{s.note}<Link href="/privacy-policy">{s.privacy}</Link>.</p>
    </form>
  );
}
