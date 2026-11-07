'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

/** Refill decision (Approve / Change dose / Deny) or lab sign-off, posting to /api/labo/provider/requests. */
export default function RequestDecision({ requestId, kind, dose, status }: { requestId: string; kind: 'refill' | 'lab'; dose: string | null; status: string }) {
  const router = useRouter()
  const [note, setNote] = useState('')
  const [newDose, setNewDose] = useState(dose || '')
  const [changing, setChanging] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const decided = status !== 'pending'

  async function send(action: 'approve' | 'deny' | 'complete') {
    if (action === 'deny' && !confirm('Deny this request? The patient will see your note.')) return
    setBusy(action); setErr(null)
    try {
      const r = await fetch('/api/labo/provider/requests', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ requestId, action, providerNote: note || undefined, dose: changing && newDose ? newDose : undefined }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
      router.refresh()
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)) } finally { setBusy(null) }
  }

  if (decided) return <div className="muted sm">Decided · {status}</div>
  return (
    <div className="col" style={{ gap: 12 }}>
      {changing && kind === 'refill' && (
        <div className="f"><label>New dose</label><input className="in" value={newDose} onChange={(e) => setNewDose(e.target.value)} placeholder="e.g. Semaglutide 0.5 mg weekly" /></div>
      )}
      <div className="f"><label>Note to {kind === 'lab' ? 'patient' : 'pharmacy / patient'} (optional)</label><textarea className="in" value={note} onChange={(e) => setNote(e.target.value)} placeholder={kind === 'lab' ? 'What the results mean and what happens next.' : 'Continue current dose.'} /></div>
      {err && <div className="setup">{err}</div>}
      {kind === 'refill' ? (
        <div className="row" style={{ gap: 8 }}>
          <button className="btn r" style={{ flex: 1 }} disabled={!!busy} onClick={() => send('deny')}>{busy === 'deny' ? '…' : 'Deny…'}</button>
          <button className="btn l" style={{ flex: 1 }} disabled={!!busy} onClick={() => setChanging((v) => !v)}>{changing ? 'Keep dose' : 'Change dose'}</button>
          <button className="btn" style={{ flex: 1.3 }} disabled={!!busy} onClick={() => send('approve')}>{busy === 'approve' ? 'Approving…' : changing ? 'Approve new dose' : 'Approve refill'}</button>
        </div>
      ) : (
        <div className="row" style={{ gap: 8 }}>
          <button className="btn" style={{ flex: 1 }} disabled={!!busy} onClick={() => send('complete')}>{busy === 'complete' ? 'Sending…' : 'Sign & send to patient'}</button>
        </div>
      )}
    </div>
  )
}
