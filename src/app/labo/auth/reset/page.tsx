"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function LaboReset() {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "ready" | "nosession" | "done">("checking");
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [show, setShow] = useState(false); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { createClient().auth.getUser().then(({ data }) => { if (data.user) { setEmail(data.user.email ?? ""); setState("ready"); } else setState("nosession"); }); }, []);
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
  if (state === "nosession") return (
    <div className="authcard">
      <span className="kicker">Reset password</span>
      <h2>That link has been used or has expired.</h2>
      <p className="authsub">Reset links work once and for a short time. Request a fresh one and open it in the same browser.</p>
      <p className="note" style={{ marginTop: 18 }}><Link className="btn btn-primary" href="/auth/forgot">Send a new reset link</Link></p>
      <p className="note"><Link href="/auth/login">Back to sign in</Link></p>
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
