"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { localPtToIso } from "./ApptActions";

type Menu = { slug: string; name: string; min: number }[]; type Team = { id: string; name: string }[];
/** Book by phone or walk-in: any time (staff may go outside the public hours); an overlap asks before saving. */
export default function NewAppointment({ menu, team, day, open: openInit }: { menu: Menu; team: Team; day?: string; open?: boolean }) {
  const router = useRouter(); const [open, setOpen] = useState(!!openInit);
  const [slug, setSlug] = useState(menu[0]?.slug ?? ""); const [when, setWhen] = useState(day ? `${day}T10:00` : ""); const [min, setMin] = useState(menu[0]?.min ?? 30);
  const [f, setF] = useState({ firstName: "", lastName: "", phone: "", email: "", notes: "" }); const [prov, setProv] = useState(""); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [force, setForce] = useState(false);
  async function save() {
    if (!slug || !when || !f.firstName) { setErr("Service, time and a first name."); return; }
    setBusy(true); setErr("");
    const r = await fetch("/api/labo/clinic/bookings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slug, startsAt: localPtToIso(when), durationMin: min, ...f, providerId: prov || null, force }) });
    const j = await r.json().catch(() => ({})); setBusy(false);
    if (r.status === 409) { setErr(j.error); setForce(true); return; }
    if (!r.ok || !j.ok) { setErr(j.error || "Could not save"); return; }
    setOpen(false); setF({ firstName: "", lastName: "", phone: "", email: "", notes: "" }); setForce(false); router.refresh();
  }
  if (!open) return <button className="btn" onClick={() => setOpen(true)}>＋ New appointment</button>;
  return (
    <div className="card" style={{ border: "1px solid var(--line)", minWidth: 360 }}>
      <h3>New appointment</h3>
      <div className="col" style={{ gap: 10, marginTop: 12 }}>
        <div className="grid2"><div className="f"><label>Service</label><select className="in" value={slug} onChange={(e) => { setSlug(e.target.value); setMin(menu.find((m) => m.slug === e.target.value)?.min ?? 30); }}>{menu.map((m) => <option key={m.slug} value={m.slug}>{m.name} · {m.min} min</option>)}</select></div>
          <div className="f"><label>When (Pacific)</label><div className="row" style={{ gap: 8 }}><input className="in" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} /><input className="in" type="number" min={5} max={480} step={5} style={{ width: 90 }} value={min} onChange={(e) => setMin(Number(e.target.value) || 30)} /></div></div></div>
        <div className="grid2"><div className="f"><label>First name</label><input className="in" value={f.firstName} onChange={(e) => setF({ ...f, firstName: e.target.value })} /></div><div className="f"><label>Last name</label><input className="in" value={f.lastName} onChange={(e) => setF({ ...f, lastName: e.target.value })} /></div></div>
        <div className="grid2"><div className="f"><label>Mobile</label><input className="in" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div><div className="f"><label>Email <span className="tiny">for the confirmation</span></label><input className="in" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div></div>
        {team.length > 0 && <div className="f"><label>Provider</label><select className="in" value={prov} onChange={(e) => setProv(e.target.value)}><option value="">Unassigned</option>{team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>}
        <div className="f"><label>Notes</label><input className="in" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} placeholder="Booked by phone, wants lip filler consult" /></div>
        {err && <div className="sm" style={{ color: "var(--red)" }}>{err}</div>}
        <div className="row" style={{ gap: 8 }}><button className="btn l" onClick={() => { setOpen(false); setForce(false); }}>Close</button><button className="btn" disabled={busy} onClick={save}>{busy ? "Saving…" : force ? "Save anyway" : "Book it"}</button></div>
      </div>
    </div>
  );
}
