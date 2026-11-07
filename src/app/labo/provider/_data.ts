// Shared reads for the provider pages (underscore = not a route). All callers verified getProvider() first.
import { admin, missingTable } from '@/lib/labo/provider'
import { getProgram } from '@/labo/content'
import { INTAKE_STEPS } from '@/labo/intakeSteps'
import type { Enrollment, Profile } from '@/lib/labo/types'

export const PT = 'America/Los_Angeles'
export function todayPT() { return new Intl.DateTimeFormat('en-CA', { timeZone: PT }).format(new Date()) }
/** UTC instant for Pacific wall-clock `YYYY-MM-DD` + `HH:MM` (DST-safe, two-pass offset check). */
export function ptToUtc(date: string, time = '00:00') {
  const [y, m, d] = date.split('-').map(Number); const [hh, mm] = time.split(':').map(Number)
  let t = Date.UTC(y, m - 1, d, hh, mm)
  for (let i = 0; i < 2; i++) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: PT, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(t)).map((x) => [x.type, x.value]))
    t += Date.UTC(y, m - 1, d, hh, mm) - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute)
  }
  return new Date(t)
}
export function shiftDay(date: string, n: number) { const [y, m, d] = date.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10) }
export function ptDayRange(date: string): [string, string] { return [ptToUtc(date).toISOString(), ptToUtc(shiftDay(date, 1)).toISOString()] }
export function dateOfPT(iso: string) { return new Intl.DateTimeFormat('en-CA', { timeZone: PT }).format(new Date(iso)) }

export type EnrollmentRow = Enrollment & { profile: Profile | null; name: string; program: string }
export async function loadEnrollments(): Promise<{ rows: EnrollmentRow[]; error: string | null; setup: boolean }> {
  const db = admin()
  const { data, error } = await db.from('labo_enrollments').select('id, user_id, program_slug, status, created_at').order('created_at', { ascending: false })
  if (error) return { rows: [], error: error.message, setup: missingTable(error) }
  const ids = Array.from(new Set((data ?? []).map((e) => e.user_id).filter(Boolean))) as string[]
  const { data: profiles } = ids.length ? await db.from('profiles').select('id, email, full_name').in('id', ids) : { data: [] as Profile[] }
  const byId = new Map((profiles ?? []).map((p) => [p.id, p as Profile]))
  const rows = (data ?? []).map((e) => { const profile = e.user_id ? byId.get(e.user_id) ?? null : null; return { ...(e as Enrollment), profile, name: displayName(profile), program: getProgram(e.program_slug)?.name ?? e.program_slug } })
  return { rows, error: null, setup: false }
}
export const displayName = (p: Profile | null | undefined) => (p?.full_name || '').trim() || p?.email || 'Patient (not linked yet)'

/** Intake answers → [{label, value}] using the program's step questions (answers are keyed s<index>). */
export function intakeLabels(slug: string, answers: Record<string, unknown> | null | undefined) {
  const steps = INTAKE_STEPS[slug] ?? []
  return Object.entries(answers ?? {}).map(([k, v]) => {
    const i = /^s(\d+)$/.test(k) ? Number(k.slice(1)) : -1
    const step = steps[i]
    const label = step && 'q' in step ? step.q : k
    const value = Array.isArray(v) ? v.join(', ') : typeof v === 'object' && v !== null ? JSON.stringify(v) : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v ?? '—')
    return { label, value }
  })
}
export const VISIT_LABEL: Record<string, string> = { initial: 'Initial consultation', follow_up: 'Follow-up', lab_review: 'Lab review' }
export const STATUS_PILL: Record<string, string> = { scheduled: '', completed: 'ok', canceled: '', no_show: 'bad', pending: 'warn', approved: 'ok', denied: 'bad', active: 'ok', pending_payment: 'warn', draft: '', signed: 'ok' }
export const SETUP = 'Database not set up yet — run supabase-labo-provider.sql in the Supabase SQL editor.'
