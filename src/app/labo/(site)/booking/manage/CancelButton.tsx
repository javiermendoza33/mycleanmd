"use client";

import { useState } from "react";

export default function CancelButton({ id, token }: { id: string; token: string }) {
  const [state, setState] = useState<"idle" | "sure" | "busy" | "done" | "err">("idle");
  if (state === "done") return <p className="note">Canceled. We hope to see you another time.</p>;
  if (state === "sure") return <><button type="button" className="btn btn-primary" onClick={async () => { setState("busy"); const r = await fetch("/api/labo/book/cancel", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, token }) }); setState(r.ok ? "done" : "err"); }}>Yes, cancel it</button><button type="button" className="btn btn-ghost" onClick={() => setState("idle")}>Keep it</button></>;
  return <><button type="button" className="btn btn-ghost" disabled={state === "busy"} onClick={() => setState("sure")}>Cancel appointment</button>{state === "err" && <p className="err">Couldn&rsquo;t cancel — text us.</p>}</>;
}
