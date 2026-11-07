import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Patient creates a refill or lab request. Same ownership pattern as /api/labo/intake/save:
// session from the anon client, then the enrollment must belong to that user and be active.
const clean = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '') || null

export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}))
    const enrollmentId = typeof b.enrollmentId === 'string' ? b.enrollmentId : ''
    const kind = b.kind === 'refill' || b.kind === 'lab' ? b.kind : null
    if (!enrollmentId || !kind) return NextResponse.json({ ok: false, error: 'Missing enrollmentId or kind' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })

    const admin = createAdminClient()
    const { data: enrollment } = await admin.from('labo_enrollments').select('id, user_id, status').eq('id', enrollmentId).single()
    if (!enrollment || enrollment.user_id !== user.id) return NextResponse.json({ ok: false, error: 'Enrollment not found' }, { status: 404 })
    if (enrollment.status !== 'active') return NextResponse.json({ ok: false, error: 'This program is not active yet' }, { status: 400 })

    const medication = clean(b.medication, 120), patientNote = clean(b.patientNote, 2000)
    if (kind === 'refill' && !medication) return NextResponse.json({ ok: false, error: 'Please name the medication' }, { status: 400 })
    if (kind === 'lab' && !patientNote) return NextResponse.json({ ok: false, error: 'Please add a note' }, { status: 400 })

    const { error } = await admin.from('labo_requests').insert({
      enrollment_id: enrollmentId, patient_user_id: user.id, kind,
      medication: kind === 'refill' ? medication : null, dose: kind === 'refill' ? clean(b.dose, 80) : null,
      pharmacy: kind === 'refill' ? clean(b.pharmacy, 160) : null, patient_note: patientNote,
    })
    if (error) {
      console.error('labo_requests insert error:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('labo requests route error:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
