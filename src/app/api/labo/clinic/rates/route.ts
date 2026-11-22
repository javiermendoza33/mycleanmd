import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";
import { products } from "@/labo/clinic/products";

/**
 * Rate plans (admin only).
 *   PATCH { slug, cost?: number|null, draftPrice?: number|null } → upsert the row (cost on any line; draft price only on
 *         unlocked lines). Cost changes are logged to labo_rate_events.
 *   POST  { action: "publish", slugs?: string[] } → for unlocked rows with a draft: price ← draft, published_at ← now,
 *         event logged, and the shop pages are revalidated so the site reflects it immediately.
 */
const money = (v: unknown) => (v === "" || v == null ? null : Math.max(0, Math.round(Number(v) * 100) / 100));

export async function PATCH(req: NextRequest) {
  const s = await requireStaff("admin"); if (!s) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const slug = String(b.slug || "");
  const p = products.find((x) => x.slug === slug);
  const admin = createAdminClient();
  const { data: cur } = await admin.from("labo_rate_plans").select("*").eq("slug", slug).maybeSingle();
  if (!p && !cur) return NextResponse.json({ ok: false, error: "unknown product" }, { status: 400 });
  const locked = cur ? !!cur.locked : !!p?.partner;
  const row: Record<string, unknown> = { slug, line: cur?.line ?? p!.line, name: cur?.name ?? p!.name, locked, updated_at: new Date().toISOString(), updated_by: s.user.email };
  if (!cur) { row.price = locked ? p!.price : null; row.draft_price = locked ? null : p!.price; }
  const events: Array<Record<string, unknown>> = [];
  if ("cost" in b) { const c = money(b.cost); if (!Number.isNaN(c)) { if ((cur?.cost == null ? null : Number(cur.cost)) !== c) events.push({ slug, kind: "cost", old_value: cur?.cost ?? null, new_value: c, by: s.user.email }); row.cost = c; } }
  if ("draftPrice" in b) {
    if (locked) return NextResponse.json({ ok: false, error: "This line has set rates — the price can't be changed online." }, { status: 400 });
    const d = money(b.draftPrice); if (!Number.isNaN(d)) row.draft_price = d;
  }
  const { error } = await admin.from("labo_rate_plans").upsert(row, { onConflict: "slug" });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (events.length) await admin.from("labo_rate_events").insert(events);
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const s = await requireStaff("admin"); if (!s) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (b.action !== "publish") return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
  const admin = createAdminClient();
  let q = admin.from("labo_rate_plans").select("*").eq("locked", false).not("draft_price", "is", null);
  if (Array.isArray(b.slugs) && b.slugs.length) q = q.in("slug", b.slugs.map(String));
  const { data, error } = await q;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  const now = new Date().toISOString(); let n = 0;
  for (const r of data ?? []) {
    if (Number(r.draft_price) === Number(r.price)) { await admin.from("labo_rate_plans").update({ draft_price: null, updated_at: now }).eq("slug", r.slug); continue; }
    await admin.from("labo_rate_plans").update({ price: r.draft_price, draft_price: null, published_at: now, updated_at: now, updated_by: s.user.email }).eq("slug", r.slug);
    await admin.from("labo_rate_events").insert({ slug: r.slug, kind: "price", old_value: r.price, new_value: r.draft_price, by: s.user.email });
    n++;
  }
  // The shop and the home row are static — make them pick up the new prices now.
  revalidatePath("/labo", "layout");
  return NextResponse.json({ ok: true, published: n });
}
