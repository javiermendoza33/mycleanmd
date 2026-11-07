'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VisitActions({ visitId, status, zoomLink }: { visitId: string; status: string; zoomLink: string | null }) {
  const router = useRouter()
  const [zoom, setZoom] = useState(zoomLink || '')
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')
  async function send(body: Record<string, unknown>, label: string) {
    setBusy(label); setMsg('')
    const r = await fetch('/api/labo/provider/visits', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'update', visitId, ...body }) })
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok || !j.ok) { setMsg(j.error || 'Could not update'); return }
    router.refresh()
  }
  return (
    <div className="col" style={{ gap: 10 }}>
      <div className="f"><label>Zoom link</label><div className="row" style={{ gap: 8 }}><input className="in" value={zoom} onChange={(e) => setZoom(e.target.value)} placeholder="https://zoom.us/j/…" /><button className="btn l sm" disabled={!!busy} onClick={() => send({ zoomLink: zoom }, 'zoom')}>Save</button></div></div>
      {status === 'scheduled' ? (
        <div className="row" style={{ gap: 8 }}>
          <button className="btn l sm" style={{ flex: 1 }} disabled={!!busy} onClick={() => send({ status: 'completed' }, 'done')}>Mark completed</button>
          <button className="btn r sm" style={{ flex: 1 }} disabled={!!busy} onClick={() => send({ status: 'no_show' }, 'ns')}>Mark no-show</button>
          <button className="btn l sm" disabled={!!busy} onClick={() => { if (confirm('Cancel this visit?')) send({ status: 'canceled' }, 'cx') }}>Cancel</button>
        </div>
      ) : <button className="btn l sm" disabled={!!busy} onClick={() => send({ status: 'scheduled' }, 're')}>Reopen as scheduled</button>}
      {msg && <div className="sm" style={{ color: 'var(--red)' }}>{msg}</div>}
    </div>
  )
}
