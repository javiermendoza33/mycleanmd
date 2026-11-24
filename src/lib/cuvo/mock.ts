import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Case, CaseStatus, Consent, CuvoClient, LabOrder, Message, Order, OrderStatus, Patient, Prescription, QuestionSet, StatusHistoryEntry, Visit, VisitSlot } from "./types";

/* The sandbox, played locally (Nov 23 2026) so the sign-up → case → plan → shipping experience can be built before the
   Cuvo test key arrives. STATELESS: a case's progress is derived from the clock that starts when its care row is paid
   (labo_care.paid_at), so every serverless instance and every deploy sees the same story — the way PATCH /v1/test/autopilot
   moves a real sandbox case. Patient messages are kept as CRM events on the customer. */
const id = (p: string) => `${p}_${randomBytes(6).toString("hex")}`;
const iso = (ms: number) => new Date(ms).toISOString();
const MED: Record<string, [string, string]> = { "glp-1-weight-management": ["Semaglutide (compounded) 2.5 mg/mL", "Inject 0.25 mg subcutaneously once weekly for 4 weeks, then step up as directed."], "testosterone-for-men": ["Testosterone cypionate 200 mg/mL", "Inject 0.5 mL intramuscularly once weekly."], "hormone-therapy-for-women": ["Estradiol patch 0.05 mg/day", "Apply one patch twice weekly; progesterone 100 mg nightly as directed."], "peptide-therapy": ["BPC-157 5 mg", "Reconstitute and inject 250 mcg subcutaneously daily, as directed."] };
// the autopilot clock, seconds after payment
const T = { queued: 4, in_review: 9, approved: 16, at_pharmacy: 22, shipped: 30, delivered: 45 };

/** Question sets shaped like Cuvo's (`QuestionSetQuestion`): the GLP-1 and hormone intakes as placeholders until we read the real ones. */
export const MOCK_SETS: QuestionSet[] = [
  { id: "glp1-weight-management", title: "GLP-1 weight management", category: "weight_loss", version: 1, published_at: "2026-11-01T00:00:00Z", medication_ids: ["semaglutide-compounded", "tirzepatide-compounded"], questions: [
    { id: "goal", question: "What is your main goal?", type: "choice", options: ["Lose weight", "Keep weight off", "Improve labs (A1c, cholesterol)"], required: true },
    { id: "height_in", question: "Height (inches)", type: "number", required: true },
    { id: "weight_lb", question: "Current weight (lb)", type: "number", required: true },
    { id: "glp1_before", question: "Have you taken a GLP-1 (semaglutide, tirzepatide, liraglutide) before?", type: "boolean", required: true },
    { id: "thyroid_cancer", question: "Personal or family history of medullary thyroid cancer or MEN2?", type: "boolean", required: true, critical: true },
    { id: "pancreatitis", question: "History of pancreatitis?", type: "boolean", required: true, important: true },
    { id: "pregnant", question: "Pregnant, breastfeeding, or planning pregnancy in the next 6 months?", type: "boolean", required: true, critical: true },
    { id: "meds", question: "Current medications and supplements", type: "string" },
    { id: "allergies", question: "Allergies", type: "string" },
    { id: "a1c", question: "Most recent A1c, if you know it", type: "number", help: "Leave blank if you don't; we'll order labs." },
  ] },
  { id: "hormone-care", title: "Hormone care (TRT · menopause)", category: "hormone", version: 1, published_at: "2026-11-01T00:00:00Z", medication_ids: ["testosterone-cypionate", "estradiol-patch", "progesterone-micronized"], questions: [
    { id: "concern", question: "What brings you in?", type: "choice", options: ["Low energy / libido", "Hot flashes / sleep", "Mood changes", "Something else"], required: true },
    { id: "duration", question: "How long has this been going on?", type: "choice", options: ["Under 3 months", "3–12 months", "Over a year"], required: true },
    { id: "prior_hrt", question: "Have you used hormone therapy before?", type: "boolean", required: true },
    { id: "clots", question: "History of blood clots, stroke or breast/prostate cancer?", type: "boolean", required: true, critical: true },
    { id: "recent_labs", question: "Had hormone labs in the last 6 months?", type: "boolean", required: true },
    { id: "meds", question: "Current medications and supplements", type: "string" },
    { id: "allergies", question: "Allergies", type: "string" },
  ] },
];

