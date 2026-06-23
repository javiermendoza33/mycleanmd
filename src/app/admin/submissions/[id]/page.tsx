import { createClient } from '@/lib/supabase/server'
import TopBar from '@/components/TopBar'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

function formatKey(k: string) {
  return k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
function formatVal(v: unknown): string {
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—'
  if (v === null || v === undefined || v === '') return '—'
  return String(v)
}

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('intake_submissions')
    .select('id, care_type, answers, submitted_at, profiles(full_name, email)')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
  const name = (profile as { full_name?: string | null })?.full_name || (profile as { email?: string | null })?.email || 'Unknown patient'
  const email = (profile as { email?: string | null })?.email ?? ''
  const color = CARE_COLOR[data.care_type] ?? 'var(--teal)'
  const label = CARE_LABELS[data.care_type] ?? data.care_type
  const submitted = new Date(data.submitted_at).toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
  const answers = data.answers as Record<string, unknown>

  return (
    <>
      <TopBar
        title={name}
        subtitle={`${label} intake · ${submitted}`}
      />
      <div className="p-8 max-w-4xl space-y-6">

        {/* Back */}
        <Link href="/admin/submissions"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← All submissions
        </Link>

        {/* Patient + care type header */}
        <div className="rounded-2xl p-6 flex items-center gap-5"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--divider)' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
            style={{ background: `${color}18`, color }}>
            {name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-lg">{name}</p>
            {email && <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{email}</p>}
          </div>
          <span className="text-sm font-semibold px-4 py-1.5 rounded-full"
            style={{ background: `${color}18`, border: `1px solid ${color}44`, color }}>
            {label}
          </span>
        </div>

        {/* Answers grid */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--divider)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--divider)' }}>
            <p className="text-sm font-semibold text-white">Intake Answers</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Submitted {submitted}</p>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            {Object.entries(answers).map(([key, val]) => (
              <div key={key} className="rounded-xl p-4"
                style={{ background: 'var(--bg-dark)', border: '1px solid var(--divider)' }}>
                <p className="text-xs mb-2 font-medium" style={{ color: 'var(--muted)' }}>{formatKey(key)}</p>
                <p className="text-sm font-semibold text-white leading-relaxed">{formatVal(val)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--teal-dim)', color: 'var(--teal)' }}>
            Send message to patient
          </button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--divider)', color: 'var(--muted)' }}>
            Assign to doctor
          </button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--divider)', color: 'var(--muted)' }}>
            Flag for review
          </button>
        </div>

      </div>
    </>
  )
}
