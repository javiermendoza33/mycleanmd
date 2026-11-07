import { PRACTICE } from '@/labo/content'
import { admin, getProvider, missingTable, initials } from '@/lib/labo/provider'
import { DEFAULT_HOURS, DEFAULT_VISIT_TYPES, type ProviderSettings } from '@/lib/labo/types'
import ProfileForm from '@/components/labo/provider/ProfileForm'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await getProvider()
  if (!user) return <div className="card"><h3>Provider access only</h3></div>
  const { data, error } = await admin().from('labo_provider_settings').select('*').eq('id', 1).maybeSingle()
  if (error) return <div className="setup">{missingTable(error) ? 'Database not set up yet — run supabase-labo-provider.sql in the Supabase SQL editor.' : error.message}</div>
  const s = (data ?? null) as ProviderSettings | null
  const initial = {
    bio: s?.bio ?? '',
    specialties: Array.isArray(s?.specialties) ? s!.specialties : [],
    hours: s?.hours && Object.keys(s.hours).length ? s.hours : DEFAULT_HOURS,
    visit_types: Array.isArray(s?.visit_types) && s!.visit_types.length ? s!.visit_types : DEFAULT_VISIT_TYPES,
    timezone: s?.timezone || 'America/Los_Angeles',
  }
  return (
    <>
      <div className="top"><div><h1>Profile &amp; hours</h1><p>What patients see, and when you take visits</p></div></div>
      <div className="card row" style={{ alignItems: 'center', gap: 18 }}>
        <div className="av lg" style={{ width: 72, height: 72, fontSize: 22 }}>{initials(PRACTICE.provider)}</div>
        <div><b style={{ fontSize: 19 }}>{PRACTICE.provider}</b><div className="sm muted" style={{ marginTop: 2 }}>Founder · {PRACTICE.name} · {user.email}</div></div>
      </div>
      <ProfileForm initial={initial} />
    </>
  )
}
