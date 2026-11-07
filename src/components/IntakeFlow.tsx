'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// ── Step types ────────────────────────────────────────────────────────────────
export type SingleStep  = { kind: 'single'; q: string; sub?: string; options: { label: string; sub?: string }[] }
export type MultiStep   = { kind: 'multi';  q: string; sub?: string; items: string[] }
export type YesNoStep   = { kind: 'yesno';  q: string; sub?: string }
export type RevealStep  = { kind: 'reveal'; emoji: string; title: string; body: string; summaryFn: (a: Record<string, unknown>) => { label: string; value: string }[] }
export type IntakeStep  = SingleStep | MultiStep | YesNoStep | RevealStep

export type IntakeConfig = {
  backHref: string
  doneHref: string
  careType: string
  steps: IntakeStep[]
  /** Override the save endpoint (defaults to /api/intake/save + careType).
   *  Used by the Labo Method portal to save against an enrollment instead of
   *  the generic MyCleanMD intake_submissions table. When set, the
   *  fire-and-forget intake email (built for careType-shaped submissions) is
   *  skipped — the caller owns its own notification if it needs one. */
  saveUrl?: string
  /** Extra fields merged into the POST body when saveUrl is set. */
  extraBody?: Record<string, unknown>
}

// ── Tokens ────────────────────────────────────────────────────────────────────
const N = '#1E2B5E'   // navy
const B = '#E5E7EB'   // border
const M = '#9CA3AF'   // muted

