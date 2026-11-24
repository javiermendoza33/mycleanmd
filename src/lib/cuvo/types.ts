// Cuvo Integrations API types we use (subset of docs/cuvo/cuvo-integrations-openapi.yaml, Nov 23 2026).
export type CaseStatus = "received" | "queued" | "in_review" | "waiting_on_patient" | "waiting_on_integration" | "approved" | "declined" | "cancelled" | "withdrawn";
export type OrderStatus = "created" | "at_pharmacy" | "shipped" | "delivered" | "blocked" | "failed" | "ready_for_pickup" | "picked_up";
export type Address = { line1: string; line2?: string | null; city: string; state: string; postal_code: string; country?: string };
export type Patient = { id: string; external_id?: string | null; first_name: string; last_name: string; date_of_birth: string; sex_at_birth: "male" | "female"; email?: string | null; phone?: string; address?: Address };
export type Consent = { id: string; patient: string; kind: "telehealth" | "privacy"; version: string; accepted_at: string; created_at: string };
export type AnswerType = "boolean" | "number" | "string" | "choice";
export type Answer = { id: string; question: string; answer: string | number | boolean; type: AnswerType; important?: boolean; critical?: boolean; displayed_options?: string[] };
export type QuestionSetQuestion = { id: string; question: string; type: AnswerType; options?: string[]; required?: boolean; important?: boolean; critical?: boolean; help?: string };
export type QuestionSet = { id: string; title: string; category: string | null; version: number; published_at: string; medication_ids: string[]; questions?: QuestionSetQuestion[] };
export type RequestedMedication = { medication_id?: string; retail?: boolean; retail_medication_id?: string; name?: string; quantity?: number; refills?: number; days_supply?: number; directions?: string; pharmacy_notes?: string };
export type Case = { id: string; patient: string; status: CaseStatus; external_id?: string | null; hold: boolean; requested_medications: RequestedMedication[]; consent_ids: string[]; decline_reason?: string | null; decided_at?: string | null; created_at: string; updated_at?: string };
export type StatusHistoryEntry = { status: CaseStatus; at: string; note?: string | null };
export type Message = { id: string; case: string; author: "patient" | "clinician" | "integration" | "staff"; body: string; created_at: string };
export type Prescription = { id: string; case: string; medication: string; sig?: string; quantity?: number; refills?: number; created_at: string };
export type Order = { id: string; case: string; status: OrderStatus; carrier?: string | null; tracking_number?: string | null; tracking_url?: string | null; updated_at: string };
export type VisitSlot = { start: string; end?: string; capacity: number };   // Nov 24 2026: `capacity` per docs/visits (was clinicians_free)
export type Visit = { id: string; patient: string; case?: string | null; status: "scheduled" | "started" | "completed" | "cancelled" | "no_show"; scheduled_start?: string | null; scheduled_end?: string | null; audio_only?: boolean };
export type LabOrder = { id: string; patient: string; case?: string | null; panel: string; status: string; created_at: string };
export type EventType = `${"patient" | "case" | "prescription" | "order" | "lab_order" | "lab_result" | "visit" | "consent" | "file" | "purchase" | "membership" | "charge" | "webhook_endpoint"}.${string}.v1`;
export type CuvoEvent = { id: string; type: EventType; created_at: string; data: Record<string, unknown> };

/** Everything the site needs from Cuvo. `live` talks to api.cuvo.co; `mock` plays the sandbox locally until the test key lands. */
export interface CuvoClient {
  states(): Promise<{ code: string; name: string }[]>;
  questionSets(): Promise<QuestionSet[]>;
  questionSet(id: string, version?: number): Promise<QuestionSet>;
  createPatient(p: Omit<Patient, "id">): Promise<Patient>;
  patient(id: string): Promise<Patient>;
  recordConsent(patient: string, kind: Consent["kind"], version: string): Promise<Consent>;
  fileCase(input: { patient: string; question_set: { id: string; version: number }; answers: Answer[]; requested_medications: RequestedMedication[]; consent_ids: string[]; external_id?: string; hold?: boolean; metadata?: Record<string, string> }): Promise<Case>;
  releaseHold(caseId: string): Promise<Case>;
  case(id: string): Promise<Case>;
  statusHistory(id: string): Promise<StatusHistoryEntry[]>;
  messages(id: string): Promise<Message[]>;
  postMessage(id: string, body: string): Promise<Message>;
  prescriptions(id: string): Promise<Prescription[]>;
  orders(id: string): Promise<Order[]>;
  /** Open slots for a STATE (two-letter) over a window of at most 14 days; `capacity` = clinicians free, never who. */
  visitSlots(state: string, from?: string, to?: string): Promise<VisitSlot[]>;
  /** Books `slot_start`; needs an Idempotency-Key (the live client adds one). */
  bookVisit(patient: string, slotStart: string, caseId?: string, audioOnly?: boolean): Promise<Visit>;
  joinLink(visitId: string): Promise<{ url: string; expires_at: string }>;
  /** Thin webhook events name only a resource id — these two read the order / visit back to find its case (Nov 24 2026). */
  order(id: string): Promise<Order>;
  visit(id: string): Promise<Visit>;
  labOrders(patient: string): Promise<LabOrder[]>;
}
