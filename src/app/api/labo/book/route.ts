import { NextRequest, NextResponse } from "next/server";
import { createBooking, openDays, slotsForDay } from "@/lib/labo/booking";
import { getProvider } from "@/lib/labo/provider";
import { createAdminClient } from "@/lib/supabase/admin";

/** The clinic scheduler's API (sandbox, Nov 19 2026).
 *  GET ?service=slug&month=YYYY-MM → { days: [...] }   GET ?service=slug&date=YYYY-MM-DD → { slots: [iso…] }
 *  POST { slug, startsAt, firstName, lastName, email, phone, notes?, intake?, smsConsent?, policyConsent } → { ok, booking | error }
 *  PATCH { id, status } (provider only) → { ok } */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams, service = String(p.get("service") || ""), month = p.get("month"), date = p.get("date");
  try {
    if (month) return NextResponse.json({ days: await openDays(month, service) }, { headers: { "Cache-Control": "private, max-age=30" } });
    if (date) return NextResponse.json({ slots: await slotsForDay(date, service) }, { headers: { "Cache-Control": "private, max-age=15" } });
    return NextResponse.json({ error: "month or date" }, { status: 400 });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  let b: Record<string, unknown> = {}; try { b = await req.json(); } catch { /* empty */ }
  const str = (k: string) => String(b[k] ?? "");
  const intake = b.intake && typeof b.intake === "object" ? Object.fromEntries(Object.entries(b.intake as Record<string, unknown>).filter(([, v]) => typeof v === "string" && v).map(([k, v]) => [k.slice(0, 40), String(v).slice(0, 500)])) : undefined;
  const r = await createBooking({ slug: str("slug"), startsAt: str("startsAt"), firstName: str("firstName"), lastName: str("lastName"), email: str("email"), phone: str("phone"), notes: str("notes"), intake, smsConsent: !!b.smsConsent, policyConsent: !!b.policyConsent, origin: req.nextUrl.origin });
  if (!r.ok) return NextResponse.json(r, { status: r.code === "taken" ? 409 : r.code === "setup" ? 503 : 400 });
  const { cancel_token, ...safe } = r.booking;
  return NextResponse.json({ ok: true, booking: { ...safe, manageToken: cancel_token } });
}

export async function PATCH(req: NextRequest) {
  const user = await getProvider(); if (!user) return NextResponse.json({ ok: false, error: "Provider only" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const status = String(b.status || ""); if (!["booked", "confirmed", "completed", "canceled", "no_show"].includes(status)) return NextResponse.json({ ok: false, error: "bad status" }, { status: 400 });
  const { error } = await createAdminClient().from("labo_bookings").update({ status, updated_at: new Date().toISOString() }).eq("id", String(b.id || ""));
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
