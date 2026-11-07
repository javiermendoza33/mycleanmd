import { NextRequest, NextResponse } from 'next/server'
import { admin, getProvider } from '@/lib/labo/provider'

export async function POST(req: NextRequest) {
  const user = await getProvider()
  if (!user) return NextResponse.json({ ok: false, error: 'Provider access only' }, { status: 401 })
  try {
    const b = await req.json()
    const patientUserId = String(b.patientUserId || ''), body = String(b.body || '').trim()
    if (!/^[0-9a-f-]{36}$/i.test(patientUserId)) return NextResponse.json({ ok: false, error: 'Bad patient id' }, { status: 400 })
    if (body.length < 1 || body.length > 4000) return NextResponse.json({ ok: false, error: 'Message must be 1–4000 characters' }, { status: 400 })
    const { error } = await admin().from('labo_messages').insert({ patient_user_id: patientUserId, sender: 'provider', body })
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) { return NextResponse.json({ ok: false, error: String(e) }, { status: 500 }) }
}
