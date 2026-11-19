"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = { slug: string; category: string; name: string; min: number; price: number | null; priceNote: string; active: boolean };
export default function ServicesTable({ rows }: { rows: Row[] }) {
  const router = useRouter(); const [edit, setEdit] = useState<Record<string, Partial<Row>>>({}); const [busy, setBusy] = useState(""); const [msg, setMsg] = useState("");
  const val = (r: Row, k: keyof Row) => (edit[r.slug]?.[k] ?? r[k]) as never;
  async function save(r: Row) {
    const e = edit[r.slug] ?? {}; setBusy(r.slug); setMsg("");
    const res = await fetch("/api/labo/clinic/services", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug: r.slug, name: e.name ?? r.name, durationMin: e.min ?? r.min, price: (e.price === undefined ? r.price : e.price) ?? "", priceNote: e.priceNote ?? r.priceNote, active: e.active ?? r.active }) });
    const j = await res.json().catch(() => ({})); setBusy(""); setMsg(res.ok && j.ok ? `${r.name}: saved` : j.error || "Could not save"); setEdit((x) => { const c = { ...x }; delete c[r.slug]; return c; }); router.refresh();
  }
  let cat = "";
  return (
    <div className="card"><table><thead><tr><th>Service</th><th>Minutes</th><th>Price ($)</th><th>Price label</th><th>Online</th><th></th></tr></thead><tbody>
      {rows.map((r) => { const head = r.category !== cat ? (cat = r.category) : null; return [
        head ? <tr key={"h" + r.category}><td colSpan={6} className="lbl" style={{ paddingTop: 16 }}>{r.category}</td></tr> : null,
        <tr key={r.slug}>
          <td><input className="in" value={val(r, "name")} onChange={(e) => setEdit((x) => ({ ...x, [r.slug]: { ...x[r.slug], name: e.target.value } }))} /></td>
          <td><input className="in" type="number" min={5} max={480} step={5} style={{ width: 84 }} value={val(r, "min")} onChange={(e) => setEdit((x) => ({ ...x, [r.slug]: { ...x[r.slug], min: Number(e.target.value) } }))} /></td>
          <td><input className="in" type="number" min={0} step={1} style={{ width: 96 }} value={(val(r, "price") as number | null) ?? ""} placeholder="—" onChange={(e) => setEdit((x) => ({ ...x, [r.slug]: { ...x[r.slug], price: e.target.value === "" ? null : Number(e.target.value) } }))} /></td>
          <td><input className="in" value={val(r, "priceNote")} placeholder="Per unit / From / Free" onChange={(e) => setEdit((x) => ({ ...x, [r.slug]: { ...x[r.slug], priceNote: e.target.value } }))} /></td>
          <td><input type="checkbox" checked={val(r, "active") as boolean} onChange={(e) => setEdit((x) => ({ ...x, [r.slug]: { ...x[r.slug], active: e.target.checked } }))} /></td>
          <td><button className="btn sm" disabled={busy === r.slug || !edit[r.slug]} onClick={() => save(r)}>{busy === r.slug ? "…" : "Save"}</button></td>
        </tr>]; })}
    </tbody></table><div className="tiny" style={{ marginTop: 10 }}>Leave price empty to show the label alone ("Per unit"). Untick Online to hide a service from the website without deleting it. {msg}</div></div>
  );
}
