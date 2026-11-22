"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CONSENT_TEXT } from "@/labo/clinic/sms";

function SignupInner() {
  const router = useRouter(); const params = useSearchParams();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [consent, setConsent] = useState(false); const [password, setPassword] = useState(""); const [show, setShow] = useState(false); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [check, setCheck] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    // Nov 22 2026: optional mobile + SMS consent (unchecked by default, same disclosure as /sms and the contact form).
    const digits = phone.replace(/\D/g, "");
    if (consent && !/^1?\d{10}$/.test(digits)) { setError("To receive texts, enter a 10-digit US mobile number (or leave the text box unticked)."); setBusy(false); return; }
    if (!consent && digits && !/^1?\d{10}$/.test(digits)) { setError("That mobile number doesn't look right — 10 digits, or leave it blank."); setBusy(false); return; }
    const phoneE164 = digits ? `+1${digits.slice(-10)}` : null;
    const supabase = createClient();
    const redirect = params.get("redirect"); const next = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/portal";
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim(), role: "patient", brand: "labo", phone: phoneE164 ?? "", sms_consent: consent }, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
    if (error) { setError(error.message); setBusy(false); return; }
    if (data.user) await supabase.from("profiles").upsert({ id: data.user.id, full_name: name.trim(), role: "patient", email: email.trim(), phone: phoneE164, sms_consent: consent, sms_consent_at: consent ? new Date().toISOString() : null });
    // The server stamps IP / user agent / disclosure onto the consent and emails the practice the record.
    if (consent) fetch("/api/labo/members/consent", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: email.trim() }) }).catch(() => {});
    if (!data.session) { setCheck(true); setBusy(false); return; }   // email confirmation on → tell them to check their inbox
    router.push(next); router.refresh();
  }
  if (check) return <div className="authcard"><span className="kicker">One more step</span><h2>Check your email.</h2><p className="authsub">We sent a confirmation link to {email}. Open it, then come back and <Link href="/auth/login">sign in</Link>.</p></div>;
  return (
    <div className="authcard">
      <span className="kicker">Create account</span>
      <h2>Let&rsquo;s get you set up.</h2>
      <p className="authsub">Already have one? <Link href="/auth/login">Sign in</Link></p>
      <form onSubmit={submit} className="authform">
        <label>Your name<input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></label>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
        <label><span>Mobile number <span className="opt">(optional, for texts)</span></span><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="(206) 555-0100" inputMode="tel" /></label>
        <label className="consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>{CONSENT_TEXT.replace(" See our Privacy Policy and SMS Terms.", "")} See our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/sms">SMS Terms</Link>.</span>
        </label>
        <label>Password<span className="pwrow"><input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" /><button type="button" className="linkbtn" onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"}</button></span></label>
        {error && <p className="err">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
      </form>
      <p className="note">By continuing you agree to our <Link href="/privacy-policy">privacy policy</Link>.</p>
    </div>
  );
}
export default function LaboSignup() { return <Suspense fallback={null}><SignupInner /></Suspense>; }
