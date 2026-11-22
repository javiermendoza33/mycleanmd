"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type RateRow = { slug: string; line: string; name: string; locked: boolean; cost: number | null; price: number | null; draftPrice: number | null; publishedAt: string | null; updatedAt: string | null };

const fmt = (n: number | null) => (n == null ? "—" : `$${n.toFixed(2)}`);
const marginOf = (price: number | null, cost: number | null) => (price != null && cost != null && price > 0 ? { usd: price - cost, pct: ((price - cost) / price) * 100 } : null);

/** Rate plans table (admin). Cost is editable on every line; the price column is read-only on locked (partner) lines
 *  and a draft on unlocked lines, published with the button. Margin updates live as you type. */
export default function RatesTable({ rows }: { rows: RateRow[] }) {
  const router = useRouter();
  const [edit, setEdit] = useState<Record<string, { cost?: string; draftPrice?: string }>>({});
  const [busy, setBusy] = useState(""); const [msg, setMsg] = useState("");
  const costOf = (r: RateRow) => (edit[r.slug]?.cost !== undefined ? (edit[r.slug].cost === "" ? null : Number(edit[r.slug].cost)) : r.cost);
  const draftOf = (r: RateRow) => (edit[r.slug]?.draftPrice !== undefined ? (edit[r.slug].draftPrice === "" ? null : Number(edit[r.slug].draftPrice)) : r.draftPrice);
  const effective = (r: RateRow) => (r.locked ? r.price : (draftOf(r) ?? r.price));
  const drafts = rows.filter((r) => !r.locked && r.draftPrice != null && r.draftPrice !== r.price).length;

  async function save(r: RateRow) {
    const e = edit[r.slug]; if (!e) return; setBusy(r.slug); setMsg("");
    const body: Record<string, unknown> = { slug: r.slug }; if (e.cost !== undefined) body.cost = e.cost; if (e.draftPrice !== undefined && !r.locked) body.draftPrice = e.draftPrice;
    const res = await fetch("/api/labo/clinic/rates", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({})); setBusy(""); setMsg(res.ok && j.ok ? `${r.name}: saved` : j.error || "Could not save");
    setEdit((x) => { const c = { ...x }; delete c[r.slug]; return c; }); router.refresh();
  }
  async function publish() {
    if (!confirm(`Publish ${drafts} price change${drafts === 1 ? "" : "s"} to the website?`)) return;
    setBusy("publish"); setMsg("");
    const res = await fetch("/api/labo/clinic/rates", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "publish" }) });
    const j = await res.json().catch(() => ({})); setBusy(""); setMsg(res.ok && j.ok ? `Published ${j.published} price${j.published === 1 ? "" : "s"} — live on the site now.` : j.error || "Could not publish");
    router.refresh();
  }

  let line = ""; const totals = { cost: 0, price: 0, n: 0 };
  for (const r of rows) { const c = costOf(r), p = effective(r); if (c != null && p != null) { totals.cost += c; totals.price += p; totals.n++; } }
  const avg = marginOf(totals.price, totals.cost);
  return (
    <>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
        <div className="sm muted">{rows.length} products · {totals.n} with cost and price · average margin {avg ? `${avg.pct.toFixed(0)}%` : "—"}</div>
        <button className="btn" disabled={busy === "publish" || drafts === 0} onClick={publish}>{busy === "publish" ? "Publishing…" : drafts ? `Publish ${drafts} price change${drafts === 1 ? "" : "s"}` : "Nothing to publish"}</button>
      </div>
      <div className="card"><table><thead><tr><th>Product</th><th>Cost ($)</th><th>Online price ($)</th><th>Margin</th><th>Markup</th><th>Published</th><th></th></tr></thead><tbody>
        {rows.map((r) => {
          const head = r.line !== line ? (line = r.line) : null; const c = costOf(r), p = effective(r); const m = marginOf(p, c); const changed = !!edit[r.slug];
          return [
            head ? <tr key={"h" + r.line}><td colSpan={7} className="lbl" style={{ paddingTop: 16 }}>{r.line}{rows.find((x) => x.line === r.line)?.locked ? <span className="pill ok" style={{ marginLeft: 8 }}>Set rates</span> : <span className="pill new" style={{ marginLeft: 8 }}>Adjustable</span>}</td></tr> : null,
            <tr key={r.slug}>
              <td><b>{r.name}</b>{!r.locked && r.draftPrice != null && r.draftPrice !== r.price && <span className="pill new" style={{ marginLeft: 8 }}>Draft {fmt(r.draftPrice)}</span>}</td>
              <td><input className="in" type="number" min={0} step={0.5} style={{ width: 96 }} value={edit[r.slug]?.cost ?? (r.cost ?? "")} placeholder="—" onChange={(e) => setEdit((x) => ({ ...x, [r.slug]: { ...x[r.slug], cost: e.target.value } }))} /></td>
              <td>{r.locked ? <span title="Brand MSRP — set rate, not changed online">{fmt(r.price)}</span> : <input className="in" type="number" min={0} step={1} style={{ width: 96 }} value={edit[r.slug]?.draftPrice ?? (r.draftPrice ?? r.price ?? "")} placeholder="—" onChange={(e) => setEdit((x) => ({ ...x, [r.slug]: { ...x[r.slug], draftPrice: e.target.value } }))} />}</td>
              <td>{m ? <span className={m.pct < 30 ? "warn" : ""}>{fmt(m.usd)} <span className="muted">({m.pct.toFixed(0)}%)</span></span> : <span className="muted">—</span>}</td>
              <td className="muted">{c != null && c > 0 && p != null ? `${(p / c).toFixed(2)}×` : "—"}</td>
              <td className="muted sm">{r.publishedAt ? new Date(r.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</td>
              <td><button className="btn sm" disabled={busy === r.slug || !changed} onClick={() => save(r)}>{busy === r.slug ? "…" : "Save"}</button></td>
            </tr>]; })}
      </tbody></table>
      <div className="tiny" style={{ marginTop: 10 }}>Cost = what the clinic pays per unit (wholesale). Set-rate lines show the brand&rsquo;s MSRP and can&rsquo;t be changed online; adjustable lines take a draft price that goes live only when you press Publish. {msg}</div></div>
    </>
  );
}
