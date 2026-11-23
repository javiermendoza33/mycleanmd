import "server-only";
import type { Case, CaseStatus, Consent, CuvoClient, LabOrder, Message, Order, OrderStatus, Patient, Prescription, QuestionSet, StatusHistoryEntry, Visit, VisitSlot } from "./types";

/* The sandbox, played locally (Nov 23 2026) so the sign-up → case → plan → shipping experience can be built before the
   Cuvo test key arrives. In-memory per server instance; an "autopilot" moves a filed case through review, approval, a
   prescription and an order on a short clock, the way PATCH /v1/test/autopilot does on the real sandbox. */
const id = (p: string) => `${p}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
const now = () => new Date().toISOString();
type Store = { patients: Map<string, Patient>; consents: Map<string, Consent[]>; cases: Map<string, Case>; history: Map<string, StatusHistoryEntry[]>; messages: Map<string, Message[]>; rx: Map<string, Prescription[]>; orders: Map<string, Order[]>; visits: Map<string, Visit>; labs: Map<string, LabOrder[]> };
const g = globalThis as unknown as { __cuvoMock?: Store };
const db: Store = g.__cuvoMock ||= { patients: new Map(), consents: new Map(), cases: new Map(), history: new Map(), messages: new Map(), rx: new Map(), orders: new Map(), visits: new Map(), labs: new Map() };

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

const push = (c: Case, status: CaseStatus, note?: string) => { c.status = status; c.updated_at = now(); db.history.get(c.id)!.push({ status, at: now(), note: note ?? null }); };
const autopilot = (c: Case) => {   // review → approve → prescription → order → shipped → delivered on a short clock
  const t = (ms: number, f: () => void) => setTimeout(() => { const cur = db.cases.get(c.id); if (cur && !["cancelled", "withdrawn", "declined"].includes(cur.status) && !cur.hold) f(); }, ms);
  t(4000, () => push(c, "queued"));
  t(9000, () => push(c, "in_review"));
  t(16000, () => { push(c, "approved", "Reviewed by the clinician"); c.decided_at = now();
    db.rx.set(c.id, [{ id: id("rx"), case: c.id, medication: c.requested_medications[0]?.medication_id || "as prescribed", sig: "Inject 0.25 mg subcutaneously once weekly for 4 weeks, then step up as directed.", quantity: 1, refills: 0, created_at: now() }]);
    db.orders.set(c.id, [{ id: id("ord"), case: c.id, status: "created", updated_at: now() }]);
    db.messages.get(c.id)!.push({ id: id("msg"), case: c.id, author: "clinician", body: "Reviewed your intake and labs. You're a good fit to start. I've sent your first month to the pharmacy; it ships cold, so keep it refrigerated when it arrives. Message me here with anything at all.", created_at: now() }); });
  const ord = (s: OrderStatus, ms: number, extra?: Partial<Order>) => t(ms, () => { const o = db.orders.get(c.id)?.[0]; if (o) Object.assign(o, { status: s, updated_at: now() }, extra); });
  ord("at_pharmacy", 22000); ord("shipped", 30000, { carrier: "FedEx", tracking_number: "7489 2201 0934", tracking_url: "https://www.fedex.com/fedextrack/?trknbr=748922010934" }); ord("delivered", 45000);
};

export const mockClient: CuvoClient = {
  states: async () => [{ code: "CA", name: "California" }, { code: "WA", name: "Washington" }],
  questionSets: async () => MOCK_SETS.map(({ questions: _q, ...s }) => s),
  questionSet: async (qid) => { const s = MOCK_SETS.find(x => x.id === qid); if (!s) throw new Error("Cuvo 404 not_found: question set"); return s; },
  createPatient: async p => { const existing = p.external_id && [...db.patients.values()].find(x => x.external_id === p.external_id); if (existing) return existing; const pat = { ...p, id: id("pat") }; db.patients.set(pat.id, pat); db.consents.set(pat.id, []); db.labs.set(pat.id, []); return pat; },
  patient: async pid => { const p = db.patients.get(pid); if (!p) throw new Error("Cuvo 404 not_found: patient"); return p; },
  recordConsent: async (patient, kind, version) => { const c = { id: id("cons"), patient, kind, version, accepted_at: now(), created_at: now() }; db.consents.get(patient)?.push(c); return c; },
  fileCase: async input => {
    const dup = input.external_id && [...db.cases.values()].find(x => x.external_id === input.external_id); if (dup) return dup;
    const c: Case = { id: id("case"), patient: input.patient, status: "received", external_id: input.external_id ?? null, hold: !!input.hold, requested_medications: input.requested_medications, consent_ids: input.consent_ids, created_at: now(), updated_at: now() };
    db.cases.set(c.id, c); db.history.set(c.id, [{ status: "received", at: now(), note: null }]); db.messages.set(c.id, []); if (!c.hold) autopilot(c); return c;
  },
  releaseHold: async cid => { const c = db.cases.get(cid); if (!c) throw new Error("Cuvo 404 not_found: case"); if (c.hold) { c.hold = false; autopilot(c); } return c; },
  case: async cid => { const c = db.cases.get(cid); if (!c) throw new Error("Cuvo 404 not_found: case"); return c; },
  statusHistory: async cid => db.history.get(cid) || [],
  messages: async cid => db.messages.get(cid) || [],
  postMessage: async (cid, body) => { const m = { id: id("msg"), case: cid, author: "patient" as const, body, created_at: now() }; db.messages.get(cid)?.push(m);
    setTimeout(() => db.messages.get(cid)?.push({ id: id("msg"), case: cid, author: "clinician", body: "Got it — I'll take a look and get back to you shortly.", created_at: now() }), 6000); return m; },
  prescriptions: async cid => db.rx.get(cid) || [],
  orders: async cid => db.orders.get(cid) || [],
  visitSlots: async () => { const out: VisitSlot[] = []; const d = new Date(); d.setDate(d.getDate() + 1); for (let day = 0; day < 5; day++) for (const h of [9, 10, 13, 15, 16]) { const s = new Date(d); s.setDate(d.getDate() + day); s.setHours(h, day % 2 ? 20 : 40, 0, 0); const e = new Date(s.getTime() + 20 * 60e3); out.push({ start: s.toISOString(), end: e.toISOString(), clinicians_free: 1 + (h % 3) }); } return out; },
  bookVisit: async (patient, start, caseId) => { const v: Visit = { id: id("vis"), patient, case: caseId ?? null, status: "scheduled", scheduled_start: start, scheduled_end: new Date(new Date(start).getTime() + 20 * 60e3).toISOString(), audio_only: false }; db.visits.set(v.id, v); return v; },
  joinLink: async vid => { if (!db.visits.get(vid)) throw new Error("Cuvo 404 not_found: visit"); return { url: `https://visit.cuvo.co/join/${vid}`, expires_at: new Date(Date.now() + 10 * 60e3).toISOString() }; },
  labOrders: async patient => db.labs.get(patient) || [],
};
