import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/TopBar'

const CARE_LABELS: Record<string, string> = {
  primary:     'Primary Care',
  mental:      'Mental Health',
  dermatology: 'Dermatology',
  urgent:      'Urgent Care',
  womens:      "Women's Health",
  weight:      'Weight Loss',
  male:        'Male Sexual Health',
  hair:        'Hair Loss',
  longevity:   'Longevity',
  menopause:   'Menopause',
  nutrition:   'Nutrition',
}

const CARE_COLOR: Record<string, string> = {
  weight:      '#10B981',
  mental:      '#8B5CF6',
  dermatology: '#F59E0B',
  nutrition:   '#06B6D4',
  primary:     '#3B82F6',
  urgent:      '#EF4444',
  womens:      '#EC4899',
  male:        '#6366F1',
  hair:        '#F97316',
  longevity:   '#14B8A6',
  menopause:   '#A855F7',
}

type ProfileRow = { full_name: string | null; email: string | null }
type Submission = {
  id: string
  care_type: string
  answers: Record<string, unknown>
  submitted_at: string
  profiles: ProfileRow | ProfileRow[] | null
}

export default async function SubmissionsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('intake_submissions')
    .select('id, care_type, answers, submitted_at, profiles(full_name, email)')
    .order('submitted_at', { ascending: false })
    .limit(200)

  const submissions: Submission[] = (data ?? []) as unknown as Submission[]

  const careTypes = Array.from(new Set(submissions.map(s => s.care_type))).sort()

  return (
    <>
      <TopBar title="Intake Submissions" subtitle="Patient intake forms across all care types" />
      <div className="p-8 space-y-6">

        {/* Summary chips */}
        <div className="flex flex-wrap gap-3">
          <div style={{ padding: '8px 18px', background: 'var(--card-bg)', border: '1px solid var(--divider)', borderRadius: 100, fontSize: 13, color: 'var(--muted)' }}>
            <strong style={{ color: 'white' }}>{submissions.length}</strong> total
          </div>
          {careTypes.map(ct => {
            const count = submissions.filter(s => s.care_type === ct).length
            const color = CARE_COLOR[ct] ?? 'var(--teal)'
            return (
              <div key={ct} style={{ padding: '8px 18px', background: 'var(--card-bg)', border: `1px solid ${color}33`, borderRadius: 100, fontSize: 13, color }}>
                <strong>{count}</strong> {CARE_LABELS[ct] ?? ct}
              </div>
            )
          })}
        </div>

        {error && (
          <div style={{ padding: '14px 20px', background: '#2E1010', border: '1px solid #EF4444', borderRadius: 12, fontSize: 14, color: '#EF4444' }}>
            Error loading submissions: {error.message}
          </div>
        )}

        {submissions.length === 0 && !error && (
          <div style={{ padding: '48px', textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--divider)', borderRadius: 16 }}>
            <p style={{ fontSize: 15, color: 'var(--muted)' }}>No submissions yet. They&apos;ll appear here as patients complete intake forms.</p>
          </div>
        )}

        {submissions.length > 0 && (
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--divider)', borderRadius: 16, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 80px', gap: 0, padding: '12px 24px', borderBottom: '1px solid var(--divider)', background: 'rgba(255,255,255,0.02)' }}>
              {['Patient', 'Care Type', 'Submitted', ''].map(h => (
                <span key={h} style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {submissions.map((s, i) => {
              const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles
              const name = profile?.full_name || profile?.email || 'Unknown patient'
              const email = profile?.email ?? ''
              const color = CARE_COLOR[s.care_type] ?? 'var(--teal)'
              const label = CARE_LABELS[s.care_type] ?? s.care_type
              const date = new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              const time = new Date(s.submitted_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
              const isLast = i === submissions.length - 1

              return (
                <details key={s.id} style={{ borderBottom: isLast ? 'none' : '1px solid var(--divider)' }}>
                  <summary style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 80px', gap: 0, padding: '16px 24px', cursor: 'pointer', listStyle: 'none', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 2 }}>{name}</p>
                      {email && <p style={{ fontSize: 12, color: 'var(--muted)' }}>{email}</p>}
                    </div>
                    <div>
                      <span style={{ display: 'inline-block', padding: '4px 12px', background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 100, fontSize: 12, fontWeight: 600, color }}>
                        {label}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, color: 'white' }}>{date}</p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>{time}</p>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'right' }}>View ▾</span>
                  </summary>

                  {/* Expanded answers */}
                  <div style={{ padding: '0 24px 20px 24px', borderTop: '1px solid var(--divider)', background: 'rgba(255,255,255,0.015)' }}>
                    <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, margin: '16px 0 12px' }}>Answers</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                      {Object.entries(s.answers).map(([key, val]) => {
                        const displayVal = Array.isArray(val) ? val.join(', ') : String(val ?? '—')
                        const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                        return (
                          <div key={key} style={{ padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--divider)', borderRadius: 10 }}>
                            <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{label}</p>
                            <p style={{ fontSize: 13, fontWeight: 500, color: 'white', wordBreak: 'break-word' }}>{displayVal || '—'}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
