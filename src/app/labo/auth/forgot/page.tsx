"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LaboForgot() {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/callback?next=/portal` });
    if (error) { setError(error.message); setBusy(false); return; } setSent(true); setBusy(false);
  }
  if (sent) return <div className="authcard"><span className="kicker">Sent</span><h2>Check your email.</h2><p className="authsub">If there&rsquo;s an account for {email}, a reset link is on its way. <Link href="/auth/login">Back to sign in</Link></p></div>;
  return (
    <div className="authcard">
      <span className="kicker">Reset password</span>
      <h2>Forgot your password?</h2>
      <p className="authsub">Enter your email and we&rsquo;ll send a link to set a new one.</p>
      <form onSubmit={submit} className="authform">
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
        {error && <p className="err">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
      </form>
      <p className="note"><Link href="/auth/login">Back to sign in</Link></p>
    </div>
  );
}
