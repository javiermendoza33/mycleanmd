import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Who counts as "the provider" (Monika). One physician, no role system:
 * LABO_PROVIDER_EMAIL = comma-separated allowlist, matched case-insensitively.
 * src/proxy.ts enforces the same rule before /provider* is even rendered.
 */
export function isProviderEmail(email: string | null | undefined) {
  if (!email) return false
  const allow = (process.env.LABO_PROVIDER_EMAIL || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  return allow.includes(email.toLowerCase())
}

/** Server components + route handlers: the signed-in provider, or null. */
export async function getProvider() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isProviderEmail(user.email)) return null
  return user
}

/** Service-role client for provider reads/writes (RLS is for patients; the provider is verified above). */
export const admin = () => createAdminClient()

/** A friendly flag for pages when a Labo table is missing (migration not run yet). */
export const missingTable = (error: { message?: string; code?: string } | null | undefined) =>
  !!error && (error.code === '42P01' || /does not exist|schema cache/i.test(error.message || ''))

export const fmtDate = (iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', ...opts }) : '—'
export const fmtTime = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' }) : '—'
export const initials = (name: string | null | undefined, email?: string | null) => {
  const n = (name || '').trim() || (email || '?')
  return n.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('') || '?'
}
