import Link from "next/link";
import { requireStaff } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";
import { ratesBySlug } from "@/lib/labo/rates";

export const dynamic = "force-dynamic";

type Item = { slug: string; name: string; qty: number; unit: number };
type Order = { id: string; status: string; created_at: string; subtotal: number | string; shipping: number | string; tax: number | string; total: number | string; items: Item[] };
const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const monthKey = (iso: string) => new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", year: "numeric", month: "short" }).format(new Date(iso));

/** /clinic/reports (admin): online sales from the Stripe orders (labo_orders) priced against the rate plan —
 *  revenue, cost of goods, gross margin by month and by product. Partner-store sales (ALASTIN, skinbetter) happen on
 *  the brands' sites and never land here, so this fills in as the clinic's own line sells. */
export default async function ClinicReports({ searchParams }: { searchParams: Promise<{ months?: string }> }) {
  const s = await requireStaff("admin");
  if (!s) return <div className="card"><h3>Admin only</h3><p className="muted" style={{ marginTop: 8 }}>Ask an admin for the sales reports.</p></div>;
  const sp = await searchParams; const months = Math.min(36, Math.max(1, Number(sp.months) || 12));
  const since = new Date(); since.setMonth(since.getMonth() - months);
  const admin = createAdminClient();
  const [{ data: orders, error }, rates] = await Promise.all([
    admin.from("labo_orders").select("id,status,created_at,subtotal,shipping,tax,total,items").gte("created_at", since.toISOString()).in("status", ["paid", "placed", "shipped", "done"]).order("created_at", { ascending: false }).limit(5000),
    ratesBySlug(),
  ]);
  const rows = (orders ?? []) as Order[];
  const byMonth = new Map<string, { orders: number; units: number; revenue: number; cogs: number; shipping: number }>();
  const byProduct = new Map<string, { name: string; units: number; revenue: number; cogs: number; noCost: boolean }>();
  let unknownCost = 0;
  for (const o of rows) {
    const mk = monthKey(o.created_at); const m = byMonth.get(mk) ?? { orders: 0, units: 0, revenue: 0, cogs: 0, shipping: 0 };
    m.orders++; m.revenue += Number(o.subtotal); m.shipping += Number(o.shipping);
    for (const it of o.items ?? []) {
      const r = rates.get(it.slug); const cost = r?.cost ?? null; const line = it.qty * Number(it.unit);
      m.units += it.qty; if (cost != null) m.cogs += it.qty * cost; else unknownCost += it.qty;
      const p = byProduct.get(it.slug) ?? { name: it.name, units: 0, revenue: 0, cogs: 0, noCost: false };
      p.units += it.qty; p.revenue += line; if (cost != null) p.cogs += it.qty * cost; else p.noCost = true; byProduct.set(it.slug, p);
    }
    byMonth.set(mk, m);
  }
  const tot = [...byMonth.values()].reduce((a, m) => ({ orders: a.orders + m.orders, units: a.units + m.units, revenue: a.revenue + m.revenue, cogs: a.cogs + m.cogs, shipping: a.shipping + m.shipping }), { orders: 0, units: 0, revenue: 0, cogs: 0, shipping: 0 });
  const gm = tot.revenue > 0 ? ((tot.revenue - tot.cogs) / tot.revenue) * 100 : null;
  const products = [...byProduct.entries()].sort((a, b) => b[1].revenue - a[1].revenue);
  const rateRows = [...rates.values()]; const priced = rateRows.filter((r) => r.cost != null && r.price != null);
  const avgMargin = priced.length ? priced.reduce((a, r) => a + ((r.price! - r.cost!) / r.price!) * 100, 0) / priced.length : null;
  return (
    <>
      <div className="top"><div><h1>Reports</h1><p>Online sales · last {months} month{months === 1 ? "" : "s"} · <Link href={`/clinic/reports?months=${months === 12 ? 36 : 12}`}>{months === 12 ? "show 36 months" : "show 12 months"}</Link></p></div></div>
      {error && <div className="setup">Couldn&rsquo;t read orders: {error.message}</div>}
      <div className="kpis">
        <div className="card kpi"><div className="lbl">Orders</div><div className="v">{tot.orders}</div><div className="d">{tot.units} units</div></div>
        <div className="card kpi"><div className="lbl">Revenue</div><div className="v">{usd(tot.revenue)}</div><div className="d">products, before shipping &amp; tax</div></div>
        <div className="card kpi"><div className="lbl">Cost of goods</div><div className="v">{usd(tot.cogs)}</div><div className="d">{unknownCost ? `${unknownCost} units without a cost on file` : "from the rate plan"}</div></div>
        <div className="card kpi"><div className="lbl">Gross margin</div><div className="v">{gm == null ? "—" : `${gm.toFixed(0)}%`}</div><div className="d">{usd(tot.revenue - tot.cogs)}</div></div>
      </div>
      <div className="card"><h3>By month</h3>
        {byMonth.size === 0 ? <div className="empty">No online orders in this period. ALASTIN and skinbetter sell through their partner stores, so they don&rsquo;t land here; this report fills in as the clinic&rsquo;s own line sells online.</div> :
        <table><thead><tr><th>Month</th><th>Orders</th><th>Units</th><th>Revenue</th><th>Cost of goods</th><th>Gross margin</th><th>Shipping collected</th></tr></thead><tbody>
          {[...byMonth.entries()].map(([k, m]) => <tr key={k}><td><b>{k}</b></td><td>{m.orders}</td><td>{m.units}</td><td>{usd(m.revenue)}</td><td>{usd(m.cogs)}</td><td>{usd(m.revenue - m.cogs)} <span className="muted">({m.revenue ? (((m.revenue - m.cogs) / m.revenue) * 100).toFixed(0) : 0}%)</span></td><td className="muted">{usd(m.shipping)}</td></tr>)}
        </tbody></table>}
      </div>
      {products.length > 0 && <div className="card"><h3>By product</h3>
        <table><thead><tr><th>Product</th><th>Units</th><th>Revenue</th><th>Cost</th><th>Margin</th></tr></thead><tbody>
          {products.map(([slug, p]) => <tr key={slug}><td><b>{p.name}</b>{p.noCost && <span className="pill warn" style={{ marginLeft: 8 }}>no cost on file</span>}</td><td>{p.units}</td><td>{usd(p.revenue)}</td><td>{usd(p.cogs)}</td><td>{p.revenue ? `${(((p.revenue - p.cogs) / p.revenue) * 100).toFixed(0)}%` : "—"}</td></tr>)}
        </tbody></table></div>}
      <div className="card"><h3>Rate card <Link href="/clinic/rates">Edit rate plans ›</Link></h3>
        <div className="sm muted">{rateRows.length} products · {priced.length} with both cost and price · average margin {avgMargin == null ? "—" : `${avgMargin.toFixed(0)}%`} · {rateRows.filter((r) => r.cost == null).length} without a cost yet{rateRows.some((r) => r.line === "skinbetter science" && r.cost == null) ? " (skinbetter costs arrive with the account's price list)" : ""}.</div>
      </div>
    </>
  );
}
