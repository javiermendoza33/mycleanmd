import Link from 'next/link'
import { admin, getProvider, fmtDate, fmtTime, initials } from '@/lib/labo/provider'
import { loadEnrollments, ptDayRange, ptToUtc, shiftDay, todayPT, dateOfPT, SETUP, VISIT_LABEL, STATUS_PILL } from '../_data'
import VisitScheduler from '@/components/labo/provider/VisitScheduler'
import VisitActions from '@/components/labo/provider/VisitActions'
import { DEFAULT_VISIT_TYPES, type Visit, type ProviderSettings } from '@/lib/labo/types'

export const dynamic = 'force-dynamic'

export default async function ProviderCalendar({ searchParams }: { searchParams: Promise<{ d?: string; v?: string; new?: string }> }) {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const sp = await searchParams
  const day = /^\d{4}-\d{2}-\d{2}$/.test(sp.d || '') ? (sp.d as string) : todayPT()
  const { rows: enrollments, error, setup } = await loadEnrollments()
  if (error) return <div className="setup">{setup ? SETUP : error}</div>
  const byId = new Map(enrollments.map((e) => [e.id, e]))
  const db = admin()
  const [y, m] = day.split('-').map(Number)
  const monthStart = `${y}-${String(m).padStart(2, '0')}-01`, nextMonth = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`
  const [dStart, dEnd] = ptDayRange(day)
  const [monthQ, dayQ, settingsQ] = await Promise.all([
    db.from('labo_visits').select('id, scheduled_at, status').gte('scheduled_at', ptToUtc(monthStart).toISOString()).lt('scheduled_at', ptToUtc(nextMonth).toISOString()).neq('status', 'canceled'),
    db.from('labo_visits').select('*').gte('scheduled_at', dStart).lt('scheduled_at', dEnd).order('scheduled_at'),
    db.from('labo_provider_settings').select('visit_types').eq('id', 1).maybeSingle(),
  ])
  if (dayQ.error) return <div className="setup">{/does not exist|schema cache/i.test(dayQ.error.message) ? SETUP : dayQ.error.message}</div>
  const visits = (dayQ.data ?? []) as Visit[]
  const dotDays = new Set((monthQ.data ?? []).map((v) => v.scheduled_at && dateOfPT(v.scheduled_at)))
  const vt = ((settingsQ.data as Pick<ProviderSettings, 'visit_types'> | null)?.visit_types?.length ? (settingsQ.data as ProviderSettings).visit_types : DEFAULT_VISIT_TYPES)
  const selected = visits.find((v) => v.id === sp.v) ?? visits[0] ?? null
  const selE = selected ? byId.get(selected.enrollment_id) : null
  const patients = enrollments.filter((e) => e.status === 'active').map((e) => ({ id: e.id, label: `${e.name} · ${e.program}` }))

  // month grid (Sun-first), Pacific
  const firstDow = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(), daysIn = new Date(Date.UTC(y, m, 0)).getUTCDate(), prevDays = new Date(Date.UTC(y, m - 1, 0)).getUTCDate()
  const cells: { label: string; date: string; x: boolean }[] = []
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ label: String(prevDays - i), date: shiftDay(monthStart, -(i + 1)), x: true })
  for (let d = 1; d <= daysIn; d++) cells.push({ label: String(d), date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, x: false })
  while (cells.length % 7) cells.push({ label: String(cells.length - firstDow - daysIn + 1), date: shiftDay(nextMonth, cells.length - firstDow - daysIn), x: true })
  // this week stats (Mon–Sun of the selected day)
  const dow = new Date(day + 'T12:00:00Z').getUTCDay(); const weekStart = shiftDay(day, -((dow + 6) % 7))
  const weekRows = (monthQ.data ?? []).filter((v) => { const d = v.scheduled_at ? dateOfPT(v.scheduled_at) : ''; return d >= weekStart && d < shiftDay(weekStart, 7) })
  const monthLabel = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

  return (
    <>
      <div className="top"><div><h1>Calendar</h1><p>{fmtDate(ptToUtc(day, '12:00').toISOString(), { weekday: 'long', month: 'long', day: 'numeric' })} · {visits.filter((v) => v.status !== 'canceled').length} visit{visits.length === 1 ? '' : 's'} · Pacific time</p></div>
        <VisitScheduler patients={patients} visitTypes={vt} preset={sp.new && sp.new !== '1' ? sp.new : undefined} open={!!sp.new} /></div>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="col" style={{ width: 300, flex: 'none' }}>
          <div className="card"><h3>{monthLabel} <span className="muted" style={{ fontWeight: 400 }}><Link href={`/provider/calendar?d=${shiftDay(monthStart, -1)}`}>‹</Link> <Link href={`/provider/calendar?d=${nextMonth}`}>›</Link></span></h3>
            <div className="cal">{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div className="h" key={i}>{d}</div>)}
              {cells.map((c) => <Link key={c.date} href={`/provider/calendar?d=${c.date}`} className={`d${c.x ? ' x' : ''}${c.date === day ? ' on' : ''}${dotDays.has(c.date) ? ' dot' : ''}`}>{c.label}</Link>)}</div>
            <div className="tiny" style={{ marginTop: 8 }}><Link href={`/provider/calendar?d=${todayPT()}`}>Today</Link></div></div>
          <div className="card"><div className="lbl">This week</div><div className="row" style={{ marginTop: 10, gap: 22 }}>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{weekRows.length}</div><div className="tiny">visits</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{weekRows.filter((v) => v.status === 'completed').length}</div><div className="tiny">completed</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{weekRows.filter((v) => v.status === 'no_show').length}</div><div className="tiny">no-show</div></div></div></div>
        </div>
        <div className="card" style={{ flex: 1 }}><h3>{fmtDate(ptToUtc(day, '12:00').toISOString(), { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          <div className="col" style={{ gap: 10, marginTop: 14 }}>{visits.length === 0 && <div className="empty">No visits this day.</div>}
            {visits.map((v) => { const e = byId.get(v.enrollment_id); return (
              <Link key={v.id} href={`/provider/calendar?d=${day}&v=${v.id}`} className={`slot${selected?.id === v.id ? ' sel' : ''}`} style={v.status === 'canceled' ? { opacity: .5 } : undefined}>
                <div className="time">{fmtTime(v.scheduled_at)}<span>{v.duration_min} min</span></div><div className="av s">{initials(e?.name, e?.profile?.email)}</div>
                <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{e?.name ?? 'Patient'}</b><div className="sm muted">{e?.program ?? ''} · {VISIT_LABEL[v.visit_type] ?? v.visit_type}</div></div>
                <span className={`pill ${STATUS_PILL[v.status] ?? ''}`}>{v.status === 'scheduled' ? (v.visit_type === 'initial' ? 'New patient' : 'Returning') : v.status.replace('_', ' ')}</span></Link>) })}
          </div></div>
        <div className="card" style={{ width: 360, flex: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!selected ? <div className="empty">Select a visit to see details.</div> : (<>
            <div className="row" style={{ alignItems: 'center', gap: 12 }}><div className="av lg">{initials(selE?.name, selE?.profile?.email)}</div><div><b style={{ fontSize: 17 }}>{selE?.name ?? 'Patient'}</b><div className="sm muted">{selE?.profile?.email ?? ''}</div></div></div>
            <div className="grid2" style={{ gap: 10 }}>
              <div><div className="lbl">When</div><div className="sm" style={{ marginTop: 3 }}>{fmtDate(selected.scheduled_at, { weekday: 'short', month: 'short', day: 'numeric' })} · {fmtTime(selected.scheduled_at)} · {selected.duration_min} min</div></div>
              <div><div className="lbl">Type</div><div className="sm" style={{ marginTop: 3 }}>{VISIT_LABEL[selected.visit_type] ?? selected.visit_type} · video</div></div>
              <div><div className="lbl">Program</div><div className="sm" style={{ marginTop: 3 }}>{selE?.program ?? '—'}</div></div>
              <div><div className="lbl">Status</div><div className="sm" style={{ marginTop: 3 }}><span className={`pill ${STATUS_PILL[selected.status] ?? ''}`}>{selected.status.replace('_', ' ')}</span></div></div>
            </div>
            {selected.reason && <div><div className="lbl">Reason for visit</div><div className="sm" style={{ marginTop: 4, lineHeight: 1.45 }}>{selected.reason}</div></div>}
            {selected.zoom_link ? <a className="btn b" href={selected.zoom_link} target="_blank" rel="noopener" style={{ padding: 12 }}>Join Zoom visit</a> : <div className="tiny">No Zoom link yet — paste one below.</div>}
            <div className="row" style={{ gap: 8 }}><Link className="btn l" style={{ flex: 1 }} href={`/provider/visits/new?enrollment=${selected.enrollment_id}&visit=${selected.id}`}>Start note</Link><Link className="btn l" style={{ flex: 1 }} href={`/provider/patients/${selected.enrollment_id}`}>Open chart</Link></div>
            <VisitActions visitId={selected.id} status={selected.status} zoomLink={selected.zoom_link} />
          </>)}
        </div>
      </div>
    </>
  )
}
