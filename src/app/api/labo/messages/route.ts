import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Patient → provider message. The patient id always comes from the session, never the body.
export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}))
    const body = typeof b.body === 'string' ? b.body.trim() : ''
    if (!body || body.length > 4000) return NextResponse.json({ ok: false, error: 'Message must be 1–4000 characters' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })

    const { error } = await createAdminClient().from('labo_messages').insert({ patient_user_id: user.id, sender: 'patient', body })
    if (error) {
      console.error('labo_messages insert error:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('labo messages route error:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
