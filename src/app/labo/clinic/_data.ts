import { createAdminClient } from "@/lib/supabase/admin";
import { missing } from "@/lib/labo/clinic";
export { ptDayRange, ptToUtc, shiftDay, todayPT, dateOfPT } from "@/app/labo/provider/_data";

export type Appt = { id: string; service_slug: string; service_name: string; duration_min: number; starts_at: string; ends_at: string; status: string; first_name: string; last_name: string; email: string; phone: string; notes: string | null; staff_notes: string | null; intake: Record<string, string> | null; sms_consent: boolean; source: string; provider_id: string | null; created_at: string };
export const PILL: Record<string, string> = { booked: "new", confirmed: "ok", completed: "ok", canceled: "", no_show: "bad" };
export const STATUS_LABEL: Record<string, string> = { booked: "Unconfirmed", confirmed: "Confirmed", completed: "Done", canceled: "Canceled", no_show: "No-show" };
export const SETUP = "Booking tables not set up yet — run supabase-labo-bookings.sql and supabase-labo-clinic.sql in the Supabase SQL editor.";

export async function loadAppts(fromIso: string, toIso: string, opts: { includeCanceled?: boolean } = {}): Promise<{ rows: Appt[]; setup: boolean }> {
  let q = createAdminClient().from("labo_bookings").select("*").gte("starts_at", fromIso).lt("starts_at", toIso).order("starts_at");
  if (!opts.includeCanceled) q = q.neq("status", "canceled");
  const { data, error } = await q;
  return { rows: (data ?? []) as Appt[], setup: missing(error) };
}
export async function searchAppts(q: string, status: string): Promise<Appt[]> {
  let s = createAdminClient().from("labo_bookings").select("*").order("starts_at", { ascending: false }).limit(200);
  if (status) s = s.eq("status", status);
  if (q) s = s.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  const { data } = await s; return (data ?? []) as Appt[];
}
export const fullName = (a: { first_name: string; last_name: string }) => `${a.first_name} ${a.last_name === "—" ? "" : a.last_name}`.trim();
