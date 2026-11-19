import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isProviderEmail } from "@/lib/labo/provider";

/**
 * Who may open /clinic (sandbox, Nov 19 2026). Two roles: `admin` (everything: team, services, hours) and `staff`
 * (appointments, calendar, customers, blocks). The LABO_PROVIDER_EMAIL allowlist is always admin, so the portal works
 * before the staff table has a row — Monika/Javier bootstrap the team from /clinic/team. Everyone signs in through the
 * existing Supabase email/password pages; a staff row with that email is what grants access.
 */
export type Role = "admin" | "staff";
export type Staff = { id: string | null; email: string; name: string; role: Role; active: boolean; color: string | null };
export type Block = { id: string; staff_id: string | null; starts_at: string; ends_at: string; reason: string | null; created_by: string | null };
export type ServiceOverride = { slug: string; name: string | null; duration_min: number | null; price: number | null; price_note: string | null; active: boolean };

export const missing = (e: { code?: string; message?: string } | null | undefined) => !!e && (e.code === "42P01" || /does not exist|schema cache/i.test(e.message || ""));

export async function getStaff(): Promise<{ user: { id: string; email: string }; staff: Staff } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const email = user.email.toLowerCase();
  let row: (Staff & { id: string }) | null = null;
  try { const { data } = await createAdminClient().from("labo_staff").select("*").eq("email", email).maybeSingle(); row = data as (Staff & { id: string }) | null; } catch { row = null; }
  if (row?.active) return { user: { id: user.id, email }, staff: row };
  if (isProviderEmail(email)) return { user: { id: user.id, email }, staff: { id: row?.id ?? null, email, name: (user.user_metadata?.full_name as string) || "Admin", role: "admin", active: true, color: null } };
  return null;
}
export async function requireStaff(role?: Role) {
  const s = await getStaff(); if (!s) return null;
  if (role === "admin" && s.staff.role !== "admin") return null;
  return s;
}
export async function listStaff(): Promise<{ rows: Staff[]; setup: boolean }> {
  const { data, error } = await createAdminClient().from("labo_staff").select("*").order("created_at");
  return { rows: (data ?? []) as Staff[], setup: missing(error) };
}
export async function loadBlocks(fromIso: string, toIso: string): Promise<Block[]> {
  const { data, error } = await createAdminClient().from("labo_blocks").select("*").lt("starts_at", toIso).gt("ends_at", fromIso).order("starts_at");
  return error ? [] : (data as Block[]);
}
export async function loadOverrides(): Promise<ServiceOverride[]> {
  const { data, error } = await createAdminClient().from("labo_services").select("*");
  return error ? [] : (data as ServiceOverride[]);
}
