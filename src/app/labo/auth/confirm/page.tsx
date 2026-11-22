"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * /auth/confirm (Nov 22 2026): where the sign-up confirmation and magic-link emails land. The email carries
 * ?token_hash=…&type=signup|magiclink and nothing is consumed by opening the page; the person presses Continue and
 * verifyOtp runs in this browser (any device, any mail app). Then they go to their portal.
 */
async function laboHome(): Promise<string> {
  try { const r = await fetch("/api/labo/home", { cache: "no-store" }); const j = await r.json(); return j.path === "/provider" ? "/clinic" : (typeof j.path === "string" ? j.path : "/portal"); } catch { return "/portal"; }
}

function ConfirmInner() {
  const router = useRouter(); const params = useSearchParams();
  const tokenHash = params.get("token_hash"); const t = params.get("type");
  const type = t === "signup" || t === "email" ? "signup" : t === "magiclink" ? "magiclink" : null;
  const [state, setState] = useState<"ready" | "busy" | "done" | "bad">(tokenHash && type ? "ready" : "bad");
  const [error, setError] = useState("");
  useEffect(() => { if (!tokenHash || !type) setError("This link is missing its code. Open the newest email we sent you."); }, [tokenHash, type]);
  async function go() {
    setState("busy"); setError("");
    const { data, error } = await createClient().auth.verifyOtp({ token_hash: tokenHash!, type: type as "signup" | "magiclink" });
    if (error || !data.session) { setState("bad"); setError("This link has already been used or has expired. Sign in, or request a new one."); return; }
    setState("done"); const to = await laboHome(); router.push(to); router.refresh();
  }
  if (state === "done") return <div className="authcard"><span className="kicker">Welcome</span><h2>You&rsquo;re in.</h2><p className="authsub">Opening your portal…</p></div>;
  return (
    <div className="authcard">
      <span className="kicker">{type === "magiclink" ? "Sign in" : "Confirm your email"}</span>
      <h2>{type === "magiclink" ? "Ready to sign you in." : "One tap to finish."}</h2>
      <p className="authsub">{type === "magiclink" ? "Press continue to sign in on this device." : "Press continue to confirm your email and open your member portal."}</p>
      {error && <p className="err">{error}</p>}
      <p style={{ marginTop: 18 }}><button type="button" className="btn btn-primary" disabled={state !== "ready"} onClick={go}>{state === "busy" ? "One moment…" : "Continue"}</button></p>
      <p className="note"><Link href="/auth/login">Sign in instead</Link></p>
    </div>
  );
}
export default function LaboConfirm() { return <Suspense fallback={null}><ConfirmInner /></Suspense>; }
