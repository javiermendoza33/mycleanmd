import { NextRequest, NextResponse } from 'next/server'
import { admin, getProvider } from '@/lib/labo/provider'

export async function POST(req: NextRequest) {
  const user = await getProvider()
  if (!user) return NextResponse.json({ ok: false, error: 'Provider only' }, { status: 401 })
  const b = await req.json().catch(() => ({}))
  if (!b.enrollmentId) return NextResponse.json({ ok: false, error: 'enrollmentId required' }, { status: 400 })
  const now = new Date().toISOString()
  const row = { enrollment_id: b.enrollmentId, visit_id: b.visitId || null, fields: b.fields && typeof b.fields === 'object' ? b.fields : {}, plan: b.plan ? String(b.plan) : null, status: b.sign ? 'signed' : 'draft', signed_at: b.sign ? now : null, updated_at: now }
  const db = admin()
  try {
    if (b.noteId) {
      const { data: cur } = await db.from('labo_notes').select('status').eq('id', b.noteId).single()
      if (cur?.status === 'signed') return NextResponse.json({ ok: false, error: 'This note is already signed' }, { status: 409 })
      const { error } = await db.from('labo_notes').update(row).eq('id', b.noteId)
      if (error) throw error
      return NextResponse.json({ ok: true, id: b.noteId })
    }
    const { data, error } = await db.from('labo_notes').insert(row).select('id').single()
    if (error) throw error
    return NextResponse.json({ ok: true, id: data.id })
  } catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 }) }
}
