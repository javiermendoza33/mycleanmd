import { createAdminClient } from '@/lib/supabase/admin'
import TopBar from '@/components/TopBar'
import Link from 'next/link'

// Reads live patient submissions with the service-role key, so it must render
// per request. Without this Next tries to prerender it at build time, which
// fails whenever the Supabase secrets aren't present — and the data would be
// stale even when it succeeds.
export const dynamic = 'force-dynamic'


const CARE_LABELS: Record<string, string> = {
  primary: 'Primary Care', mental: 'Mental Health', dermatology: 'Dermatology',
  urgent: 'Urgent Care', womens: "Women's Health", weight: 'Weight Loss',
  male: 'Male Sexual Health', hair: 'Hair Loss', longevity: 'Longevity',
  menopause: 'Menopause', nutrition: 'Nutrition',
}
const CARE_COLOR: Record<string, string> = {
  weight: '#10B981', mental: '#8B5CF6', dermatology: '#F59E0B', nutrition: '#06B6D4',
  primary: '#3B82F6', urgent: '#EF4444', womens: '#EC4899', male: '#6366F1',
  hair: '#F97316', longevity: '#14B8A6', menopause: '#A855F7',
}

const PREVIEW_KEYS: Record<string, string[]> = {
  weight:  ['current_weight_lbs', 'goal_weight_lbs', 'bmi', 'conditions'],
  mental:  ['s0', 's1', 's2'],
  nutrition: ['s0', 's1', 's2'],
  primary:   ['s0', 's1', 's2'],
  default:   ['s0', 's1'],
}

function formatVal(v: unknown): string {
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—'
  if (v === null || v === undefined || v === '') return '—'
  return String(v)
}

export default async function DoctorIntakesPage() {
  const supabase = createAdminClient()

  const { data: subs, error } = await supabase
    .from('intake_submissions')
    .select('id, care_type, answers, submitted_at, user_id')
    .order('submitted_at', { ascending: false })
    .limit(100)

  // Fetch profiles separately (user_id → auth.users, profiles.id = auth.users.id)
  const userIds = [...new Set((subs ?? []).map(s => s.user_id))]
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id, full_name, email').in('id', userIds)
    : { data: [] }

  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]))

  return (
    <>
      <TopBar title="Patient Intakes" subtitle="Review intake forms before appointments" />
      <div className="p-8 space-y-4">

        {error && (
          <div style={{ padding: '14px 20px', background: '#2E1010', border: '1px solid #EF4444', borderRadius: 12, fontSize: 14, color: '#EF4444' }}>
            Error loading intakes: {error.message}
          </div>
        )}

        {(subs ?? []).length === 0 && !error && (
          <div style={{ padding: '48px', textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--divider)', borderRadius: 16 }}>
            <p style={{ fontSize: 15, color: 'var(--muted)' }}>No patient intakes yet.</p>
          </div>
        )}

        {(subs ?? []).map(s => {
          const profile = profileMap[s.user_id] ?? null
          const name = profile?.full_name || profile?.email || 'Unknown patient'
          const email = profile?.email ?? ''
          const color = CARE_COLOR[s.care_type] ?? '#7ECFCF'
          const label = CARE_LABELS[s.care_type] ?? s.care_type
          const date = new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          const time = new Date(s.submitted_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          const answers = s.answers as Record<string, unknown>
          const previewKeys = PREVIEW_KEYS[s.care_type] ?? PREVIEW_KEYS.default
          const preview = previewKeys
            .filter(k => answers[k] !== undefined)
            .map(k => ({ label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: formatVal(answers[k]) }))
          const displayPreview = preview.length > 0
            ? preview
            : Object.entries(answers).slice(0, 3).map(([k, v]) => ({ label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), value: formatVal(v) }))

          return (
            <div key={s.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--divider)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--divider)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color, flexShrink: 0 }}>
                  {name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg)', marginBottom: 1 }}>{name}</p>
                  {email && <p style={{ fontSize: 11, color: 'var(--muted)' }}>{email}</p>}
                </div>
                <span style={{ padding: '4px 12px', background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 100, fontSize: 11, fontWeight: 600, color }}>
                  {label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 8 }}>{date} · {time}</span>
              </div>

              <div style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {displayPreview.map(({ label: l, value: v }) => (
                  <div key={l} style={{ padding: '10px 14px', background: 'var(--bg-dark)', border: '1px solid var(--divider)', borderRadius: 10 }}>
                    <p style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 3, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{l}</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>{v}</p>
                  </div>
                ))}
              </div>

              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--divider)', display: 'flex', gap: 10 }}>
                <Link href={`/doctor/intakes/${s.id}`}
                  style={{ padding: '8px 18px', background: 'var(--teal-dim)', color: '#7ECFCF', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  View full intake →
                </Link>
                <button style={{ padding: '8px 18px', background: 'var(--divider)', color: 'var(--muted)', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  Send message
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
