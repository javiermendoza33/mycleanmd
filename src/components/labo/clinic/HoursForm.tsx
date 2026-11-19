"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Hours = Record<string, { on: boolean; from: string; to: string }>;
const DAYS: [string, string][] = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];
export default function HoursForm({ initial, canEdit }: { initial: Hours; canEdit: boolean }) {
  const router = useRouter(); const [hours, setHours] = useState<Hours>(initial); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  const setDay = (k: string, p: Partial<Hours[string]>) => setHours((h) => ({ ...h, [k]: { ...(h[k] ?? { on: false, from: "10:00", to: "18:00" }), ...p } }));
  async function save() { setBusy(true); setMsg(""); const r = await fetch("/api/labo/clinic/hours", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ hours }) }); const j = await r.json().catch(() => ({})); setBusy(false); setMsg(r.ok && j.ok ? "Saved." : j.error || "Could not save"); router.refresh(); }
  return (
    <div className="card hours"><h3>Opening hours</h3>
      <div style={{ marginTop: 10 }}>{DAYS.map(([k, label]) => { const d = hours[k] ?? { on: false, from: "10:00", to: "18:00" }; return (
        <div className="r" key={k}><b>{label}</b><input type="checkbox" disabled={!canEdit} checked={!!d.on} onChange={(e) => setDay(k, { on: e.target.checked })} />
          {d.on ? <><input className="in" type="time" disabled={!canEdit} style={{ width: 118, minHeight: 34, padding: "4px 8px" }} value={d.from} onChange={(e) => setDay(k, { from: e.target.value })} /><span className="muted">–</span><input className="in" type="time" disabled={!canEdit} style={{ width: 118, minHeight: 34, padding: "4px 8px" }} value={d.to} onChange={(e) => setDay(k, { to: e.target.value })} /></> : <span className="muted">Closed</span>}
        </div>); })}</div>
      <div className="tiny" style={{ marginTop: 8 }}>Pacific time · online booking only inside these hours, minus time off. {canEdit ? "" : "Admins can change these."}</div>
      {canEdit && <div className="row" style={{ gap: 10, marginTop: 12, alignItems: "center" }}><button className="btn" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save hours"}</button><span className="tiny">{msg}</span></div>}
    </div>
  );
}
