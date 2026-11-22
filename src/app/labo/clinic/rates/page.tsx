import { requireStaff } from "@/lib/labo/clinic";
import { loadRates } from "@/lib/labo/rates";
import Link from "next/link";
import RatesTable from "@/components/labo/clinic/RatesTable";

export const dynamic = "force-dynamic";

/** /clinic/rates (admin): the rate plan — wholesale cost and online price per product, margin, and the Publish button
 *  for adjustable lines. Partner lines (ALASTIN, skinbetter) are set rates: cost only. */
export default async function ClinicRates({ searchParams }: { searchParams: Promise<{ line?: string }> }) {
  const sp = await searchParams; const want = (sp.line ?? "").trim();
  const s = await requireStaff("admin");
  if (!s) return <div className="card"><h3>Admin only</h3><p className="muted" style={{ marginTop: 8 }}>Ask an admin to see or change rate plans.</p></div>;
  const { rows, setup, error } = await loadRates();
  const lines = [...new Set(rows.map((r) => r.line))];
  const shown = want && lines.includes(want) ? rows.filter((r) => r.line === want) : rows;
  return (
    <>
      <div className="top"><div><h1>Rate plans</h1><p>{lines.length} lines · {rows.length} products · cost, online price and margin per item</p></div></div>
      {setup && <div className="setup">Rate plans aren&rsquo;t set up on this deployment yet ({error ?? "missing table or service key"}). Run supabase-labo-rates.sql.</div>}
      <div className="card"><div className="sm muted">
        <b>How it works.</b> <b>Set-rate lines</b> (ALASTIN Skincare®, skinbetter science®) sell at the brand&rsquo;s MSRP through their partner stores — the price here is for reference and margin maths, and the cost is what the clinic pays per unit (ALASTIN costs are from the May 2026 order form: retail sizes, ordered in multiples of 6, free ground shipping over $2,000, $10 under; skinbetter costs are from the account price list — wholesale is 50% of SRP on every retail item, and professional orders earn a 3% marketing allowance). <b>Adjustable lines</b> (the clinic&rsquo;s own brand, when it exists) take a draft price; nothing changes on the website until you press <b>Publish</b>. Every cost and price change is logged.
      </div></div>
      <div className="row" style={{ gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <Link className={`btn sm${want ? " l" : ""}`} href="/clinic/rates">All lines · {rows.length}</Link>
        {lines.map((l) => <Link key={l} className={`btn sm${want === l ? "" : " l"}`} href={`/clinic/rates?line=${encodeURIComponent(l)}`}>{l} · {rows.filter((r) => r.line === l).length}</Link>)}
      </div>
      <RatesTable rows={shown.map((r) => ({ slug: r.slug, line: r.line, name: r.name, locked: r.locked, cost: r.cost, price: r.price, draftPrice: r.draftPrice, publishedAt: r.publishedAt, updatedAt: r.updatedAt }))} />
    </>
  );
}
