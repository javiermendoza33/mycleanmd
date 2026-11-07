import Link from 'next/link'
import { admin, getProvider, fmtDate } from '@/lib/labo/provider'
import { loadEnrollments, SETUP, STATUS_PILL } from '../_data'

export const dynamic = 'force-dynamic'

export default async function ProviderPatients({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const { q = '' } = await searchParams
  const { rows, error, setup } = await loadEnrollments()
  if (error) return <div className="setup">{setup ? SETUP : error}</div>
  const db = admin()
  const [intakesQ, visitsQ] = await Promise.all([db.from('labo_intake_responses').select('enrollment_id'), db.from('labo_visits').select('enrollment_id, scheduled_at, status').neq('status', 'canceled')])
  const hasIntake = new Set((intakesQ.data ?? []).map((r) => r.enrollment_id))
  const now = new Date().getTime(); const last = new Map<string, string>(), next = new Map<string, string>()
  for (const v of visitsQ.data ?? []) { if (!v.scheduled_at) continue; const t = Date.parse(v.scheduled_at); if (t <= now) { if (!last.get(v.enrollment_id) || t > Date.parse(last.get(v.enrollment_id)!)) last.set(v.enrollment_id, v.scheduled_at) } else if (!next.get(v.enrollment_id) || t < Date.parse(next.get(v.enrollment_id)!)) next.set(v.enrollment_id, v.scheduled_at) }
  const needle = q.trim().toLowerCase()
  const list = needle ? rows.filter((e) => `${e.name} ${e.profile?.email ?? ''} ${e.program}`.toLowerCase().includes(needle)) : rows
  return (
    <>
      <div className="top"><div><h1>Patients</h1><p>{rows.length} enrollment{rows.length === 1 ? '' : 's'} · {rows.filter((e) => e.status === 'active').length} active</p></div>
        <form className="row" style={{ gap: 8 }}><input className="in" name="q" defaultValue={q} placeholder="Search name, email or program" style={{ minWidth: 280 }} /><button className="btn l" type="submit">Search</button></form></div>
      <div className="card">{list.length === 0 ? <div className="empty">{rows.length ? 'No matches.' : 'No patients yet. They appear here after checkout.'}</div> : (
        <table><thead><tr><th>Patient</th><th>Program</th><th>Status</th><th>Enrolled</th><th>Intake</th><th>Last visit</th><th>Next visit</th></tr></thead><tbody>
          {list.map((e) => <tr key={e.id}><td><b><Link href={`/provider/patients/${e.id}`}>{e.name}</Link></b><div className="tiny">{e.profile?.email ?? 'not linked to a login yet'}</div></td><td>{e.program}</td><td><span className={`pill ${STATUS_PILL[e.status] ?? ''}`}>{e.status.replace('_', ' ')}</span></td><td>{fmtDate(e.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}</td><td>{hasIntake.has(e.id) ? <span className="pill ok">Done</span> : <span className="pill">Not yet</span>}</td><td>{fmtDate(last.get(e.id))}</td><td>{fmtDate(next.get(e.id))}</td></tr>)}
        </tbody></table>)}</div>
    </>
  )
}
