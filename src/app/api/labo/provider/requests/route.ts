import { NextRequest, NextResponse } from 'next/server'
import { admin, getProvider } from '@/lib/labo/provider'

/** Provider decides a refill (approve → also writes labo_prescriptions) or signs off a lab (complete). */
export async function POST(req: NextRequest) {
  const user = await getProvider()
  if (!user) return NextResponse.json({ ok: false, error: 'Provider access only' }, { status: 401 })
  try {
    const b = await req.json()
    const requestId = String(b.requestId || ''), action = String(b.action || '')
    const providerNote = typeof b.providerNote === 'string' ? b.providerNote.trim().slice(0, 4000) : null
    const dose = typeof b.dose === 'string' && b.dose.trim() ? b.dose.trim().slice(0, 200) : null
    if (!requestId || !['approve', 'deny', 'complete'].includes(action)) return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })
    const db = admin()
    const { data: r, error } = await db.from('labo_requests').select('*').eq('id', requestId).single()
    if (error || !r) return NextResponse.json({ ok: false, error: 'Request not found' }, { status: 404 })
    if (r.status !== 'pending') return NextResponse.json({ ok: false, error: 'Already decided' }, { status: 409 })
    const status = action === 'approve' ? 'approved' : action === 'deny' ? 'denied' : 'completed'
    const { error: upErr } = await db.from('labo_requests').update({ status, decided_at: new Date().toISOString(), provider_note: providerNote, ...(dose ? { dose } : {}) }).eq('id', requestId)
    if (upErr) return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 })
    if (action === 'approve' && r.kind === 'refill') {
      const { error: rxErr } = await db.from('labo_prescriptions').insert({ enrollment_id: r.enrollment_id, medication: r.medication || 'Medication', dose: dose || r.dose, status: 'approved', notes: providerNote })
      if (rxErr) return NextResponse.json({ ok: false, error: 'Approved, but the prescription record failed: ' + rxErr.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, status })
  } catch (e) { return NextResponse.json({ ok: false, error: String(e) }, { status: 500 }) }
}
