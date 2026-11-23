import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { missing } from "@/lib/labo/clinic";

/* The Labo CRM (Nov 23 2026): one person across The Labo Clinic and The Labo Method. Tables in supabase-labo-crm.sql. */
export type Brand = "clinic" | "method";
export type Customer = { id: string; email: string; first_name: string; last_name: string; phone: string | null; state: string | null; brands: Brand[]; source: string | null; user_id: string | null; cuvo_patient_id: string | null; stripe_customer_id: string | null; sms_consent: boolean; email_consent: boolean; tags: string[]; notes: string | null; created_at: string; updated_at: string };
export type CustomerEvent = { id: string; customer_id: string; brand: Brand; kind: string; title: string; data: Record<string, unknown>; at: string };
export type Care = { id: string; customer_id: string; user_id: string | null; program_slug: string; cuvo_patient_id: string | null; cuvo_case_id: string | null; cuvo_mode: string; status: string; stripe_checkout_session_id: string | null; paid_at: string | null; created_at: string; updated_at: string };

const db = () => createAdminClient();
const norm = (e: string) => e.trim().toLowerCase();

/** Create or update the person behind an email; brands accumulate, blanks never overwrite values. */
export async function upsertCustomer(c: { email: string; first_name?: string; last_name?: string; phone?: string | null; state?: string | null; brand: Brand; source?: string; user_id?: string | null; sms_consent?: boolean; email_consent?: boolean; cuvo_patient_id?: string | null; stripe_customer_id?: string | null }): Promise<Customer | null> {
  const a = db(); const email = norm(c.email);
  const { data: cur, error } = await a.from("labo_customers").select("*").eq("email", email).maybeSingle();
  if (error && missing(error)) return null;   // CRM tables not created yet: the caller carries on without a customer row
  const brands = Array.from(new Set([...(cur?.brands || []), c.brand]));
  const row = {
    email, brands, updated_at: new Date().toISOString(),
    first_name: c.first_name || cur?.first_name || "", last_name: c.last_name || cur?.last_name || "",
    phone: c.phone || cur?.phone || null, state: c.state || cur?.state || null, source: cur?.source || c.source || null,
    user_id: c.user_id || cur?.user_id || null, cuvo_patient_id: c.cuvo_patient_id || cur?.cuvo_patient_id || null, stripe_customer_id: c.stripe_customer_id || cur?.stripe_customer_id || null,
    sms_consent: c.sms_consent ?? cur?.sms_consent ?? false, email_consent: c.email_consent ?? cur?.email_consent ?? false,
  };
  const { data } = await a.from("labo_customers").upsert(row, { onConflict: "email" }).select("*").single();
  return (data as Customer) || null;
}
export async function addEvent(customer_id: string | null | undefined, brand: Brand, kind: string, title: string, data: Record<string, unknown> = {}) {
  if (!customer_id) return; await db().from("labo_customer_events").insert({ customer_id, brand, kind, title, data }).then(() => {});
}
export async function listCustomers(q = "", brand?: Brand): Promise<{ rows: (Customer & { events: number; last_at: string | null })[]; setup: boolean }> {
  const a = db(); let s = a.from("labo_customers").select("*").order("updated_at", { ascending: false }).limit(300);
  if (q) s = s.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  if (brand) s = s.contains("brands", [brand]);
  const { data, error } = await s; if (error) return { rows: [], setup: missing(error) };
  const ids = (data || []).map(r => r.id);
  const { data: ev } = ids.length ? await a.from("labo_customer_events").select("customer_id, at").in("customer_id", ids) : { data: [] as { customer_id: string; at: string }[] };
  const agg = new Map<string, { n: number; last: string | null }>();
  for (const e of ev || []) { const x = agg.get(e.customer_id) || { n: 0, last: null }; x.n++; if (!x.last || e.at > x.last) x.last = e.at; agg.set(e.customer_id, x); }
  return { rows: (data as Customer[]).map(r => ({ ...r, events: agg.get(r.id)?.n || 0, last_at: agg.get(r.id)?.last || null })), setup: false };
}
export async function getCustomer(id: string): Promise<{ customer: Customer; events: CustomerEvent[]; care: Care[] } | null> {
  const a = db(); const { data: customer } = await a.from("labo_customers").select("*").eq("id", id).maybeSingle(); if (!customer) return null;
  const [{ data: events }, { data: care }] = await Promise.all([a.from("labo_customer_events").select("*").eq("customer_id", id).order("at", { ascending: false }).limit(200), a.from("labo_care").select("*").eq("customer_id", id).order("created_at", { ascending: false })]);
  return { customer: customer as Customer, events: (events || []) as CustomerEvent[], care: (care || []) as Care[] };
}
export const careFor = async (user_id: string): Promise<Care[]> => { const { data } = await db().from("labo_care").select("*").eq("user_id", user_id).order("created_at", { ascending: false }); return (data || []) as Care[]; };
export const careById = async (id: string): Promise<Care | null> => { const { data } = await db().from("labo_care").select("*").eq("id", id).maybeSingle(); return (data as Care) || null; };
export const updateCare = async (id: string, patch: Partial<Care>) => { await db().from("labo_care").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id); };
