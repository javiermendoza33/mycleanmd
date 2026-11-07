import Link from 'next/link'
import { getProvider } from '@/lib/labo/provider'
import { loadEnrollments, SETUP } from '../../_data'
import NotePage from '../_NotePage'

export const dynamic = 'force-dynamic'

export default async function NewNote({ searchParams }: { searchParams: Promise<{ enrollment?: string; visit?: string }> }) {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const { enrollment, visit } = await searchParams
  if (enrollment) return <NotePage enrollmentId={enrollment} visitId={visit ?? null} />
  const { rows, error, setup } = await loadEnrollments()
  if (error) return <div className="setup">{setup ? SETUP : error}</div>
  const active = rows.filter((e) => e.status === 'active')
  return (
    <>
      <div className="top"><div><h1>New visit note</h1><p>Pick the patient this note is for</p></div></div>
      <div className="card">{active.length === 0 ? <div className="empty">No active patients yet.</div> : <div className="list">{active.map((e) => <div className="li" key={e.id}><div className="w"><b><Link href={`/provider/visits/new?enrollment=${e.id}`}>{e.name}</Link></b><span>{e.program}{e.profile?.email ? ` · ${e.profile.email}` : ''}</span></div><Link className="btn l sm" href={`/provider/visits/new?enrollment=${e.id}`}>Start note</Link></div>)}</div>}</div>
    </>
  )
}
