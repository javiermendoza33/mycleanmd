import { NextResponse } from "next/server";
import { cuvo, cuvoMode } from "@/lib/cuvo";

/** Sandbox-only catalog view (Nov 24 2026): the question sets, medications and states the sandbox exposes, so the real ids can be
 *  wired into the start flow. No patient data; refused unless the server holds a TEST key (404 in mock and live). */
export async function GET() {
  if (cuvoMode() !== "sandbox") {
    // diagnostics only — never the key itself: its prefix family and lengths, so a wrong paste or a stray newline is visible
    const k = process.env.CUVO_API_KEY || "", m = process.env.CUVO_MODE || "";
    return NextResponse.json({ error: "not found", mode: cuvoMode(), mode_env: JSON.stringify(m), key_prefix: k.slice(0, 12), key_len: k.length, key_has_ws: /\s/.test(k) }, { status: 404 });
  }
  const c = cuvo();
  const out: Record<string, unknown> = { mode: "sandbox" };
  for (const [k, fn] of [["question_sets", () => c.questionSets()], ["medications", () => c.medications()], ["states", () => c.states()]] as const) {
    try { out[k] = await fn(); } catch (e) { out[k + "_error"] = (e as Error).message; }
  }
  return NextResponse.json(out, { headers: { "cache-control": "no-store" } });
}
