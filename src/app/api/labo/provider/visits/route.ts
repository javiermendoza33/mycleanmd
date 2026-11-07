import { NextRequest, NextResponse } from 'next/server'
import { admin, getProvider } from '@/lib/labo/provider'

const STATUSES = ['scheduled', 'completed', 'canceled', 'no_show']
export async function POST(req: NextRequest) {
  const user = await getProvider()
  if (!user) return NextResponse.json({ ok: false, error: 'Provider only' }, { status: 401 })
  const b = await req.json().catch(() => ({}))
  const db = admin()
  try {
    if (b.action === 'create') {
      if (!b.enrollmentId || !b.scheduledAt) return NextResponse.json({ ok: false, error: 'Patient and time are required' }, { status: 400 })
      const { data, error } = await db.from('labo_visits').insert({ enrollment_id: b.enrollmentId, scheduled_at: new Date(b.scheduledAt).toISOString(), duration_min: Number(b.durationMin) || 15, visit_type: String(b.visitType || 'follow_up'), zoom_link: b.zoomLink ? String(b.zoomLink).trim() : null, reason: b.reason ? String(b.reason).slice(0, 500) : null, status: 'scheduled' }).select('id').single()
      if (error) throw error
      return NextResponse.json({ ok: true, id: data.id })
    }
    if (b.action === 'update') {
      if (!b.visitId) return NextResponse.json({ ok: false, error: 'visitId required' }, { status: 400 })
      const patch: Record<string, unknown> = {}
      if (b.status) { if (!STATUSES.includes(b.status)) return NextResponse.json({ ok: false, error: 'bad status' }, { status: 400 }); patch.status = b.status }
      if (b.zoomLink !== undefined) patch.zoom_link = b.zoomLink ? String(b.zoomLink).trim() : null
      if (b.scheduledAt) patch.scheduled_at = new Date(b.scheduledAt).toISOString()
      const { error } = await db.from('labo_visits').update(patch).eq('id', b.visitId)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ ok: false, error: 'unknown action' }, { status: 400 })
  } catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 }) }
}
