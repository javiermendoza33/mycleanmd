import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { requireStaff } from "@/lib/labo/clinic";
import { getMenuItem } from "@/lib/labo/booking";
import { createAdminClient } from "@/lib/supabase/admin";

/** Staff-side appointments (sandbox, Nov 19 2026).
 *  POST { slug, startsAt, firstName, lastName, phone, email?, notes?, providerId?, force? } — book at ANY time (staff can
 *  override hours); overlaps are refused unless force. PATCH { id, status?, startsAt?, staffNotes?, providerId? }. */
const STATUSES = ["booked", "confirmed", "completed", "canceled", "no_show"];

export async function POST(req: NextRequest) {
  const s = await requireStaff(); if (!s) return NextResponse.json({ ok: false, error: "Staff only" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const item = await getMenuItem(String(b.slug || "")); if (!item) return NextResponse.json({ ok: false, error: "Pick a service" }, { status: 400 });
  const start = new Date(String(b.startsAt || "")); if (isNaN(+start)) return NextResponse.json({ ok: false, error: "Pick a time" }, { status: 400 });
  const min = Math.max(5, Math.min(480, Number(b.durationMin) || item.min)); const end = new Date(+start + min * 60_000);
  const first = String(b.firstName || "").trim(), last = String(b.lastName || "").trim(), phone = String(b.phone || "").replace(/[^\d+]/g, ""), email = String(b.email || "").trim().toLowerCase();
  if (!first) return NextResponse.json({ ok: false, error: "A first name, please" }, { status: 400 });
  const db = createAdminClient();
  if (!b.force) {
    const { data } = await db.from("labo_bookings").select("id, first_name, last_name, starts_at").lt("starts_at", end.toISOString()).gt("ends_at", start.toISOString()).not("status", "in", "(canceled)");
    if (data?.length) return NextResponse.json({ ok: false, error: `Overlaps ${data[0].first_name} ${data[0].last_name} — save anyway?`, code: "overlap" }, { status: 409 });
  }
  const { data, error } = await db.from("labo_bookings").insert({ service_slug: item.slug, service_name: item.name, duration_min: min, starts_at: start.toISOString(), ends_at: end.toISOString(), status: "confirmed", first_name: first, last_name: last || "—", email: email || "none@thelabomethod.com", phone: phone || "—", notes: String(b.notes || "").slice(0, 1000) || null, sms_consent: false, policy_consent: true, cancel_token: randomBytes(18).toString("base64url"), source: "staff", provider_id: b.providerId || null, created_by: s.staff.email }).select("id").single();
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true, id: data.id });
}

export async function PATCH(req: NextRequest) {
  const s = await requireStaff(); if (!s) return NextResponse.json({ ok: false, error: "Staff only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const id = String(b.id || ""); if (!id) return NextResponse.json({ ok: false, error: "id" }, { status: 400 });
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (b.status) { if (!STATUSES.includes(b.status)) return NextResponse.json({ ok: false, error: "bad status" }, { status: 400 }); patch.status = b.status; }
  if (b.startsAt) {
    const db = createAdminClient(); const { data: cur } = await db.from("labo_bookings").select("duration_min").eq("id", id).single();
    const start = new Date(String(b.startsAt)); if (isNaN(+start)) return NextResponse.json({ ok: false, error: "bad time" }, { status: 400 });
    patch.starts_at = start.toISOString(); patch.ends_at = new Date(+start + (Number(b.durationMin) || cur?.duration_min || 30) * 60_000).toISOString();
    if (b.durationMin) patch.duration_min = Number(b.durationMin);
  }
  if (typeof b.staffNotes === "string") patch.staff_notes = b.staffNotes.slice(0, 2000) || null;
  if ("providerId" in b) patch.provider_id = b.providerId || null;
  const { error } = await createAdminClient().from("labo_bookings").update(patch).eq("id", id);
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
