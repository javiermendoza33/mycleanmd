"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Team = { id: string; name: string }[];
const isoToLocal = (iso: string) => { const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(iso)).map((x) => [x.type, x.value])); return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`; };
export function localPtToIso(v: string) {
  const [d, t] = v.split("T"); const [y, m, dd] = d.split("-").map(Number); const [hh, mm] = t.split(":").map(Number);
  let ms = Date.UTC(y, m - 1, dd, hh, mm);
  for (let i = 0; i < 2; i++) { const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(ms)).map((x) => [x.type, x.value])); ms += Date.UTC(y, m - 1, dd, hh, mm) - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute); }
  return new Date(ms).toISOString();
}

/** Status buttons (compact) or the full edit panel: status, reschedule, provider, staff notes → PATCH /api/labo/clinic/bookings. */
export default function ApptActions({ id, status, compact, startsAt, durationMin, staffNotes, providerId, team }: { id: string; status: string; compact?: boolean; startsAt?: string; durationMin?: number; staffNotes?: string | null; providerId?: string | null; team?: Team }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const [when, setWhen] = useState(startsAt ? isoToLocal(startsAt) : ""); const [min, setMin] = useState(durationMin ?? 30); const [notes, setNotes] = useState(staffNotes ?? ""); const [prov, setProv] = useState(providerId ?? "");
  const patch = async (body: Record<string, unknown>) => { setBusy(true); setErr(""); const r = await fetch("/api/labo/clinic/bookings", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, ...body }) }); const j = await r.json().catch(() => ({})); setBusy(false); if (!r.ok || !j.ok) { setErr(j.error || "Could not save"); return; } router.refresh(); };
  const open = ["booked", "confirmed"].includes(status);
  const buttons = (
    <span className="row" style={{ gap: 6, flexWrap: "wrap" }}>
      {status === "booked" && <button type="button" className="btn sm" disabled={busy} onClick={() => patch({ status: "confirmed" })}>Confirm</button>}
      {open && <><button type="button" className="btn l sm" disabled={busy} onClick={() => patch({ status: "completed" })}>Done</button><button type="button" className="btn l sm" disabled={busy} onClick={() => patch({ status: "no_show" })}>No-show</button><button type="button" className="btn l sm" disabled={busy} onClick={() => { if (confirm("Cancel this appointment?")) patch({ status: "canceled" }); }}>Cancel</button></>}
      {!open && <button type="button" className="btn l sm" disabled={busy} onClick={() => patch({ status: "confirmed" })}>Reopen</button>}
    </span>
  );
  if (compact) return <>{buttons}{err && <span className="tiny" style={{ color: "var(--red)" }}>{err}</span>}</>;
  return (
    <div className="col" style={{ gap: 12 }}>
      <div><div className="lbl">Status</div><div style={{ marginTop: 6 }}>{buttons}</div></div>
      <div className="f"><label>Move to (Pacific)</label><div className="row" style={{ gap: 8 }}><input className="in" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} /><input className="in" type="number" min={5} max={480} step={5} style={{ width: 90 }} value={min} onChange={(e) => setMin(Number(e.target.value) || 30)} /><button type="button" className="btn l sm" disabled={busy || !when} onClick={() => patch({ startsAt: localPtToIso(when), durationMin: min })}>Move</button></div></div>
      {team && team.length > 0 && <div className="f"><label>Provider</label><select className="in" value={prov} onChange={(e) => { setProv(e.target.value); patch({ providerId: e.target.value || null }); }}><option value="">Unassigned</option>{team.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></div>}
      <div className="f"><label>Staff notes <span className="tiny">internal</span></label><textarea className="in" value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => { if (notes !== (staffNotes ?? "")) patch({ staffNotes: notes }); }} placeholder="Deposit taken, prefers mornings, allergic to…" /></div>
      {err && <div className="sm" style={{ color: "var(--red)" }}>{err}</div>}
    </div>
  );
}
