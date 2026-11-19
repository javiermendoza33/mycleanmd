import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/labo/clinic";
import { getMenuItem } from "@/lib/labo/booking";
import { MENU } from "@/labo/clinic/booking";
import { createAdminClient } from "@/lib/supabase/admin";

/** Service overrides (admin only). PATCH { slug, name?, durationMin?, price?, priceNote?, active? } → upsert labo_services. */
export async function PATCH(req: NextRequest) {
  const s = await requireStaff("admin"); if (!s) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const slug = String(b.slug || ""); const base = MENU.find((m) => m.slug === slug);
  if (!base) return NextResponse.json({ ok: false, error: "unknown service" }, { status: 400 });
  const cur = await getMenuItem(slug);
  const row = {
    slug, updated_at: new Date().toISOString(),
    name: typeof b.name === "string" && b.name.trim() ? b.name.trim().slice(0, 120) : (cur?.name ?? base.name),
    duration_min: b.durationMin != null ? Math.max(5, Math.min(480, Number(b.durationMin) || base.min)) : (cur?.min ?? base.min),
    price: b.price === "" || b.price == null ? (b.price === "" ? null : cur?.price ?? base.price) : Math.max(0, Number(b.price) || 0),
    price_note: typeof b.priceNote === "string" ? b.priceNote.slice(0, 60) || null : (cur?.priceNote ?? base.priceNote ?? null),
    active: typeof b.active === "boolean" ? b.active : (cur ? cur.active !== false : true),
  };
  const { error } = await createAdminClient().from("labo_services").upsert(row, { onConflict: "slug" });
  return error ? NextResponse.json({ ok: false, error: error.message }, { status: 500 }) : NextResponse.json({ ok: true });
}
