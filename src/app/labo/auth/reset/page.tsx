"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * /auth/reset (Nov 22 2026): the "set a new password" page the recovery email lands on. The reset link goes
 * Supabase → /auth/callback?next=/auth/reset → here, already signed in by the one-time token; the form calls
 * auth.updateUser({ password }). Also works for any signed-in member who wants to change their password.
 * Without a session (link expired, or opened twice — they're single-use) it points back to "Forgot it?".
 */
async function laboHome(): Promise<string> {
  try { const r = await fetch("/api/labo/home", { cache: "no-store" }); const j = await r.json(); return j.path === "/provider" ? "/clinic" : (typeof j.path === "string" ? j.path : "/portal"); } catch { return "/portal"; }
}

function ResetInner() {
  const router = useRouter(); const params = useSearchParams();
  const tokenHash = params.get("token_hash"); const linkType = params.get("type") === "recovery" ? "recovery" : null;
  const [state, setState] = useState<"checking" | "ready" | "nosession" | "link" | "done">("checking");
  const [email, setEmail] = useState(""); const [code, setCode] = useState(""); const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [show, setShow] = useState(false); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { createClient().auth.getUser().then(({ data }) => { if (data.user) { setEmail(data.user.email ?? ""); setState("ready"); } else setState(tokenHash && linkType ? "link" : "nosession"); }); }, [tokenHash, linkType]);
  // The email button lands here with ?token_hash — nothing has been consumed yet (so a mail scanner or Chrome's
  // preloading can't spend it). Verifying happens only when the person presses Continue, in this browser.
  async function useLink() {
    setError(""); setBusy(true);
    const { data, error } = await createClient().auth.verifyOtp({ token_hash: tokenHash!, type: "recovery" });
    setBusy(false);
    if (error || !data.session) { setError("This link has already been used or has expired — request a new email below."); setState("nosession"); return; }
    setEmail(data.user?.email ?? ""); setState("ready");
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (pw.length < 8) { setError("Use at least 8 characters."); return; }
    if (pw !== pw2) { setError("The two passwords don't match."); return; }
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password: pw });
    if (error) { setError(error.message); setBusy(false); return; }
    setState("done"); const to = await laboHome(); router.push(to); router.refresh();
  }
  if (state === "checking") return <div className="authcard"><span className="kicker">One moment</span><h2>Checking your link…</h2></div>;
  if (state === "link") return (
    <div className="authcard">
      <span className="kicker">Reset password</span>
      <h2>Ready to set a new password.</h2>
      <p className="authsub">Press continue to verify this link and choose your new password.</p>
      {error && <p className="err">{error}</p>}
      <p style={{ marginTop: 18 }}><button type="button" className="btn btn-primary" disabled={busy} onClick={useLink}>{busy ? "Verifying…" : "Continue"}</button></p>
      <p className="note"><Link href="/auth/login">Back to sign in</Link></p>
    </div>
  );
  async function useCode(e: React.FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    // The recovery email carries a 6-digit code as well as the link — the code works from any device and can't be
    // burned by an email client's link preview (Nov 22 2026: the link kept getting consumed before the browser saw it).
    const { data, error } = await createClient().auth.verifyOtp({ email: email.trim(), token: code.replace(/\D/g, ""), type: "recovery" });
    setBusy(false);
    if (error || !data.session) { setError("That code didn't work — check the digits, or request a new email."); return; }
    setState("ready");
  }
  if (state === "nosession") return (
    <div className="authcard">
      <span className="kicker">Reset password</span>
      <h2>Enter the code from your email.</h2>
      <p className="authsub">The reset email has a 6-digit code under the button. The link itself works once, in the browser that asked for it — the code works anywhere.</p>
      <form onSubmit={useCode} className="authform">
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
        <label>Code<input inputMode="numeric" pattern="[0-9 ]*" value={code} onChange={(e) => setCode(e.target.value)} required placeholder="123456" autoComplete="one-time-code" /></label>
        {error && <p className="err">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Checking…" : "Continue"}</button>
      </form>
      <p className="note">No code in your email yet? <Link href="/auth/forgot">Send a new reset email</Link> · <Link href="/auth/login">Back to sign in</Link></p>
    </div>
  );
  if (state === "done") return <div className="authcard"><span className="kicker">Done</span><h2>Password updated.</h2><p className="authsub">Taking you in…</p></div>;
  return (
    <div className="authcard">
      <span className="kicker">Reset password</span>
      <h2>Choose a new password.</h2>
      <p className="authsub">For {email}. Use at least 8 characters.</p>
      <form onSubmit={submit} className="authform">
        <label>New password<span className="pwrow"><input type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} required minLength={8} autoComplete="new-password" autoFocus /><button type="button" className="linkbtn" onClick={() => setShow((v) => !v)}>{show ? "Hide" : "Show"}</button></span></label>
        <label>Confirm new password<input type={show ? "text" : "password"} value={pw2} onChange={(e) => setPw2(e.target.value)} required minLength={8} autoComplete="new-password" /></label>
        {error && <p className="err">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : "Save new password"}</button>
      </form>
    </div>
  );
}

export default function LaboReset() { return <Suspense fallback={null}><ResetInner /></Suspense>; }
