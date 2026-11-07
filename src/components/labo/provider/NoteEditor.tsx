'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FIELDS: [string, string][] = [['weight', 'Current weight'], ['bmi', 'BMI'], ['change', 'Change since start'], ['current_med', 'Current medication & dose'], ['next_med', 'Next medication & dose'], ['side_effects', 'Side effects'], ['refills', 'Refills']]
export default function NoteEditor({ noteId, enrollmentId, visitId, initial, plan: planInit, signed, signedAt }: { noteId?: string; enrollmentId: string; visitId?: string | null; initial: Record<string, string>; plan: string; signed: boolean; signedAt?: string | null }) {
  const router = useRouter()
  const [f, setF] = useState<Record<string, string>>(initial)
  const [plan, setPlan] = useState(planInit)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')
  async function save(sign: boolean) {
    if (sign && !plan.trim()) { setMsg('Write the assessment & plan before signing.'); return }
    if (sign && !confirm('Sign this note and send the plan to the patient? A signed note cannot be edited.')) return
    setBusy(sign ? 'sign' : 'save'); setMsg('')
    const r = await fetch('/api/labo/provider/notes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ noteId, enrollmentId, visitId, fields: f, plan, sign }) })
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok || !j.ok) { setMsg(j.error || 'Could not save'); return }
    setMsg(sign ? 'Signed and sent.' : 'Draft saved.')
    if (!noteId && j.id) router.replace(`/provider/visits/${j.id}`); else router.refresh()
  }
  const ro = signed
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }))
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
      {ro && <div><span className="pill ok">Signed {signedAt ? new Date(signedAt).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''}</span></div>}
      <div className="grid3">{FIELDS.slice(0, 3).map(([k, l]) => <div className="f" key={k}><label>{l}</label><input className="in" value={f[k] ?? ''} onChange={set(k)} readOnly={ro} /></div>)}</div>
      <div className="grid2">{FIELDS.slice(3, 5).map(([k, l]) => <div className="f" key={k}><label>{l}</label><input className="in" value={f[k] ?? ''} onChange={set(k)} readOnly={ro} /></div>)}</div>
      <div className="grid2">{FIELDS.slice(5, 7).map(([k, l]) => <div className="f" key={k}><label>{l}</label><input className="in" value={f[k] ?? ''} onChange={set(k)} readOnly={ro} /></div>)}</div>
      <div className="f" style={{ flex: 1 }}><label>Assessment & plan</label><textarea className="in" style={{ minHeight: 160, flex: 1 }} value={plan} onChange={(e) => setPlan(e.target.value)} readOnly={ro} placeholder="Tolerating well. Increase to … Follow-up in 4 weeks." /></div>
      {!ro && (
        <div className="row" style={{ alignItems: 'center', marginTop: 'auto' }}>
          <span className="tiny">{msg}</span><span style={{ flex: 1 }} />
          <button className="btn l" disabled={!!busy} onClick={() => save(false)}>{busy === 'save' ? 'Saving…' : 'Save draft'}</button>
          <button className="btn" disabled={!!busy} onClick={() => save(true)}>{busy === 'sign' ? 'Signing…' : 'Sign & send plan to patient'}</button>
        </div>
      )}
      {ro && msg && <span className="tiny">{msg}</span>}
    </div>
  )
}
