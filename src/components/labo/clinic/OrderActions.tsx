"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderActions({ id, status, vendorOrderId, tracking, staffNotes, address, hasOwn }: { id: string; status: string; vendorOrderId: string | null; tracking: string | null; staffNotes: string | null; address: string; hasOwn: boolean }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [v, setV] = useState(vendorOrderId ?? ""); const [t, setT] = useState(tracking ?? ""); const [n, setN] = useState(staffNotes ?? ""); const [copied, setCopied] = useState(false);
  const patch = async (body: Record<string, unknown>) => { setBusy(true); await fetch("/api/labo/clinic/orders", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, ...body }) }); setBusy(false); router.refresh(); };
  return (
    <div className="col" style={{ gap: 8, marginTop: 10 }}>
      {address && <button type="button" className="btn l sm" onClick={async () => { await navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copied" : "Copy ship-to address"}</button>}
      {hasOwn && <div className="f"><label>Selfnamed order #</label><div className="row" style={{ gap: 6 }}><input className="in" value={v} onChange={(e) => setV(e.target.value)} placeholder="SN-…" /><button type="button" className="btn sm" disabled={busy || !v} onClick={() => patch({ vendorOrderId: v, status: status === "paid" ? "placed" : status })}>Placed</button></div></div>}
      <div className="f"><label>Tracking</label><div className="row" style={{ gap: 6 }}><input className="in" value={t} onChange={(e) => setT(e.target.value)} placeholder="1Z… / 9400…" /><button type="button" className="btn sm" disabled={busy || !t} onClick={() => patch({ tracking: t, status: "shipped" })}>Shipped</button></div></div>
      <span className="row" style={{ gap: 6, flexWrap: "wrap" }}>
        {!hasOwn && status === "paid" && <button type="button" className="btn sm" disabled={busy} onClick={() => patch({ status: "shipped" })}>Shipped / ready</button>}
        {["placed", "shipped"].includes(status) && <button type="button" className="btn l sm" disabled={busy} onClick={() => patch({ status: "done" })}>Done</button>}
        {["paid", "placed"].includes(status) && <button type="button" className="btn l sm" disabled={busy} onClick={() => { if (confirm("Mark canceled? Refund it in Stripe separately.")) patch({ status: "canceled" }); }}>Cancel</button>}
      </span>
      <div className="f"><label>Notes</label><input className="in" value={n} onChange={(e) => setN(e.target.value)} onBlur={() => { if (n !== (staffNotes ?? "")) patch({ staffNotes: n }); }} placeholder="Called about delay…" /></div>
    </div>
  );
}
