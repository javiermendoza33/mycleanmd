import { NextResponse, type NextRequest } from "next/server";
import { cuvo, cuvoMode } from "@/lib/cuvo";

/** Sandbox driver (Nov 24 2026): advance a test case the way Cuvo's `/v1/test/*` endpoints do (clinician decision, pharmacy ship,
 *  deliver…). Refused unless the server holds a TEST key — with a live key Cuvo itself answers 403 and nothing here can touch a patient.
 *  Body: { path: "cases/<id>/decision", body: { decision: "approved" } }  (any /v1/test/<path>). */
export async function POST(req: NextRequest) {
  if (cuvoMode() !== "sandbox") return NextResponse.json({ error: "not found" }, { status: 404 });
  const b = await req.json().catch(() => ({})) as { path?: string; body?: Record<string, unknown> };
  const path = String(b.path || "").replace(/^\/+/, "");
  if (!/^(cases|visits|lab_orders|purchases|webhooks|autopilot|reset)(\/[A-Za-z0-9_-]+)*$/.test(path)) return NextResponse.json({ error: "bad path" }, { status: 400 });
  try { return NextResponse.json({ ok: true, result: await cuvo().testAction(path, b.body) }); }
  catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 }); }
}
