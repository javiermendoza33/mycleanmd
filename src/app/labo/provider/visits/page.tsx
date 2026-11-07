import Link from 'next/link'
import { admin, getProvider, fmtDate } from '@/lib/labo/provider'
import { loadEnrollments, SETUP, STATUS_PILL } from '../_data'
import type { Note } from '@/lib/labo/types'

export const dynamic = 'force-dynamic'

export default async function ProviderVisits({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const { tab = 'drafts' } = await searchParams
  const { rows: enrollments, error, setup } = await loadEnrollments()
  if (error) return <div className="setup">{setup ? SETUP : error}</div>
  const byId = new Map(enrollments.map((e) => [e.id, e]))
  const { data, error: nErr } = await admin().from('labo_notes').select('*').order('updated_at', { ascending: false })
  if (nErr) return <div className="setup">{/does not exist|schema cache/i.test(nErr.message) ? SETUP : nErr.message}</div>
  const notes = (data ?? []) as Note[]
  const drafts = notes.filter((n) => n.status === 'draft'), signed = notes.filter((n) => n.status === 'signed')
  const list = tab === 'signed' ? signed : drafts
  return (
    <>
      <div className="top"><div><h1>Visit notes</h1><p>{drafts.length} draft{drafts.length === 1 ? '' : 's'} · {signed.length} signed</p></div>
        <div className="row" style={{ gap: 10, alignItems: 'center' }}><div className="tabs"><Link href="/provider/visits?tab=drafts" className={tab !== 'signed' ? 'on' : ''}>Drafts ({drafts.length})</Link><Link href="/provider/visits?tab=signed" className={tab === 'signed' ? 'on' : ''}>Signed ({signed.length})</Link></div><Link className="btn" href="/provider/visits/new">＋ New note</Link></div></div>
      <div className="card">{list.length === 0 ? <div className="empty">{tab === 'signed' ? 'No signed notes yet.' : 'No drafts. Start one from a visit or a patient chart.'}</div> : (
        <div className="list">{list.map((n) => { const e = byId.get(n.enrollment_id); return <div className="li" key={n.id}><div className="t">{fmtDate(n.status === 'signed' ? n.signed_at : n.updated_at)}</div><div className="w"><b><Link href={`/provider/visits/${n.id}`}>{e?.name ?? 'Patient'}</Link></b><span>{e?.program ?? ''}{n.fields?.next_med ? ` · next: ${n.fields.next_med}` : ''} · {(n.plan || '').slice(0, 110) || 'No plan written yet'}{(n.plan || '').length > 110 ? '…' : ''}</span></div><span className={`pill ${STATUS_PILL[n.status] ?? ''}`}>{n.status}</span></div> })}</div>)}</div>
    </>
  )
}
