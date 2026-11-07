import Link from 'next/link'
import { PRACTICE } from '@/labo/content'
import { admin, getProvider, fmtTime, initials } from '@/lib/labo/provider'
import { loadEnrollments, ptDayRange, todayPT, SETUP, VISIT_LABEL } from './_data'
import type { Visit, RequestRow, Message } from '@/lib/labo/types'

export const dynamic = 'force-dynamic'

export default async function ProviderToday() {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const first = PRACTICE.provider.split(/[\s,]+/)[0]
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', hourCycle: 'h23' }).format(new Date()))
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateLine = new Date().toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', weekday: 'long', month: 'long', day: 'numeric' })

  const { rows: enrollments, error, setup } = await loadEnrollments()
  if (error) return <div className="setup">{setup ? SETUP : error}</div>
  const byId = new Map(enrollments.map((e) => [e.id, e]))
  const byUser = new Map(enrollments.filter((e) => e.user_id).map((e) => [e.user_id as string, e]))
  const db = admin()
  const [start, end] = ptDayRange(todayPT())
  const [visitsQ, intakesQ, anyVisitsQ, requestsQ, messagesQ] = await Promise.all([
    db.from('labo_visits').select('*').gte('scheduled_at', start).lt('scheduled_at', end).neq('status', 'canceled').order('scheduled_at'),
    db.from('labo_intake_responses').select('enrollment_id'),
    db.from('labo_visits').select('enrollment_id').neq('status', 'canceled'),
    db.from('labo_requests').select('*').eq('status', 'pending').order('created_at'),
    db.from('labo_messages').select('*').eq('sender', 'patient').order('created_at', { ascending: false }).limit(3),
  ])
  const tableMissing = [requestsQ.error, messagesQ.error].some((e) => e && /does not exist|schema cache/i.test(e.message))
  const visits = (visitsQ.data ?? []) as Visit[]
  const hasIntake = new Set((intakesQ.data ?? []).map((r) => r.enrollment_id))
  const hasVisit = new Set((anyVisitsQ.data ?? []).map((r) => r.enrollment_id))
  const intakesToReview = enrollments.filter((e) => e.status === 'active' && hasIntake.has(e.id) && !hasVisit.has(e.id))
  const requests = (requestsQ.data ?? []) as RequestRow[]
  const refills = requests.filter((r) => r.kind === 'refill'), labs = requests.filter((r) => r.kind === 'lab')
  const msgs = (messagesQ.data ?? []) as Message[]
  const unread = msgs.filter((m) => !m.read_at).length
  const nextVisit = visits.find((v) => v.scheduled_at && new Date(v.scheduled_at) > new Date())

  return (
    <>
      <div className="top"><div><h1>{greet}, {first}</h1><p>{dateLine} · {visits.length} visit{visits.length === 1 ? '' : 's'} today · {intakesToReview.length} new intake{intakesToReview.length === 1 ? '' : 's'}</p></div><Link className="btn" href="/provider/calendar?new=1">＋ New visit</Link></div>
      {tableMissing && <div className="setup">{SETUP}</div>}
      <div className="kpis">
        <div className="card kpi"><div className="lbl">Visits today</div><div className="v">{visits.length}</div><div className="d">{nextVisit ? `next at ${fmtTime(nextVisit.scheduled_at)}` : visits.length ? 'all done for today' : 'nothing scheduled'}</div></div>
        <div className="card kpi"><div className="lbl">Intakes to review</div><div className="v">{intakesToReview.length}</div><div className="d">new patients, before their visit</div></div>
        <div className="card kpi"><div className="lbl">Refill requests</div><div className="v">{refills.length}</div><div className="d">{refills.length ? 'waiting for you' : 'none pending'}</div></div>
        <div className="card kpi"><div className="lbl">Labs to review</div><div className="v">{labs.length}</div><div className="d">{labs.length ? 'results waiting' : 'none pending'}</div></div>
        <div className="card kpi"><div className="lbl">Unread messages</div><div className="v">{unread}</div><div className="d">{unread ? 'from patients' : 'inbox clear'}</div></div>
      </div>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="card" style={{ flex: 1.35 }}><h3>Today’s schedule <Link href="/provider/calendar">Open calendar ›</Link></h3>
          <div className="list">{visits.length === 0 && <div className="empty">No visits today.</div>}
            {visits.map((v) => { const e = byId.get(v.enrollment_id); const isNew = e && !hasVisit.has(e.id) || v.visit_type === 'initial'; return (
              <div className="li" key={v.id}><div className="t">{fmtTime(v.scheduled_at)}</div><div className="av s">{initials(e?.name, e?.profile?.email)}</div>
                <div className="w"><b><Link href={e ? `/provider/patients/${e.id}` : '#'}>{e?.name ?? 'Patient'}</Link></b><span>{e?.program ?? ''} · {VISIT_LABEL[v.visit_type] ?? v.visit_type} · {v.duration_min} min{v.status !== 'scheduled' ? ` · ${v.status.replace('_', ' ')}` : ''}</span></div>
                <span className={`pill ${isNew ? 'new' : ''}`}>{isNew ? 'New patient' : 'Returning'}</span>
                {v.zoom_link ? <a className="btn b sm" href={v.zoom_link} target="_blank" rel="noopener">Join Zoom</a> : <Link className="btn l sm" href={`/provider/calendar?d=${todayPT()}&v=${v.id}`}>Open</Link>}
              </div>) })}
          </div></div>
        <div className="col" style={{ flex: 1 }}>
          <div className="card"><h3>Needs you <Link href="/provider/requests">All requests ›</Link></h3>
            <div className="list">{requests.length === 0 && intakesToReview.length === 0 && <div className="empty">Nothing waiting.</div>}
              {requests.slice(0, 4).map((r) => { const e = byId.get(r.enrollment_id); return <div className="li" key={r.id}><div className="w"><b><Link href={`/provider/requests?tab=${r.kind === 'lab' ? 'labs' : 'refills'}&id=${r.id}`}>{r.kind === 'lab' ? 'Labs' : 'Refill'} · {e?.name ?? 'Patient'}</Link></b><span>{r.kind === 'lab' ? 'Results to review' : [r.medication, r.dose].filter(Boolean).join(' ') || 'Refill'}</span></div><span className={`pill ${r.kind === 'lab' ? 'bad' : 'warn'}`}>{r.kind === 'lab' ? 'Review' : 'Pending'}</span></div> })}
              {intakesToReview.slice(0, 3).map((e) => <div className="li" key={e.id}><div className="w"><b><Link href={`/provider/patients/${e.id}`}>Intake · {e.name}</Link></b><span>{e.program} · needs a first visit</span></div><span className="pill new">New</span></div>)}
            </div></div>
          <div className="card"><h3>Messages <Link href="/provider/messages">Inbox ›</Link></h3>
            <div className="list">{msgs.length === 0 && <div className="empty">No patient messages yet.</div>}
              {msgs.map((m) => { const e = byUser.get(m.patient_user_id); return <div className="li" key={m.id}><div className="av s">{initials(e?.name, e?.profile?.email)}</div><div className="w"><b><Link href={`/provider/messages?patient=${m.patient_user_id}`}>{e?.name ?? 'Patient'}</Link></b><span>“{m.body.slice(0, 70)}{m.body.length > 70 ? '…' : ''}”</span></div><span className="tiny">{fmtTime(m.created_at)}</span></div> })}
            </div></div>
        </div>
      </div>
    </>
  )
}
