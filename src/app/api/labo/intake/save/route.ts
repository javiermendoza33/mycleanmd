import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Same shape as /api/intake/save, but for a specific Labo enrollment rather
// than the generic MyCleanMD care-type flow: verify the session, then verify
// the enrollment actually belongs to that user before writing — the
// service-role client bypasses RLS, so that check has to happen here.
export async function POST(req: NextRequest) {
  try {
    const { enrollmentId, answers } = await req.json()
    if (!enrollmentId) {
      return NextResponse.json({ ok: false, error: 'Missing enrollmentId' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const anonClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )
    const { data: { user }, error: authError } = await anonClient.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })
    }

    const adminClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )

    const { data: enrollment, error: lookupError } = await adminClient
      .from('labo_enrollments')
      .select('id, user_id')
      .eq('id', enrollmentId)
      .single()

    if (lookupError || !enrollment || enrollment.user_id !== user.id) {
      return NextResponse.json({ ok: false, error: 'Enrollment not found' }, { status: 404 })
    }

    const { error: insertError } = await adminClient
      .from('labo_intake_responses')
      .insert({ enrollment_id: enrollmentId, answers })

    if (insertError) {
      console.error('labo_intake_responses insert error:', insertError)
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('labo intake save route error:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
