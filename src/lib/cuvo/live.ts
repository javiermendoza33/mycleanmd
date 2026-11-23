import "server-only";
import { randomUUID } from "node:crypto";
import type { Answer, Case, Consent, CuvoClient, LabOrder, Message, Order, Patient, Prescription, QuestionSet, RequestedMedication, StatusHistoryEntry, Visit, VisitSlot } from "./types";

/** The real Cuvo Integrations API (api.cuvo.co). Bearer secret key; every write carries an Idempotency-Key; errors are problem+json. */
export function liveClient(key: string, base = "https://api.cuvo.co"): CuvoClient {
  async function call<T>(method: string, path: string, body?: unknown, idem?: string): Promise<T> {
    const r = await fetch(base + path, { method, headers: { authorization: `Bearer ${key}`, accept: "application/json", ...(body ? { "content-type": "application/json" } : {}), ...(method !== "GET" ? { "idempotency-key": idem || randomUUID() } : {}) }, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
    if (!r.ok) { const p = await r.json().catch(() => ({})) as { title?: string; detail?: string; code?: string; request_id?: string }; throw new Error(`Cuvo ${r.status} ${p.code || ""}: ${p.detail || p.title || r.statusText}${p.request_id ? ` (request ${p.request_id})` : ""}`); }
    return r.status === 204 ? (undefined as T) : (await r.json() as T);
  }
  const list = <T,>(path: string) => call<{ data?: T[] } | T[]>("GET", path).then(j => (Array.isArray(j) ? j : j.data || []));
  return {
    states: () => list("/v1/states"),
    questionSets: () => list("/v1/question_sets"),
    questionSet: (id, version) => call<QuestionSet>("GET", `/v1/question_sets/${encodeURIComponent(id)}${version ? `?version=${version}` : ""}`),
    createPatient: p => call<Patient>("POST", "/v1/patients", p, p.external_id ? `patient:${p.external_id}` : undefined),
    patient: id => call<Patient>("GET", `/v1/patients/${id}`),
    recordConsent: (patient, kind, version) => call<Consent>("POST", `/v1/patients/${patient}/consents`, { kind, version, accepted_at: new Date().toISOString() }),
    fileCase: input => call<Case>("POST", "/v1/cases", input, input.external_id ? `case:${input.external_id}` : undefined),
    releaseHold: id => call<Case>("POST", `/v1/cases/${id}/release_hold`),
    case: id => call<Case>("GET", `/v1/cases/${id}`),
    statusHistory: id => list<StatusHistoryEntry>(`/v1/cases/${id}/status_history`),
    messages: id => list<Message>(`/v1/cases/${id}/messages`),
    postMessage: (id, body) => call<Message>("POST", `/v1/cases/${id}/messages`, { author: "patient", body }),
    prescriptions: id => list<Prescription>(`/v1/cases/${id}/prescriptions`),
    orders: id => list<Order>(`/v1/cases/${id}/orders`),
    visitSlots: (patient, from) => list<VisitSlot>(`/v1/visits/slots?patient=${patient}${from ? `&from=${encodeURIComponent(from)}` : ""}`),
    bookVisit: (patient, start, caseId) => call<Visit>("POST", "/v1/visits", { patient, start, ...(caseId ? { case: caseId } : {}) }),
    joinLink: id => call<{ url: string; expires_at: string }>("GET", `/v1/visits/${id}/join`),
    labOrders: patient => list<LabOrder>(`/v1/lab_orders?patient=${patient}`),
  } satisfies CuvoClient & { fileCase: (i: { answers: Answer[]; requested_medications: RequestedMedication[] } & Record<string, unknown>) => Promise<Case> };
}
