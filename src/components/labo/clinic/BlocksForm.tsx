"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { localPtToIso } from "./ApptActions";

type Team = { id: string; name: string }[];
function BlocksForm({ team }: { team: Team }) {
  const router = useRouter(); const [a, setA] = useState(""); const [z, setZ] = useState(""); const [reason, setReason] = useState(""); const [who, setWho] = useState(""); const [allDay, setAllDay] = useState(false); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function save() {
    let startsAt = a, endsAt = z;
    if (allDay) { if (!a) { setErr("Pick a day."); return; } startsAt = a.slice(0, 10) + "T00:00"; endsAt = (z || a).slice(0, 10) + "T23:59"; }
    if (!startsAt || !endsAt) { setErr("Start and end."); return; }
    setBusy(true); setErr(""); const r = await fetch("/api/labo/clinic/blocks", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ startsAt: localPtToIso(startsAt), endsAt: localPtToIso(endsAt), reason, staffId: who || null }) }); const j = await r.json().catch(() => ({})); setBusy(false);
    if (!r.ok || !j.ok) { setErr(j.error || "Could not save"); return; } setA(""); setZ(""); setReason(""); router.refresh();
  }
  return (
    <div className="card"><h3>Add time off</h3>
      <div className="col" style={{ gap: 10, marginTop: 12 }}>
        <label className="row" style={{ gap: 8, alignItems: "center", fontSize: 13 }}><input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} /> Whole day(s)</label>
        <div className="grid2"><div className="f"><label>{allDay ? "From day" : "From (Pacific)"}</label><input className="in" type={allDay ? "date" : "datetime-local"} value={a} onChange={(e) => setA(e.target.value)} /></div><div className="f"><label>{allDay ? "To day (optional)" : "To"}</label><input className="in" type={allDay ? "date" : "datetime-local"} value={z} onChange={(e) => setZ(e.target.value)} /></div></div>
        <div className="grid2"><div className="f"><label>Reason</label><input className="in" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Thanksgiving, conference, lunch" /></div><div className="f"><label>Applies to</label><select className="in" value={who} onChange={(e) => setWho(e.target.value)}><option value="">Whole clinic</option>{team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div></div>
        {err && <div className="sm" style={{ color: "var(--red)" }}>{err}</div>}
        <div><button className="btn" disabled={busy} onClick={save}>{busy ? "Saving…" : "Block it"}</button></div>
      </div>
    </div>
  );
}
function Delete({ id }: { id: string }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  return <button type="button" className="btn l sm" disabled={busy} onClick={async () => { if (!confirm("Remove this time off?")) return; setBusy(true); await fetch(`/api/labo/clinic/blocks?id=${id}`, { method: "DELETE" }); setBusy(false); router.refresh(); }}>Remove</button>;
}
BlocksForm.Delete = Delete;
export default BlocksForm;
