import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";

/** Clinic hours (admin only): POST { hours } → labo_provider_settings.hours (the same row the provider profile edits). */
export async function POST(req: NextRequest) {
  const s = await requireStaff("admin"); if (!s) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const h = b.hours;
  if (!h || typeof h !== "object") return NextResponse.json({ ok: false, error: "hours" }, { status: 400 });
  const ok = /^\d{2}:\d{2}$/; const hours: Record<string, { on: boolean; from: string; to: string }> = {};
  for (const d of ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]) { const x = h[d] || {}; hours[d] = { on: !!x.on, from: ok.test(x.from) ? x.from : "10:00", to: ok.test(x.to) ? x.to : "18:00" }; }
  const { error } = await createAdminClient().from("labo_provider_settings").upsert({ id: 1, hours, updated_at: new Date().toISOString() }, { onConflict: "id" });
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
