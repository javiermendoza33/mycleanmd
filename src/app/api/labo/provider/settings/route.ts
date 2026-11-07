import { NextRequest, NextResponse } from 'next/server'
import { admin, getProvider } from '@/lib/labo/provider'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/

export async function POST(req: NextRequest) {
  const user = await getProvider()
  if (!user) return NextResponse.json({ ok: false, error: 'Provider access only' }, { status: 401 })
  try {
    const b = await req.json()
    const bio = typeof b.bio === 'string' ? b.bio.trim().slice(0, 2000) : null
    const specialties = Array.isArray(b.specialties) ? b.specialties.map((s: unknown) => String(s).trim().slice(0, 60)).filter(Boolean).slice(0, 20) : []
    const hours: Record<string, { on: boolean; from: string; to: string }> = {}
    for (const d of DAYS) {
      const h = (b.hours || {})[d] || {}
      const from = HHMM.test(String(h.from)) ? String(h.from) : '09:00', to = HHMM.test(String(h.to)) ? String(h.to) : '17:00'
      hours[d] = { on: !!h.on, from, to }
      if (hours[d].on && from >= to) return NextResponse.json({ ok: false, error: `${d}: start must be before end` }, { status: 400 })
    }
    const visit_types = (Array.isArray(b.visit_types) ? b.visit_types : []).map((t: { key?: unknown; label?: unknown; min?: unknown }) => {
      const label = String(t.label || '').trim().slice(0, 60), min = Math.round(Number(t.min))
      const key = String(t.key || label).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
      return { key, label, min }
    }).filter((t: { key: string; label: string; min: number }) => t.key && t.label && t.min >= 5 && t.min <= 120).slice(0, 12)
    const timezone = typeof b.timezone === 'string' && b.timezone ? b.timezone.slice(0, 64) : 'America/Los_Angeles'
    const { error } = await admin().from('labo_provider_settings').upsert({ id: 1, bio, specialties, hours, visit_types, timezone, updated_at: new Date().toISOString() })
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) { return NextResponse.json({ ok: false, error: String(e) }, { status: 500 }) }
}
