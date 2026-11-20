"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function SignupInner() {
  const router = useRouter(); const params = useSearchParams();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [show, setShow] = useState(false); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [check, setCheck] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const supabase = createClient();
    const redirect = params.get("redirect"); const next = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/portal";
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim(), role: "patient" }, emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
    if (error) { setError(error.message); setBusy(false); return; }
    if (data.user) await supabase.from("profiles").upsert({ id: data.user.id, full_name: name.trim(), role: "patient", email: email.trim() });
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
        <label>Password<span className="pwrow"><input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" /><button type="button" className="linkbtn" onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"}</button></span></label>
        {error && <p className="err">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
      </form>
      <p className="note">By continuing you agree to our <Link href="/privacy-policy">privacy policy</Link>.</p>
    </div>
  );
}
export default function LaboSignup() { return <Suspense fallback={null}><SignupInner /></Suspense>; }
