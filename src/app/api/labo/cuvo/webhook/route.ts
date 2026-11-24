import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cuvo } from "@/lib/cuvo";
import { createAdminClient } from "@/lib/supabase/admin";
import { addEvent, updateCare, type Care } from "@/lib/labo/crm";

/**
 * Cuvo → The Labo Method (Nov 24 2026, built from developers.cuvo.co/docs/webhooks + events-and-realtime).
 * Register with `POST /v1/webhook_endpoints` (scope webhooks:manage) pointing at https://thelabomethod.com/api/labo/cuvo/webhook;
 * the returned `whsec_…` goes in CUVO_WEBHOOK_SECRET. Deliveries are at-least-once and THIN in live mode (resource id + status only),
 * so we verify the signature over the raw body, dedupe on Cuvo-Event-Id, then read the resource back to find the case → the care row.
 * Any 2xx acknowledges; Cuvo retries non-2xx for ~3 days and disables the endpoint after 20 consecutive failures.
 */
const TOLERANCE_S = 300;

function verify(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(",").map(p => p.trim().split("=")).filter(p => p.length === 2)) as Record<string, string>;
  const t = parts.t; if (!t || Math.abs(Date.now() / 1000 - Number(t)) > TOLERANCE_S) return false;
  const want = createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  // during secret rotation the header carries two v1 digests — a match against either is valid
  const given = header.split(",").map(p => p.trim()).filter(p => p.startsWith("v1=")).map(p => p.slice(3));
  return given.some(g => g.length === want.length && timingSafeEqual(Buffer.from(g, "hex"), Buffer.from(want, "hex")));
}

type Envelope = { id: string; type: string; created_at: string; organization?: string; mode?: string; resource?: { type: string; id: string }; status?: string | null; previous_status?: string | null; data?: Record<string, unknown> };

const TITLES: Record<string, string> = {
  "case.received.v1": "Case received", "case.queued.v1": "Case queued for a clinician", "case.in_review.v1": "Clinician is reviewing", "case.visit_required.v1": "A video visit is needed",
  "case.waiting_on_patient.v1": "The clinician has a question for you", "case.waiting_on_integration.v1": "The clinician asked us something", "case.approved.v1": "Approved by the clinician",
  "case.declined.v1": "Not approved", "case.cancelled.v1": "Case cancelled", "case.withdrawn.v1": "Approval withdrawn", "case.question_asked.v1": "Question from the clinician", "case.message_created.v1": "New message on your case",
  "prescription.created.v1": "Prescription written", "prescription.updated.v1": "Prescription updated",
  "order.created.v1": "Order placed with the pharmacy", "order.at_pharmacy.v1": "Pharmacy is preparing your order", "order.shipped.v1": "Shipped", "order.delivered.v1": "Delivered", "order.blocked.v1": "Order on hold",
  "order.failed.v1": "Order failed", "order.ready_for_pickup.v1": "Ready for pickup", "order.picked_up.v1": "Picked up", "order.pharmacy_changed.v1": "Pharmacy changed",
  "visit.booked.v1": "Video visit booked", "visit.rescheduled.v1": "Video visit rescheduled", "visit.cancelled.v1": "Video visit cancelled", "visit.started.v1": "Video visit started", "visit.completed.v1": "Video visit completed", "visit.no_show.v1": "Missed video visit",
  "lab_order.created.v1": "Lab order created", "lab_order.placed.v1": "Lab order placed", "lab_order.status_changed.v1": "Lab order updated", "lab_result.final.v1": "Lab results are in",
};
const CARE_STATUS: Record<string, Care["status"]> = { "case.approved.v1": "active", "case.declined.v1": "declined", "case.cancelled.v1": "cancelled", "case.withdrawn.v1": "cancelled", "case.queued.v1": "filed", "case.in_review.v1": "filed" };

export async function POST(req: NextRequest) {
  const secret = process.env.CUVO_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: false, error: "CUVO_WEBHOOK_SECRET not set" }, { status: 503 });
  const raw = await req.text();
  if (!verify(raw, req.headers.get("cuvo-signature"), secret)) return NextResponse.json({ ok: false, error: "bad signature" }, { status: 400 });
  let ev: Envelope; try { ev = JSON.parse(raw); } catch { return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 }); }
  const eventId = req.headers.get("cuvo-event-id") || ev.id;
  const db = createAdminClient();
  // dedupe: the timeline row for this event already exists → ack and stop
  const { data: seen } = await db.from("labo_customer_events").select("id").eq("data->>cuvo_event_id", eventId).limit(1);
  if (seen && seen.length) return NextResponse.json({ ok: true, duplicate: true });

  // find the case this event belongs to
  const rtype = ev.resource?.type || ev.type.split(".")[0], rid = ev.resource?.id || "";
  let caseId: string | null = null;
  try {
    if (rtype === "case") caseId = rid;
    else if (rtype === "order") caseId = (ev.data?.case as string) || (await cuvo().order(rid)).case || null;
    else if (rtype === "visit") caseId = (ev.data?.case as string) || (await cuvo().visit(rid)).case || null;
    else if (rtype === "prescription" || rtype === "message") caseId = (ev.data?.case as string) || null;
  } catch (e) { console.error("[cuvo webhook] resource read failed:", ev.type, rid, (e as Error).message); }

  let care: Care | null = null;
  if (caseId) { const { data } = await db.from("labo_care").select("*").eq("cuvo_case_id", caseId).maybeSingle(); care = (data as Care) || null; }
  if (!care && rtype === "lab_order" && ev.data?.patient) { const { data } = await db.from("labo_care").select("*").eq("cuvo_patient_id", String(ev.data.patient)).order("created_at", { ascending: false }).limit(1).maybeSingle(); care = (data as Care) || null; }

  const title = TITLES[ev.type] || ev.type;
  if (care) {
    const next = CARE_STATUS[ev.type]; if (next && care.status !== next) await updateCare(care.id, { status: next });
    await addEvent(care.customer_id, "method", rtype, title, { cuvo_event_id: eventId, type: ev.type, resource: rid, status: ev.status ?? null, previous_status: ev.previous_status ?? null, case: caseId, mode: ev.mode ?? null });
  } else {
    // nothing of ours matches yet (a test trigger, or an event for a case we didn't file): keep a trace, still ack
    console.warn("[cuvo webhook] no care row for", ev.type, rtype, rid);
    await addEvent(null, "method", "cuvo", `Unmatched event · ${title}`, { cuvo_event_id: eventId, type: ev.type, resource: rid, status: ev.status ?? null });
  }
  return NextResponse.json({ ok: true });
}
