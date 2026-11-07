import Link from 'next/link'
import { admin, getProvider, fmtDate, fmtTime, initials } from '@/lib/labo/provider'
import { getProgram } from '@/labo/content'
import { displayName, intakeLabels, SETUP, STATUS_PILL, VISIT_LABEL } from '../../_data'
import type { Enrollment, Profile, Visit, Note, RequestRow } from '@/lib/labo/types'

export const dynamic = 'force-dynamic'
type Rx = { id: string; medication: string; dose: string | null; status: string; notes: string | null; written_at: string }

export default async function PatientChart({ params }: { params: Promise<{ id: string }> }) {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const { id } = await params
  const db = admin()
  const { data: e, error } = await db.from('labo_enrollments').select('id, user_id, program_slug, status, created_at').eq('id', id).maybeSingle()
  if (error) return <div className="setup">{/does not exist|schema cache/i.test(error.message) ? SETUP : error.message}</div>
  if (!e) return <div className="card"><h3>No such patient</h3><p className="muted" style={{ marginTop: 8 }}><Link href="/provider/patients">Back to patients</Link></p></div>
  const enr = e as Enrollment
  const [profileQ, intakeQ, visitsQ, notesQ, rxQ, reqQ] = await Promise.all([
    enr.user_id ? db.from('profiles').select('id, email, full_name').eq('id', enr.user_id).maybeSingle() : Promise.resolve({ data: null }),
    db.from('labo_intake_responses').select('answers, submitted_at').eq('enrollment_id', id).order('submitted_at', { ascending: false }).limit(1).maybeSingle(),
    db.from('labo_visits').select('*').eq('enrollment_id', id).order('scheduled_at', { ascending: false }),
    db.from('labo_notes').select('*').eq('enrollment_id', id).order('created_at', { ascending: false }),
    db.from('labo_prescriptions').select('id, medication, dose, status, notes, written_at').eq('enrollment_id', id).order('written_at', { ascending: false }),
    db.from('labo_requests').select('*').eq('enrollment_id', id).order('created_at', { ascending: false }),
  ])
  const profile = (profileQ.data ?? null) as Profile | null
  const name = displayName(profile), program = getProgram(enr.program_slug)?.name ?? enr.program_slug
  const intake = intakeQ.data as { answers: Record<string, unknown>; submitted_at: string } | null
  const visits = (visitsQ.data ?? []) as Visit[], notes = (notesQ.data ?? []) as Note[], rx = (rxQ.data ?? []) as Rx[], reqs = (reqQ.data ?? []) as RequestRow[]
  const missing = [notesQ.error, reqQ.error].some((x) => x && /does not exist|schema cache/i.test(x.message))
  return (
    <>
      <div className="top"><div className="row" style={{ alignItems: 'center', gap: 14 }}><div className="av lg">{initials(name, profile?.email)}</div><div><h1>{name}</h1><p>{program} · <span className={`pill ${STATUS_PILL[enr.status] ?? ''}`}>{enr.status.replace('_', ' ')}</span> · since {fmtDate(enr.created_at, { month: 'short', day: 'numeric', year: 'numeric' })}{profile?.email ? ` · ${profile.email}` : ''}</p></div></div>
        <div className="row" style={{ gap: 8 }}>{enr.user_id && <Link className="btn l" href={`/provider/messages?patient=${enr.user_id}`}>Message patient</Link>}<Link className="btn l" href={`/provider/calendar?new=${enr.id}`}>Schedule visit</Link><Link className="btn" href={`/provider/visits/new?enrollment=${enr.id}`}>New note</Link></div></div>
      {missing && <div className="setup">{SETUP}</div>}
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="col" style={{ flex: 1.2 }}>
          <div className="card"><h3>Intake {intake && <span className="tiny">submitted {fmtDate(intake.submitted_at)}</span>}</h3>
            {!intake ? <div className="empty">Intake not completed yet.</div> : <div className="list">{intakeLabels(enr.program_slug, intake.answers).map((r, i) => <div className="li" key={i}><div className="w"><span>{r.label}</span><b style={{ fontWeight: 500 }}>{r.value}</b></div></div>)}</div>}</div>
          <div className="card"><h3>Visit notes <Link href={`/provider/visits/new?enrollment=${enr.id}`}>＋ New note</Link></h3>
            {notes.length === 0 ? <div className="empty">No notes yet.</div> : <div className="list">{notes.map((n) => <div className="li" key={n.id}><div className="w"><b><Link href={`/provider/visits/${n.id}`}>{fmtDate(n.created_at, { month: 'short', day: 'numeric', year: 'numeric' })} · {n.fields?.next_med || n.fields?.current_med || 'Visit note'}</Link></b><span>{(n.plan || '').slice(0, 120) || 'No plan written'}{(n.plan || '').length > 120 ? '…' : ''}</span></div><span className={`pill ${STATUS_PILL[n.status] ?? ''}`}>{n.status}</span></div>)}</div>}</div>
        </div>
        <div className="col" style={{ flex: 1 }}>
          <div className="card"><h3>Visits <Link href={`/provider/calendar?new=${enr.id}`}>Schedule ›</Link></h3>
            {visits.length === 0 ? <div className="empty">No visits yet.</div> : <div className="list">{visits.map((v) => <div className="li" key={v.id}><div className="t">{fmtDate(v.scheduled_at)}</div><div className="w"><b>{VISIT_LABEL[v.visit_type] ?? v.visit_type}</b><span>{fmtTime(v.scheduled_at)} · {v.duration_min} min{v.reason ? ` · ${v.reason}` : ''}</span></div><span className={`pill ${STATUS_PILL[v.status] ?? ''}`}>{v.status.replace('_', ' ')}</span></div>)}</div>}</div>
          <div className="card"><h3>Prescriptions</h3>
            {rx.length === 0 ? <div className="empty">None recorded.</div> : <div className="list">{rx.map((p) => <div className="li" key={p.id}><div className="t">{fmtDate(p.written_at)}</div><div className="w"><b>{p.medication}{p.dose ? ` · ${p.dose}` : ''}</b><span>{p.notes ?? ''}</span></div><span className={`pill ${STATUS_PILL[p.status] ?? ''}`}>{p.status}</span></div>)}</div>}</div>
          <div className="card"><h3>Requests <Link href="/provider/requests">Queue ›</Link></h3>
            {reqs.length === 0 ? <div className="empty">No refill or lab requests.</div> : <div className="list">{reqs.map((r) => <div className="li" key={r.id}><div className="t">{fmtDate(r.created_at)}</div><div className="w"><b>{r.kind === 'lab' ? 'Labs' : `Refill · ${[r.medication, r.dose].filter(Boolean).join(' ') || '—'}`}</b><span>{r.provider_note || r.patient_note || ''}</span></div><span className={`pill ${STATUS_PILL[r.status] ?? ''}`}>{r.status}</span></div>)}</div>}</div>
        </div>
      </div>
    </>
  )
}