export default function IntakeFlow({ config }: { config: IntakeConfig }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)

  const total   = config.steps.length
  const progress = step === 0 ? 0 : Math.round((step / (total - 1)) * 100)
  const current  = config.steps[step]
  const key      = `s${step}`

  function ans<T>(k = key): T { return answers[k] as T }
  function set(v: unknown, k = key) { setAnswers(p => ({ ...p, [k]: v })) }

  function goBack() { step === 0 ? router.push(config.backHref) : setStep(s => s - 1) }
  function goNext() { setStep(s => Math.min(s + 1, total - 1)) }

  // ── Shared styles ─────────────────────────────────────────────────────────
  const pill = (on: boolean): React.CSSProperties => ({
    width: '100%', padding: '17px', fontSize: 16, fontWeight: 600, border: 'none',
    borderRadius: 100, cursor: on ? 'pointer' : 'not-allowed',
    background: on ? N : '#E5E7EB', color: on ? '#fff' : M,
    marginTop: 24,
  })

  const card = (sel: boolean): React.CSSProperties => ({
    width: '100%', padding: '18px 22px', marginBottom: 10, textAlign: 'left',
    background: sel ? `${N}0A` : '#fff',
    border: `1.5px solid ${sel ? N : B}`, borderRadius: 14, cursor: 'pointer',
  })

  const checkbox = (sel: boolean): React.CSSProperties => ({
    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
    border: `2px solid ${sel ? N : '#D1D5DB'}`, background: sel ? N : '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  })

  function toggleMulti(item: string) {
    const prev: string[] = ans<string[]>() ?? []
    const none = item === 'None' || item === 'None of these'
    if (none) { set([item]); return }
    const filtered = prev.filter(x => x !== 'None' && x !== 'None of these')
    set(filtered.includes(item) ? filtered.filter(x => x !== item) : [...filtered, item])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div style={{ padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 20, borderBottom: `1px solid ${B}`, position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
        <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: M, padding: '4px 8px' }}>←</button>
        <div style={{ flex: 1, height: 5, background: '#E5E7EB', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: N, borderRadius: 100, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: N }}>
          <em style={{ fontStyle: 'italic', fontWeight: 400 }}>Care</em>MD
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, padding: '52px 32px 80px', maxWidth: 560, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* Single-choice (auto-advance) */}
        {current.kind === 'single' && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: N, lineHeight: 1.35, marginBottom: current.sub ? 8 : 36 }}>{current.q}</h1>
            {current.sub && <p style={{ fontSize: 15, color: M, marginBottom: 36, lineHeight: 1.5 }}>{current.sub}</p>}
            {current.options.map(opt => {
              const sel = ans<string>() === opt.label
              return (
                <button key={opt.label} onClick={() => { set(opt.label); setTimeout(goNext, 220) }} style={card(sel)}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: N }}>{opt.label}</div>
                  {opt.sub && <div style={{ fontSize: 13, color: M, marginTop: 4 }}>{opt.sub}</div>}
                </button>
              )
            })}
          </div>
        )}

        {/* Multi-select */}
        {current.kind === 'multi' && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: N, lineHeight: 1.35, marginBottom: current.sub ? 8 : 28 }}>{current.q}</h1>
            {current.sub && <p style={{ fontSize: 14, color: M, marginBottom: 28 }}>{current.sub}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {current.items.map(item => {
                const sel = (ans<string[]>() ?? []).includes(item)
                return (
                  <button key={item} onClick={() => toggleMulti(item)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: sel ? `${N}0A` : '#fff', border: `1.5px solid ${sel ? N : B}`, borderRadius: 14, cursor: 'pointer', textAlign: 'left' }}>
                    <div style={checkbox(sel)}>
                      {sel && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 14, color: N, fontWeight: sel ? 500 : 400 }}>{item}</span>
                  </button>
                )
              })}
            </div>
            <button onClick={goNext} disabled={!(ans<string[]>()?.length)} style={{ ...pill(!!(ans<string[]>()?.length)), position: 'sticky', bottom: 24 }}>Next</button>
          </div>
        )}

        {/* Yes / No (auto-advance) */}
        {current.kind === 'yesno' && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: N, lineHeight: 1.35, marginBottom: 44 }}>{current.q}</h1>
            {current.sub && <p style={{ fontSize: 15, color: M, marginBottom: 36 }}>{current.sub}</p>}
            {['Yes', 'No'].map(opt => (
              <button key={opt} onClick={() => { set(opt); setTimeout(goNext, 220) }}
                style={{ ...card(ans<string>() === opt), display: 'block', textAlign: 'center', fontSize: 17, fontWeight: 500, color: N, padding: '21px' }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Plan reveal */}
        {current.kind === 'reveal' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>{current.emoji}</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: N, marginBottom: 12 }}>{current.title}</h1>
            <p style={{ fontSize: 15, color: M, lineHeight: 1.7, maxWidth: 420, margin: '0 auto 40px' }}>{current.body}</p>
            <div style={{ background: '#F9FAFB', border: `1px solid ${B}`, borderRadius: 18, padding: '24px 28px', textAlign: 'left', marginBottom: 28 }}>
              {current.summaryFn(answers).map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${B}` : 'none' }}>
                  <span style={{ fontSize: 14, color: M }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: N, textAlign: 'right', maxWidth: '55%' }}>{row.value}</span>
                </div>
              ))}
            </div>
            <button
              disabled={saving}
              onClick={async () => {
                setSaving(true)
                try {
                  const res = await fetch(config.saveUrl ?? '/api/intake/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ careType: config.careType, answers, ...config.extraBody }),
                  })
                  if (!res.ok) {
                    const { error } = await res.json()
                    console.error('Intake save failed:', error)
                  } else if (!config.saveUrl) {
                    // Fire-and-forget email (non-blocking) — only for the generic
                    // MyCleanMD intake_submissions flow this was built around.
                    const supabase = createClient()
                    const { data: { user } } = await supabase.auth.getUser()
                    if (user) {
                      const { data: profile } = await supabase
                        .from('profiles').select('full_name, email').eq('id', user.id).single()
                      fetch('/api/emails/intake', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          patientName: profile?.full_name ?? '',
                          patientEmail: profile?.email ?? user.email ?? '',
                          careType: config.careType,
                          answers,
                        }),
                      })
                    }
                  }
                } catch (err) {
                  console.error('Intake save error:', err)
                } finally {
                  router.push(config.doneHref)
                }
              }}
              style={{ width: '100%', padding: '17px', background: N, color: '#fff', border: 'none', borderRadius: 100, fontSize: 16, fontWeight: 600, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Continue to my care plan →'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
