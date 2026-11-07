import Link from 'next/link'
import { getProgram } from '@/labo/content'
import { admin, getProvider, missingTable, fmtDate, fmtTime, initials } from '@/lib/labo/provider'
import type { Enrollment, Message, Profile } from '@/lib/labo/types'
import ProviderComposer from '@/components/labo/provider/ProviderComposer'

export const dynamic = 'force-dynamic'

function ago(iso: string) {
  const m = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000))
  if (m < 1) return 'now'; if (m < 60) return `${m} min`; const h = Math.round(m / 60); if (h < 24) return `${h} h`
  const d = Math.round(h / 24); return d < 7 ? `${d} d` : fmtDate(iso)
}

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ patient?: string; tab?: string }> }) {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const sp = await searchParams
  const tab = sp.tab === 'all' ? 'all' : 'unread'
  const db = admin()

  const { data: all, error } = await db.from('labo_messages').select('*').order('created_at', { ascending: false }).limit(2000)
  if (error) return <div className="setup">{missingTable(error) ? 'Database not set up yet — run supabase-labo-provider.sql in the Supabase SQL editor.' : error.message}</div>
  const messages = (all ?? []) as Message[]

  // One thread per patient: latest message first, unread = patient messages not yet read.
  const threads = new Map<string, { last: Message; unread: number }>()
  for (const m of messages) {
    const t = threads.get(m.patient_user_id) || { last: m, unread: 0 }
    if (m.sender === 'patient' && !m.read_at) t.unread++
    threads.set(m.patient_user_id, t)
  }
  const ids = [...threads.keys()]
  const selectedId = sp.patient && /^[0-9a-f-]{36}$/i.test(sp.patient) ? sp.patient : ids[0]
  if (selectedId && !ids.includes(selectedId)) ids.unshift(selectedId)
  const [{ data: prof }, { data: enr }] = await Promise.all([
    ids.length ? db.from('profiles').select('id, email, full_name').in('id', ids) : Promise.resolve({ data: [] as Profile[] }),
    ids.length ? db.from('labo_enrollments').select('id, user_id, program_slug, status, created_at').in('user_id', ids).order('created_at', { ascending: false }) : Promise.resolve({ data: [] as Enrollment[] }),
  ])
  const profiles = new Map(((prof ?? []) as Profile[]).map((p) => [p.id, p]))
  const enrollmentOf = new Map<string, Enrollment>()
  for (const e of (enr ?? []) as Enrollment[]) if (e.user_id && !enrollmentOf.has(e.user_id)) enrollmentOf.set(e.user_id, e)
  const nameOf = (id: string) => { const p = profiles.get(id); return p?.full_name || p?.email || 'Patient' }

  const list = ids.filter((id) => tab === 'all' || (threads.get(id)?.unread ?? 0) > 0 || id === selectedId)
  const unreadTotal = [...threads.values()].reduce((a, t) => a + t.unread, 0)

  // Opening a thread marks the patient's messages read.
  let thread: Message[] = []
  if (selectedId) {
    thread = messages.filter((m) => m.patient_user_id === selectedId).reverse()
    if (thread.some((m) => m.sender === 'patient' && !m.read_at)) await db.from('labo_messages').update({ read_at: new Date().toISOString() }).eq('patient_user_id', selectedId).eq('sender', 'patient').is('read_at', null)
  }
  const sel = selectedId ? enrollmentOf.get(selectedId) : undefined

  return (
    <>
      <div className="top"><div><h1>Messages</h1><p>{unreadTotal} unread · replies within 1 business day</p></div></div>
      <div className="row" style={{ gap: 0, alignItems: 'stretch', minHeight: 560 }}>
        <div className="card" style={{ width: 360, flex: 'none', borderRadius: '18px 0 0 18px', borderRight: '1px solid var(--line)' }}>
          <div className="tabs"><Link href="/provider/messages?tab=unread" className={tab === 'unread' ? 'on' : ''}>Unread ({unreadTotal})</Link><Link href="/provider/messages?tab=all" className={tab === 'all' ? 'on' : ''}>All</Link></div>
          <div className="list">
            {list.length === 0 && <div className="empty">{tab === 'unread' ? 'No unread messages.' : 'No conversations yet. Patients write to you from their portal.'}</div>}
            {list.map((id) => { const t = threads.get(id); const p = profiles.get(id); return (
              <Link key={id} href={`/provider/messages?tab=${tab}&patient=${id}`} className="li" style={id === selectedId ? { background: '#f5f8ff', margin: '0 -12px', padding: 12, borderRadius: 10 } : {}}>
                <div className="av s">{initials(p?.full_name, p?.email)}</div>
                <div className="w"><b>{nameOf(id)}</b><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t ? (t.last.sender === 'provider' ? 'You: ' : '') + t.last.body : 'No messages yet'}</span></div>
                {t && t.unread > 0 ? <span className="pill new">{t.unread}</span> : null}
                {t && <span className="tiny">{ago(t.last.created_at)}</span>}
              </Link>) })}
          </div>
        </div>
        <div className="card col" style={{ flex: 1, minWidth: 0, borderRadius: '0 18px 18px 0' }}>
          {!selectedId ? <div className="empty" style={{ margin: 'auto' }}>Select a conversation.</div> : (
            <>
              <div className="row" style={{ alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--line)', gap: 12 }}>
                <div className="av">{initials(profiles.get(selectedId)?.full_name, profiles.get(selectedId)?.email)}</div>
                <div style={{ flex: 1, minWidth: 0 }}><b>{nameOf(selectedId)}</b><div className="sm muted">{sel ? getProgram(sel.program_slug)?.name ?? sel.program_slug : 'No active program'}{profiles.get(selectedId)?.email ? ` · ${profiles.get(selectedId)!.email}` : ''}</div></div>
                {sel && <Link className="btn l sm" href={`/provider/patients/${sel.id}`}>Open chart</Link>}
              </div>
              <div className="thread" style={{ flex: 1, padding: '18px 0', justifyContent: 'flex-end' }}>
                {thread.length === 0 && <div className="empty">No messages yet — say hello.</div>}
                {thread.map((m, i) => {
                  const day = fmtDate(m.created_at, { weekday: 'long', month: 'short', day: 'numeric' })
                  const prevDay = i > 0 ? fmtDate(thread[i - 1].created_at, { weekday: 'long', month: 'short', day: 'numeric' }) : null
                  return (
                    <div key={m.id} style={{ display: 'contents' }}>
                      {day !== prevDay && <div className="tiny" style={{ alignSelf: 'center' }}>{day}</div>}
                      <div className={`bubble ${m.sender === 'patient' ? 'in' : 'out'}`} title={fmtTime(m.created_at)}>{m.body}</div>
                    </div>)
                })}
              </div>
              <ProviderComposer patientUserId={selectedId} />
            </>)}
        </div>
      </div>
    </>
  )
}