type CareRow = { id: string; customer_id: string; program_slug: string; cuvo_patient_id: string | null; cuvo_case_id: string; status: string; paid_at: string | null; created_at: string };
const careByCase = async (caseId: string): Promise<CareRow> => { const { data } = await createAdminClient().from("labo_care").select("id, customer_id, program_slug, cuvo_patient_id, cuvo_case_id, status, paid_at, created_at").eq("cuvo_case_id", caseId).maybeSingle(); if (!data) throw new Error("Cuvo 404 not_found: case"); return data as CareRow; };
const clock = (c: CareRow) => (c.paid_at ? (Date.now() - new Date(c.paid_at).getTime()) / 1000 : -1);   // seconds since payment, -1 while on hold
const statusAt = (s: number): CaseStatus => (s < 0 ? "received" : s < T.queued ? "received" : s < T.in_review ? "queued" : s < T.approved ? "in_review" : "approved");

export const mockClient: CuvoClient = {
  medications: async () => [{ id: "semaglutide-compounded", name: "Semaglutide (compounded)", category: "weight-management" }, { id: "testosterone-cypionate", name: "Testosterone cypionate", category: "hormone", controlled: true }],
  states: async () => [{ code: "CA", name: "California" }, { code: "WA", name: "Washington" }],
  questionSets: async () => MOCK_SETS.map(({ questions: _q, ...s }) => s),
  questionSet: async (qid) => { const s = MOCK_SETS.find(x => x.id === qid); if (!s) throw new Error("Cuvo 404 not_found: question set"); return s; },
  createPatient: async p => ({ ...p, id: `pat_${createHash("sha1").update(p.external_id || p.email || randomBytes(8).toString("hex")).digest("hex").slice(0, 16)}` }),
  patient: async pid => { const { data } = await createAdminClient().from("labo_customers").select("first_name, last_name, email, phone, state").eq("cuvo_patient_id", pid).maybeSingle(); if (!data) throw new Error("Cuvo 404 not_found: patient"); return { id: pid, first_name: data.first_name, last_name: data.last_name, email: data.email, phone: data.phone || "", date_of_birth: "1990-01-01", sex_at_birth: "female" }; },
  recordConsent: async (patient, kind, version) => ({ id: id("cons"), patient, kind, version, accepted_at: iso(Date.now()), created_at: iso(Date.now()) }),
  fileCase: async input => ({ id: id("case"), patient: input.patient, status: "received", external_id: input.external_id ?? null, hold: !!input.hold, requested_medications: input.requested_medications, consent_ids: input.consent_ids, created_at: iso(Date.now()), updated_at: iso(Date.now()) }),
  releaseHold: async cid => mockClient.case(cid),   // the caller stamps labo_care.paid_at, which is this sandbox's clock
  case: async cid => { const c = await careByCase(cid); const s = clock(c); const med = MED[c.program_slug]?.[0] || "as prescribed";
    return { id: cid, patient: c.cuvo_patient_id || "", status: statusAt(s), external_id: c.id, hold: s < 0, requested_medications: [{ name: med, quantity: 1, refills: 0, days_supply: 30 }], consent_ids: [], decided_at: s >= T.approved ? iso(new Date(c.paid_at!).getTime() + T.approved * 1000) : null, created_at: c.created_at, updated_at: iso(Date.now()) }; },
  statusHistory: async cid => { const c = await careByCase(cid); const s = clock(c); const t0 = c.paid_at ? new Date(c.paid_at).getTime() : 0;
    const out: StatusHistoryEntry[] = [{ status: "received", at: c.created_at, note: null }];
    if (s >= T.queued) out.push({ status: "queued", at: iso(t0 + T.queued * 1000), note: null });
    if (s >= T.in_review) out.push({ status: "in_review", at: iso(t0 + T.in_review * 1000), note: null });
    if (s >= T.approved) out.push({ status: "approved", at: iso(t0 + T.approved * 1000), note: "Reviewed by the clinician" });
    return out; },
  messages: async cid => { const c = await careByCase(cid); const s = clock(c); const t0 = c.paid_at ? new Date(c.paid_at).getTime() : 0; const out: Message[] = [];
    if (s >= T.approved) out.push({ id: `msg_${cid}_rx`, case: cid, author: "clinician", body: "Reviewed your intake and labs. You're a good fit to start. I've sent your first month to the pharmacy; it ships cold, so keep it refrigerated when it arrives. Message me here with anything at all.", created_at: iso(t0 + T.approved * 1000) });
    const { data: ev } = await createAdminClient().from("labo_customer_events").select("id, data, at").eq("customer_id", c.customer_id).eq("kind", "message").order("at");
    for (const e of ev || []) { const d = e.data as { case?: string; body?: string }; if (d.case !== cid || !d.body) continue; out.push({ id: e.id, case: cid, author: "patient", body: d.body, created_at: e.at });
      if (Date.now() - new Date(e.at).getTime() > 6000) out.push({ id: e.id + "_re", case: cid, author: "clinician", body: "Got it — I'll take a look and get back to you shortly.", created_at: iso(new Date(e.at).getTime() + 6000) }); }
    return out.sort((a, b) => a.created_at.localeCompare(b.created_at)); },
  postMessage: async (cid, body) => { await careByCase(cid); return { id: id("msg"), case: cid, author: "patient", body, created_at: iso(Date.now()) }; },   // the API route records it as a CRM event (data.body), which messages() reads back
  prescriptions: async cid => { const c = await careByCase(cid); const s = clock(c); if (s < T.approved) return []; const [medication, sig] = MED[c.program_slug] || ["As prescribed", ""]; return [{ id: `rx_${cid}`, case: cid, medication, sig, quantity: 1, refills: 0, created_at: iso(new Date(c.paid_at!).getTime() + T.approved * 1000) }] as Prescription[]; },
  orders: async cid => { const c = await careByCase(cid); const s = clock(c); if (s < T.approved) return []; const st: OrderStatus = s < T.at_pharmacy ? "created" : s < T.shipped ? "at_pharmacy" : s < T.delivered ? "shipped" : "delivered";
    return [{ id: `ord_${cid}`, case: cid, status: st, updated_at: iso(Date.now()), ...(s >= T.shipped ? { carrier: "FedEx", tracking_number: "7489 2201 0934", tracking_url: "https://www.fedex.com/fedextrack/?trknbr=748922010934" } : {}) }] as Order[]; },
  visitSlots: async (_state, from) => { const out: VisitSlot[] = []; const d = from ? new Date(from) : new Date(); d.setDate(d.getDate() + 1); for (let day = 0; day < 5; day++) for (const h of [9, 10, 13, 15, 16]) { const s = new Date(d); s.setDate(d.getDate() + day); s.setHours(h, day % 2 ? 30 : 0, 0, 0); out.push({ start: s.toISOString(), end: new Date(s.getTime() + 20 * 60e3).toISOString(), capacity: 1 + (h % 3) }); } return out; },
  bookVisit: async (patient, slotStart, caseId, audioOnly) => ({ id: id("vis"), patient, case: caseId ?? null, status: "scheduled", scheduled_start: slotStart, scheduled_end: new Date(new Date(slotStart).getTime() + 20 * 60e3).toISOString(), audio_only: !!audioOnly } as Visit),
  testAction: async () => ({ ok: true }),
  order: async oid => ({ id: oid, case: "", status: "shipped", carrier: null, tracking_number: null, tracking_url: null, updated_at: iso(Date.now()) } as Order),
  visit: async vid => ({ id: vid, patient: "", case: null, status: "scheduled", scheduled_start: null, scheduled_end: null, audio_only: false } as Visit),
  joinLink: async vid => ({ url: `https://visit.cuvo.co/join/${vid}`, expires_at: iso(Date.now() + 10 * 60e3) }),
  labOrders: async () => [] as LabOrder[],
};
