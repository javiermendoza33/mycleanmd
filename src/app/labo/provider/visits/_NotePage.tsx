import Link from 'next/link'
import { admin, fmtDate, fmtTime } from '@/lib/labo/provider'
import { getProgram } from '@/labo/content'
import { displayName, intakeLabels, STATUS_PILL, VISIT_LABEL } from '../_data'
import NoteEditor from '@/components/labo/provider/NoteEditor'
import type { Enrollment, Profile, Note, RequestRow, Visit } from '@/lib/labo/types'

/** Shared renderer for /provider/visits/new (no note yet) and /provider/visits/[noteId]. */
export default async function NotePage({ enrollmentId, visitId, note }: { enrollmentId: string; visitId?: string | null; note?: Note | null }) {
  const db = admin()
  const { data: e } = await db.from('labo_enrollments').select('id, user_id, program_slug, status, created_at').eq('id', enrollmentId).maybeSingle()
  if (!e) return <div className="card"><h3>No such patient</h3></div>
  const enr = e as Enrollment
  const [profileQ, intakeQ, notesQ, labsQ, visitQ] = await Promise.all([
    enr.user_id ? db.from('profiles').select('id, email, full_name').eq('id', enr.user_id).maybeSingle() : Promise.resolve({ data: null }),
    db.from('labo_intake_responses').select('answers').eq('enrollment_id', enrollmentId).order('submitted_at', { ascending: false }).limit(1).maybeSingle(),
    db.from('labo_notes').select('id, created_at, signed_at, status, plan, fields').eq('enrollment_id', enrollmentId).neq('id', note?.id ?? '00000000-0000-0000-0000-000000000000').order('created_at', { ascending: false }).limit(5),
    db.from('labo_requests').select('*').eq('enrollment_id', enrollmentId).eq('kind', 'lab').in('status', ['approved', 'completed']).order('decided_at', { ascending: false }).limit(1).maybeSingle(),
    visitId ? db.from('labo_visits').select('*').eq('id', visitId).maybeSingle() : Promise.resolve({ data: null }),
  ])
  const profile = (profileQ.data ?? null) as Profile | null, name = displayName(profile), program = getProgram(enr.program_slug)?.name ?? enr.program_slug
  const intake = intakeLabels(enr.program_slug, (intakeQ.data as { answers: Record<string, unknown> } | null)?.answers)
  const pick = (re: RegExp) => intake.find((r) => re.test(r.label))?.value
  const lab = labsQ.data as RequestRow | null, visit = visitQ.data as Visit | null
  const prev = (notesQ.data ?? []) as Pick<Note, 'id' | 'created_at' | 'signed_at' | 'status' | 'plan' | 'fields'>[]
  const when = visit?.scheduled_at ? `${fmtDate(visit.scheduled_at, { weekday: 'short', month: 'short', day: 'numeric' })} · ${fmtTime(visit.scheduled_at)} · ${VISIT_LABEL[visit.visit_type] ?? visit.visit_type}` : note ? `started ${fmtDate(note.created_at)}` : 'new note'
  return (
    <>
      <div className="top"><div><h1>Visit note</h1><p><Link href={`/provider/patients/${enr.id}`}>{name}</Link> · {program} · {when}</p></div>
        <div className="tabs"><Link href="/provider/visits?tab=drafts">Drafts</Link><Link href="/provider/visits?tab=signed">Signed</Link></div></div>
      <div className="row" style={{ alignItems: 'stretch' }}>
        <NoteEditor noteId={note?.id} enrollmentId={enr.id} visitId={visitId ?? note?.visit_id ?? null} initial={note?.fields ?? {}} plan={note?.plan ?? ''} signed={note?.status === 'signed'} signedAt={note?.signed_at} />
        <div className="col" style={{ width: 330, flex: 'none' }}>
          <div className="card"><h3>Patient</h3><div className="list">
            <div className="li"><div className="w"><span>Allergies</span><b style={{ fontWeight: 500 }}>{pick(/allerg/i) ?? 'Not recorded'}</b></div></div>
            <div className="li"><div className="w"><span>Medications</span><b style={{ fontWeight: 500 }}>{pick(/medication|supplement/i) ?? 'Not recorded'}</b></div></div>
            <div className="li"><div className="w"><span>Last labs</span><b style={{ fontWeight: 500 }}>{lab ? `${fmtDate(lab.decided_at ?? lab.created_at)}${lab.result?.summary ? ` · ${lab.result.summary}` : ''}` : 'None on file'}</b></div></div>
            <div className="li"><div className="w"><span>Pharmacy</span><b style={{ fontWeight: 500 }}>{pick(/pharmac/i) ?? 'Not recorded'}</b></div></div>
          </div></div>
          <div className="card"><h3>Previous notes</h3>{prev.length === 0 ? <div className="empty">No previous notes.</div> : <div className="list">{prev.map((n) => <div className="li" key={n.id}><div className="w"><b><Link href={`/provider/visits/${n.id}`}>{fmtDate(n.signed_at ?? n.created_at)} · {n.fields?.next_med || n.fields?.current_med || 'note'}</Link></b><span>{(n.plan || '').slice(0, 80)}</span></div><span className={`pill ${STATUS_PILL[n.status] ?? ''}`}>{n.status}</span></div>)}</div>}</div>
        </div>
      </div>
    </>
  )
}
