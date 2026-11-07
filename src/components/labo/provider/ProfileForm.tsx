'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProviderSettings } from '@/lib/labo/types'

const DAYS: [keyof ProviderSettings['hours'] & string, string][] = [['mon', 'Mon'], ['tue', 'Tue'], ['wed', 'Wed'], ['thu', 'Thu'], ['fri', 'Fri'], ['sat', 'Sat'], ['sun', 'Sun']]
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'type'

export default function ProfileForm({ initial }: { initial: Pick<ProviderSettings, 'bio' | 'specialties' | 'hours' | 'visit_types' | 'timezone'> }) {
  const router = useRouter()
  const [bio, setBio] = useState(initial.bio || '')
  const [spec, setSpec] = useState(initial.specialties.join(', '))
  const [hours, setHours] = useState(initial.hours)
  const [types, setTypes] = useState(initial.visit_types)
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [err, setErr] = useState('')

  const setDay = (k: string, patch: Partial<{ on: boolean; from: string; to: string }>) => setHours((h) => ({ ...h, [k]: { ...(h[k] || { on: false, from: '09:00', to: '17:00' }), ...patch } }))

  async function save() {
    setState('saving'); setErr('')
    try {
      const r = await fetch('/api/labo/provider/settings', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ bio, specialties: spec.split(',').map((s) => s.trim()).filter(Boolean), hours, visit_types: types, timezone: initial.timezone }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`)
      setState('saved'); router.refresh(); setTimeout(() => setState('idle'), 2500)
    } catch (e) { setState('error'); setErr(e instanceof Error ? e.message : String(e)) }
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
        {state === 'saved' && <span className="pill ok">Saved</span>}
        {state === 'error' && <span className="pill bad">{err || 'Could not save'}</span>}
        <button className="btn" onClick={save} disabled={state === 'saving'}>{state === 'saving' ? 'Saving…' : 'Save changes'}</button>
      </div>
      <div className="row">
        <div className="col" style={{ flex: 1.2 }}>
          <div className="card col" style={{ gap: 14 }}>
            <h3>About you <span className="tiny" style={{ fontWeight: 400 }}>shown to patients</span></h3>
            <div className="f"><label>Bio</label><textarea className="in" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A few sentences about your training and how you practice." /></div>
            <div className="f"><label>Specialties <span className="tiny">comma separated</span></label><input className="in" value={spec} onChange={(e) => setSpec(e.target.value)} placeholder="Weight management, Hormone therapy, Testosterone, Peptides" />
              {spec.trim() && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>{spec.split(',').map((s) => s.trim()).filter(Boolean).map((s) => <span key={s} className="pill em">{s}</span>)}</div>}
            </div>
          </div>
          <div className="card"><h3>Licenses &amp; credentials</h3><p className="muted sm" style={{ margin: '8px 0 0' }}>Coming next: state licenses, DEA, NPI and malpractice with expiry reminders.</p></div>
        </div>
        <div className="col" style={{ width: 420, flex: 'none' }}>
          <div className="card hours">
            <h3>Working hours</h3>
            <div style={{ marginTop: 8 }}>
              {DAYS.map(([k, label]) => { const d = hours[k] || { on: false, from: '09:00', to: '17:00' }; return (
                <div className="r" key={k}>
                  <b>{label}</b>
                  <input type="checkbox" checked={!!d.on} onChange={(e) => setDay(k, { on: e.target.checked })} aria-label={`${label} available`} />
                  {d.on ? (<><input className="in" type="time" style={{ width: 118, minHeight: 34, padding: '4px 8px' }} value={d.from} onChange={(e) => setDay(k, { from: e.target.value })} /><span className="muted">–</span><input className="in" type="time" style={{ width: 118, minHeight: 34, padding: '4px 8px' }} value={d.to} onChange={(e) => setDay(k, { to: e.target.value })} /></>) : <span className="muted">Unavailable</span>}
                </div>) })}
            </div>
            <div className="tiny" style={{ marginTop: 8 }}>Pacific time · patients book only inside these hours</div>
          </div>
          <div className="card">
            <h3>Visit types <a href="#" onClick={(e) => { e.preventDefault(); setTypes((t) => [...t, { key: `type_${t.length + 1}`, label: 'New visit type', min: 15 }]) }}>＋ Add</a></h3>
            <div className="list">
              {types.length === 0 && <div className="empty">No visit types yet.</div>}
              {types.map((t, i) => (
                <div className="li" key={i}>
                  <input className="in" style={{ flex: 1 }} value={t.label} onChange={(e) => setTypes((a) => a.map((x, j) => j === i ? { ...x, label: e.target.value, key: slug(e.target.value) } : x))} />
                  <input className="in" type="number" min={5} max={120} step={5} style={{ width: 86 }} value={t.min} onChange={(e) => setTypes((a) => a.map((x, j) => j === i ? { ...x, min: Number(e.target.value) || 15 } : x))} />
                  <span className="tiny">min</span>
                  <button className="btn l sm" onClick={() => setTypes((a) => a.filter((_, j) => j !== i))}>Remove</button>
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
