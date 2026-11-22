import { createAdminClient } from "@/lib/supabase/admin";
import { missing } from "@/lib/labo/clinic";
import { products } from "@/labo/clinic/products";

/**
 * Rate plans (Nov 22 2026, Javier: "build rate plan in ADMIN so we can build reports for sales online. Alastin and
 * Skinbetter are set rates so we won't be changing online… when we have our own brand, then rate plans we can adjust
 * the prices which will be reflected online with a publish button").
 *
 * One `labo_rate_plans` row per catalog product: wholesale `cost` (margin reports), the published online `price`,
 * and for UNLOCKED lines a `draft_price` the admin edits and then publishes. Partner lines are locked — the site keeps
 * the brand's MSRP from products.ts and the row only carries cost. `applyRates()` is the one place the site reads
 * published prices; everything degrades to products.ts if the table or the service key is missing.
 */
export type Rate = {
  slug: string; line: string; name: string; locked: boolean;
  cost: number | null; price: number | null; draftPrice: number | null;
  publishedAt: string | null; updatedAt: string | null; updatedBy: string | null;
};

type Row = { slug: string; line: string; name: string; locked: boolean; cost: number | string | null; price: number | string | null; draft_price: number | string | null; published_at: string | null; updated_at: string | null; updated_by: string | null };
const num = (v: number | string | null) => (v == null ? null : Number(v));
const toRate = (r: Row): Rate => ({ slug: r.slug, line: r.line, name: r.name, locked: !!r.locked, cost: num(r.cost), price: num(r.price), draftPrice: num(r.draft_price), publishedAt: r.published_at, updatedAt: r.updated_at, updatedBy: r.updated_by });

/** Every rate row, catalog order, plus catalog products that have no row yet (so a new line shows up to be priced). */
export async function loadRates(): Promise<{ rows: Rate[]; setup: boolean; error?: string }> {
  try {
    const { data, error } = await createAdminClient().from("labo_rate_plans").select("*");
    if (error) return { rows: [], setup: missing(error), error: error.message };
    const by = new Map((data as Row[]).map((r) => [r.slug, toRate(r)]));
    const rows: Rate[] = products.map((p) => by.get(p.slug) ?? { slug: p.slug, line: p.line, name: p.name, locked: !!p.partner, cost: null, price: p.partner ? p.price : null, draftPrice: p.partner ? null : p.price, publishedAt: null, updatedAt: null, updatedBy: null });
    for (const r of by.values()) if (!rows.some((x) => x.slug === r.slug)) rows.push(r);   // rows for products since removed from the catalog
    return { rows, setup: false };
  } catch (e) { return { rows: [], setup: true, error: e instanceof Error ? e.message : "not configured" }; }
}

export async function ratesBySlug(): Promise<Map<string, Rate>> {
  const { rows } = await loadRates(); return new Map(rows.map((r) => [r.slug, r]));
}

/** Published prices over the catalog's defaults — only unlocked lines can differ from products.ts. */
export async function applyRates<T extends { slug: string; price: number; partner?: string }>(list: T[]): Promise<T[]> {
  try {
    const { data, error } = await createAdminClient().from("labo_rate_plans").select("slug,price,locked").eq("locked", false).not("price", "is", null);
    if (error || !data?.length) return list;
    const by = new Map((data as { slug: string; price: number | string }[]).map((r) => [r.slug, Number(r.price)]));
    return list.map((p) => (!p.partner && by.has(p.slug) ? { ...p, price: by.get(p.slug)! } : p));
  } catch { return list; }
}

export const margin = (price: number | null, cost: number | null) => (price != null && cost != null && price > 0 ? { usd: price - cost, pct: ((price - cost) / price) * 100 } : null);
