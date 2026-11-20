"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/** Where a Labo sign-in lands without a ?redirect: clinic staff/provider → /clinic, everyone else → /portal. */
async function laboHome(): Promise<string> {
  try { const r = await fetch("/api/labo/home", { cache: "no-store" }); const j = await r.json(); return j.path === "/provider" ? "/clinic" : (typeof j.path === "string" ? j.path : "/portal"); } catch { return "/portal"; }
}

function LoginInner() {
  const router = useRouter(); const params = useSearchParams();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [show, setShow] = useState(false); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (params.get("error") === "oauth_failed") setError("That sign-in did not complete. Please try again."); }, [params]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setError(error.message === "Invalid login credentials" ? "That email and password don't match." : error.message); setBusy(false); return; }
    const redirect = params.get("redirect");
    const to = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : await laboHome();
    router.push(to); router.refresh();
  }
  return (
    <div className="authcard">
      <span className="kicker">Sign in</span>
      <h2>Welcome back.</h2>
      <p className="authsub">New here? <Link href={`/auth/signup${params.get("redirect") ? `?redirect=${encodeURIComponent(params.get("redirect")!)}` : ""}`}>Create an account</Link></p>
      <form onSubmit={submit} className="authform">
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" /></label>
        <label><span className="lrow">Password<Link href="/auth/forgot" className="more">Forgot it?</Link></span>
          <span className="pwrow"><input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /><button type="button" className="linkbtn" onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"}</button></span></label>
        {error && <p className="err">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="note">Clinic team: use the email your admin added on the Team page.</p>
    </div>
  );
}
export default function LaboLogin() { return <Suspense fallback={null}><LoginInner /></Suspense>; }
