import Link from 'next/link'
import { admin, getProvider } from '@/lib/labo/provider'
import { SETUP } from '../../_data'
import NotePage from '../_NotePage'
import type { Note } from '@/lib/labo/types'

export const dynamic = 'force-dynamic'

export default async function EditNote({ params }: { params: Promise<{ noteId: string }> }) {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const { noteId } = await params
  const { data, error } = await admin().from('labo_notes').select('*').eq('id', noteId).maybeSingle()
  if (error) return <div className="setup">{/does not exist|schema cache/i.test(error.message) ? SETUP : error.message}</div>
  if (!data) return <div className="card"><h3>No such note</h3><p className="muted" style={{ marginTop: 8 }}><Link href="/provider/visits">Back to visit notes</Link></p></div>
  const note = data as Note
  return <NotePage enrollmentId={note.enrollment_id} visitId={note.visit_id} note={note} />
}
