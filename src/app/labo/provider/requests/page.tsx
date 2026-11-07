import Link from 'next/link'
import { getProgram } from '@/labo/content'
import { admin, getProvider, missingTable, fmtDate, initials } from '@/lib/labo/provider'
import type { Enrollment, Note, Profile, RequestRow, Visit } from '@/lib/labo/types'
import RequestDecision from '@/components/labo/provider/RequestDecision'

export const dynamic = 'force-dynamic'

const TABS = [['refills', 'Refills'], ['labs', 'Labs'], ['done', 'Completed']] as const
type Tab = (typeof TABS)[number][0]
const statusPill = (s: RequestRow['status']) => s === 'pending' ? 'warn' : s === 'approved' || s === 'completed' ? 'ok' : 'bad'

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ tab?: string; id?: string }> }) {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const sp = await searchParams
  const tab: Tab = (TABS.some(([k]) => k === sp.tab) ? sp.tab : 'refills') as Tab
  const db = admin()

  const { data: all, error } = await db.from('labo_requests').select('*').order('created_at', { ascending: false }).limit(500)
  if (error) return <div className="setup">{missingTable(error) ? 'Database not set up yet — run supabase-labo-provider.sql in the Supabase SQL editor.' : error.message}</div>
  const requests = (all ?? []) as RequestRow[]
  const pendingRefills = requests.filter((r) => r.kind === 'refill' && r.status === 'pending')
  const pendingLabs = requests.filter((r) => r.kind === 'lab' && r.status === 'pending')
  const rows = tab === 'refills' ? pendingRefills : tab === 'labs' ? pendingLabs : requests.filter((r) => r.status !== 'pending')

  const enrollIds = [...new Set(requests.map((r) => r.enrollment_id))]
  const userIds = [...new Set(requests.map((r) => r.patient_user_id))]
  const [{ data: enr }, { data: prof }] = await Promise.all([
    enrollIds.length ? db.from('labo_enrollments').select('id, user_id, program_slug, status, created_at').in('id', enrollIds) : Promise.resolve({ data: [] as Enrollment[] }),
    userIds.length ? db.from('profiles').select('id, email, full_name').in('id', userIds) : Promise.resolve({ data: [] as Profile[] }),
  ])
  const enrollments = new Map(((enr ?? []) as Enrollment[]).map((e) => [e.id, e]))
  const profiles = new Map(((prof ?? []) as Profile[]).map((p) => [p.id, p]))
  const nameOf = (r: RequestRow) => { const p = profiles.get(r.patient_user_id); return p?.full_name || p?.email || 'Patient' }

  const selected = (sp.id && rows.find((r) => r.id === sp.id)) || (sp.id ? requests.find((r) => r.id === sp.id) : undefined) || rows[0]
  let detail: { visits: Visit[]; notes: Note[] } | null = null
  if (selected) {
    const [{ data: visits }, { data: notes }] = await Promise.all([
      db.from('labo_visits').select('*').eq('enrollment_id', selected.enrollment_id).order('scheduled_at', { ascending: false }),
      db.from('labo_notes').select('*').eq('enrollment_id', selected.enrollment_id).eq('status', 'signed').order('created_at', { ascending: true }),
    ])
    detail = { visits: (visits ?? []) as Visit[], notes: (notes ?? []) as Note[] }
  }
  const now = Date.now()
  const lastVisit = detail?.visits.find((v) => v.status === 'completed' || (v.scheduled_at && Date.parse(v.scheduled_at) < now))
  const nextVisit = detail?.visits.filter((v) => v.status === 'scheduled' && v.scheduled_at && Date.parse(v.scheduled_at) >= now).sort((a, b) => Date.parse(a.scheduled_at!) - Date.parse(b.scheduled_at!))[0]
  const weights = (detail?.notes ?? []).map((n) => n.fields?.weight).filter(Boolean)
  const supply = (r: RequestRow) => r.result && typeof r.result === 'object' && 'supply' in r.result ? String((r.result as Record<string, unknown>).supply) : null

  return (
    <>
      <div className="top">
        <div><h1>Requests</h1><p>{pendingRefills.length} refill{pendingRefills.length === 1 ? '' : 's'} · {pendingLabs.length} lab{pendingLabs.length === 1 ? '' : 's'} waiting for you</p></div>
        <div className="tabs">{TABS.map(([k, l]) => <Link key={k} href={`/provider/requests?tab=${k}`} className={tab === k ? 'on' : ''}>{l}{k === 'refills' ? ` (${pendingRefills.length})` : k === 'labs' ? ` (${pendingLabs.length})` : ''}</Link>)}</div>
      </div>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="card" style={{ flex: 1.1, minWidth: 0 }}>
          {rows.length === 0 ? <div className="empty">{tab === 'done' ? 'Nothing completed yet.' : `No ${tab === 'refills' ? 'refill' : 'lab'} requests waiting. Patients can send them from their portal.`}</div> : (
            <table>
              <thead><tr><th>Patient</th><th>{tab === 'labs' ? 'Panel' : 'Medication'}</th><th>Requested</th><th>{tab === 'labs' ? 'Kind' : 'Pharmacy'}</th><th></th></tr></thead>
              <tbody>{rows.map((r) => {
                const e = enrollments.get(r.enrollment_id); const prog = e ? getProgram(e.program_slug)?.name : null
                return (
                  <tr key={r.id} className={selected?.id === r.id ? 'sel' : ''}>
                    <td><Link href={`/provider/requests?tab=${tab}&id=${r.id}`}><b>{nameOf(r)}</b></Link><div className="tiny">{prog ?? e?.program_slug ?? '—'}</div></td>
                    <td>{r.kind === 'refill' ? [r.medication, r.dose].filter(Boolean).join(' ') || '—' : r.result?.summary || (r.result?.rows?.length ? `${r.result.rows.length} results` : 'Lab request')}</td>
                    <td>{fmtDate(r.created_at)}</td>
                    <td>{r.kind === 'refill' ? r.pharmacy || '—' : 'Labs'}</td>
                    <td><span className={`pill ${statusPill(r.status)}`}>{r.status === 'pending' ? (r.kind === 'refill' ? 'Waiting' : 'Review') : r.status}</span></td>
                  </tr>)
              })}</tbody>
            </table>)}
        </div>
        {selected && (() => {
          const e = enrollments.get(selected.enrollment_id); const prog = e ? getProgram(e.program_slug)?.name ?? e.program_slug : '—'
          const p = profiles.get(selected.patient_user_id)
          return (
            <div className="card col" style={{ width: 470, flex: 'none', gap: 14 }}>
              <div className="row" style={{ alignItems: 'center', gap: 12 }}>
                <div className="av lg">{initials(p?.full_name, p?.email)}</div>
                <div style={{ flex: 1, minWidth: 0 }}><b style={{ fontSize: 17 }}>{nameOf(selected)}</b><div className="sm muted">{prog}{e ? ` · since ${fmtDate(e.created_at)}` : ''}</div></div>
                <Link className="btn l sm" href={`/provider/messages?patient=${selected.patient_user_id}`}>Message</Link>
                {e && <Link className="btn l sm" href={`/provider/patients/${e.id}`}>Chart</Link>}
              </div>
              {selected.kind === 'refill' ? (
                <>
                  <div className="grid2" style={{ gap: 12 }}>
                    <div><div className="lbl">Medication</div><div className="sm" style={{ marginTop: 3 }}>{[selected.medication, selected.dose].filter(Boolean).join(' · ') || '—'}</div></div>
                    <div><div className="lbl">Supply</div><div className="sm" style={{ marginTop: 3 }}>{supply(selected) || '—'}</div></div>
                    <div><div className="lbl">Pharmacy</div><div className="sm" style={{ marginTop: 3 }}>{selected.pharmacy || '—'}</div></div>
                    <div><div className="lbl">Requested</div><div className="sm" style={{ marginTop: 3 }}>{fmtDate(selected.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}</div></div>
                    <div><div className="lbl">Last visit</div><div className="sm" style={{ marginTop: 3 }}>{lastVisit ? `${fmtDate(lastVisit.scheduled_at)} · ${lastVisit.visit_type.replace('_', ' ')}` : '—'}</div></div>
                    <div><div className="lbl">Next visit</div><div className="sm" style={{ marginTop: 3 }}>{nextVisit ? `${fmtDate(nextVisit.scheduled_at)} · booked` : 'Not booked'}</div></div>
                    <div><div className="lbl">Weight trend</div><div className="sm" style={{ marginTop: 3 }}>{weights.length >= 2 ? `${weights[0]} → ${weights[weights.length - 1]} (${weights.length} notes)` : weights.length === 1 ? `${weights[0]} (1 note)` : '—'}</div></div>
                    <div><div className="lbl">Patient note</div><div className="sm" style={{ marginTop: 3 }}>{selected.patient_note || 'None'}</div></div>
                  </div>
                  {selected.provider_note && <div className="note-ai"><div className="lbl" style={{ marginBottom: 6 }}>Your note</div>{selected.provider_note}</div>}
                  <RequestDecision requestId={selected.id} kind="refill" dose={selected.dose} status={selected.status} />
                </>
              ) : (
                <>
                  {selected.result?.rows?.length ? (
                    <table>
                      <thead><tr><th>Test</th><th>Result</th><th>Range</th><th>Flag</th></tr></thead>
                      <tbody>{selected.result.rows.map((row, i) => (
                        <tr key={i}><td>{row.test}</td><td className={row.flag === 'high' ? 'hi' : row.flag === 'low' ? 'lo' : ''}>{row.value}{row.unit ? ` ${row.unit}` : ''}</td><td>{row.range || '—'}</td><td>{row.flag ? <span className={`pill ${row.flag === 'high' ? 'bad' : 'new'}`}>{row.flag === 'high' ? 'High' : 'Low'}</span> : null}</td></tr>))}</tbody>
                    </table>
                  ) : <div className="empty">No structured results yet{selected.result?.file_url ? '' : ' — waiting for the lab'}.</div>}
                  {selected.result?.file_url && <a className="btn l sm" href={selected.result.file_url} target="_blank" rel="noopener" style={{ alignSelf: 'flex-start' }}>View PDF</a>}
                  {selected.patient_note && <div><div className="lbl">Patient note</div><div className="sm" style={{ marginTop: 3 }}>{selected.patient_note}</div></div>}
                  {selected.provider_note && <div className="note-ai"><div className="lbl" style={{ marginBottom: 6 }}>Your note to the patient</div>{selected.provider_note}</div>}
                  <RequestDecision requestId={selected.id} kind="lab" dose={null} status={selected.status} />
                  <Link className="btn l" href={`/provider/calendar?new=${selected.enrollment_id}`} style={{ alignSelf: 'flex-start' }}>Book a visit</Link>
                </>
              )}
            </div>)
        })()}
      </div>
    </>
  )
}
