import { getStaff, missing } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";
import { fmtDate, fmtTime } from "@/lib/labo/provider";
import OrderActions from "@/components/labo/clinic/OrderActions";

type Order = { id: string; status: string; fulfillment: string; name: string | null; email: string | null; phone: string | null; ship_to: Record<string, string> | null; items: Array<{ slug: string; name: string; qty: number; unit: number; own: boolean }>; subtotal: number; shipping: number; tax: number; total: number; vendor_order_id: string | null; tracking: string | null; staff_notes: string | null; created_at: string };
const PILL: Record<string, string> = { paid: "new", placed: "warn", shipped: "ok", done: "ok", refunded: "", canceled: "bad" };
const LABEL: Record<string, string> = { paid: "Paid · to place", placed: "Placed", shipped: "Shipped", done: "Done", refunded: "Refunded", canceled: "Canceled" };

/** Shop orders (Nov 20 2026): what the website sold, what still needs placing with Selfnamed (own line) or pulling from the shelf. */
export default async function ClinicOrders({ searchParams }: { searchParams: Promise<{ all?: string }> }) {
  if (!(await getStaff())) return null; const sp = await searchParams;
  let q = createAdminClient().from("labo_orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (!sp.all) q = q.in("status", ["paid", "placed", "shipped"]);
  const { data, error } = await q; const rows = (data ?? []) as Order[];
  const addr = (a: Record<string, string> | null) => a ? [a.line1, a.line2, `${a.city ?? ""}${a.state ? ", " + a.state : ""} ${a.postal_code ?? ""}`.trim()].filter(Boolean).join("\n") : "";
  return (
    <>
      <div className="top"><div><h1>Orders</h1><p>{sp.all ? "Every order" : "Open orders"} · {rows.length} shown · <a href={sp.all ? "/clinic/orders" : "/clinic/orders?all=1"}>{sp.all ? "show open only" : "show all"}</a></p></div></div>
      {missing(error) && <div className="setup">Run supabase-labo-orders.sql in the Supabase SQL editor first.</div>}
      <div className="card"><div className="sm muted">How it works: a paid order lands here from the website. <b>Own-line items</b> (The Labo Clinic skincare) are placed with Selfnamed by hand — copy the address, place the dropship order in their dashboard, paste their order number, mark <b>Placed</b>; when their tracking arrives, paste it and mark <b>Shipped</b>. Clinic-brand items (skinbetter, Alastin, SkinMedica) come off the shelf: pack, ship or hold for pick-up, mark Shipped or Done.</div></div>
      {rows.length === 0 && !error && <div className="card"><div className="empty">No open orders.</div></div>}
      {rows.map((o) => (
        <div className="card" key={o.id}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
            <div style={{ minWidth: 220 }}><div className="lbl">{fmtDate(o.created_at, { month: "short", day: "numeric" })} · {fmtTime(o.created_at)}</div><div style={{ fontWeight: 700, marginTop: 4 }}>{o.name ?? "—"}</div><div className="sm muted">{o.email} · {o.phone ?? ""}</div>
              <div className="sm" style={{ marginTop: 8, whiteSpace: "pre-line" }}>{o.fulfillment === "pickup" ? "Pick up in Eastlake" : addr(o.ship_to)}</div></div>
            <div style={{ flex: 1, minWidth: 260 }}><div className="lbl">Items</div>
              {o.items.map((it, i) => <div key={i} className="sm" style={{ marginTop: 4 }}>{it.qty} × {it.name} <span className="muted">${it.unit.toFixed(2)}</span>{it.own && <span className="pill em" style={{ marginLeft: 8 }}>Selfnamed</span>}</div>)}
              <div className="sm" style={{ marginTop: 8 }}>Subtotal ${o.subtotal.toFixed(2)} · Shipping ${o.shipping.toFixed(2)}{o.tax ? ` · Tax $${o.tax.toFixed(2)}` : ""} · <b>Total ${o.total.toFixed(2)}</b></div></div>
            <div style={{ minWidth: 260 }}><span className={`pill ${PILL[o.status] ?? ""}`}>{LABEL[o.status] ?? o.status}</span>
              <OrderActions id={o.id} status={o.status} vendorOrderId={o.vendor_order_id} tracking={o.tracking} staffNotes={o.staff_notes} address={o.fulfillment === "pickup" ? "" : `${o.name ?? ""}\n${addr(o.ship_to)}\n${o.phone ?? ""}`} hasOwn={o.items.some((i) => i.own)} /></div>
          </div>
        </div>
      ))}
    </>
  );
}
