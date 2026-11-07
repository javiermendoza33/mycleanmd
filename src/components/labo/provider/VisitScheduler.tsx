'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Opt = { id: string; label: string }
type VT = { key: string; label: string; min: number }
export default function VisitScheduler({ patients, visitTypes, preset, open: openInit }: { patients: Opt[]; visitTypes: VT[]; preset?: string; open?: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(!!openInit)
  const [enrollmentId, setE] = useState(preset || patients[0]?.id || '')
  const [when, setWhen] = useState('')
  const [type, setType] = useState(visitTypes[0]?.key || 'follow_up')
  const [zoom, setZoom] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function save() {
    if (!enrollmentId || !when) { setErr('Pick a patient and a time.'); return }
    setBusy(true); setErr('')
    // datetime-local is wall-clock Pacific; the server stores UTC via the API's ptToUtc-equivalent below.
    const r = await fetch('/api/labo/provider/visits', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'create', enrollmentId, scheduledAt: localPtToIso(when), durationMin: visitTypes.find((v) => v.key === type)?.min ?? 15, visitType: type, zoomLink: zoom, reason }) })
    const j = await r.json().catch(() => ({}))
    setBusy(false)
    if (!r.ok || !j.ok) { setErr(j.error || 'Could not save'); return }
    setOpen(false); setWhen(''); setReason(''); setZoom(''); router.refresh()
  }
  if (!open) return <button className="btn" onClick={() => setOpen(true)}>＋ New visit</button>
  return (
    <div className="card" style={{ border: '1px solid var(--line)', minWidth: 320 }}>
      <h3>New visit</h3>
      <div className="col" style={{ gap: 10, marginTop: 12 }}>
        <div className="f"><label>Patient</label><select className="in" value={enrollmentId} onChange={(e) => setE(e.target.value)}>{patients.length === 0 && <option value="">No active patients yet</option>}{patients.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select></div>
        <div className="grid2"><div className="f"><label>When (Pacific)</label><input className="in" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} /></div>
          <div className="f"><label>Type</label><select className="in" value={type} onChange={(e) => setType(e.target.value)}>{visitTypes.map((v) => <option key={v.key} value={v.key}>{v.label} · {v.min} min</option>)}</select></div></div>
        <div className="f"><label>Zoom link (optional)</label><input className="in" value={zoom} onChange={(e) => setZoom(e.target.value)} placeholder="https://zoom.us/j/…" /></div>
        <div className="f"><label>Reason (optional)</label><input className="in" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="4-week check-in" /></div>
        {err && <div className="sm" style={{ color: 'var(--red)' }}>{err}</div>}
        <div className="row" style={{ gap: 8 }}><button className="btn l" onClick={() => setOpen(false)}>Cancel</button><button className="btn" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Schedule visit'}</button></div>
      </div>
    </div>
  )
}
/** 'YYYY-MM-DDTHH:MM' as Pacific wall time → ISO UTC (DST-safe, two-pass). */
function localPtToIso(v: string) {
  const [d, t] = v.split('T'); const [y, m, dd] = d.split('-').map(Number); const [hh, mm] = t.split(':').map(Number)
  let ms = Date.UTC(y, m - 1, dd, hh, mm)
  for (let i = 0; i < 2; i++) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(ms)).map((x) => [x.type, x.value]))
    ms += Date.UTC(y, m - 1, dd, hh, mm) - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute)
  }
  return new Date(ms).toISOString()
}
