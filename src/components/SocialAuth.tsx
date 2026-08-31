'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Google / Apple / Facebook sign-in, shared by /auth/login and /auth/signup.
 *
 * Both pages previously carried their own inline Google button — same markup,
 * same handler, twice. Adding two more providers to two pages would have made
 * that six copies, so it lives here once.
 *
 * ONLY ENABLED PROVIDERS RENDER. `signInWithOAuth()` does not fail client-side
 * for a provider that is off — it hard-navigates to Supabase, which answers
 * with a raw JSON 400 that the patient would see in their browser. So the list
 * comes from /api/auth/providers, which probes Supabase server-side. Switch a
 * provider on in the Supabase dashboard and its button appears on the next page
 * load; no deploy, and no dead button ever ships.
 *
 * Button styling follows each vendor's brand guidance: Apple is black with the
 * Apple mark, Facebook is #1877F2, Google is white with the four-colour G.
 */

type Provider = 'google' | 'apple' | 'facebook'

const PROVIDERS: { id: Provider; label: string; bg: string; fg: string; border?: string }[] = [
  { id: 'google', label: 'Google', bg: '#fff', fg: '#1a1a1a' },
  { id: 'apple', label: 'Apple', bg: '#000', fg: '#fff', border: '1px solid #3A3A3C' },
  { id: 'facebook', label: 'Facebook', bg: '#1877F2', fg: '#fff' },
]

function Mark({ id }: { id: Provider }) {
  if (id === 'google') {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
      </svg>
    )
  }
  if (id === 'apple') {
    return (
      <svg width="17" height="20" viewBox="0 0 17 20" fill="currentColor" aria-hidden="true">
        <path d="M14.09 10.62c-.02-2.28 1.86-3.38 1.95-3.43-1.06-1.56-2.72-1.77-3.31-1.79-1.4-.14-2.74.83-3.46.83-.71 0-1.81-.81-2.98-.79-1.53.02-2.94.89-3.73 2.26-1.59 2.76-.41 6.85 1.14 9.09.76 1.1 1.66 2.33 2.85 2.28 1.14-.05 1.57-.74 2.95-.74 1.38 0 1.77.74 2.98.71 1.23-.02 2.01-1.11 2.76-2.22.87-1.27 1.23-2.51 1.25-2.57-.03-.01-2.4-.92-2.4-3.63zM11.83 3.9c.63-.76 1.05-1.82.94-2.88-.9.04-2 .6-2.65 1.36-.58.67-1.09 1.75-.95 2.78 1.01.08 2.03-.51 2.66-1.26z" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96H15.83c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  )
}

function friendlyError(message: string, label: string): string {
  const m = message.toLowerCase()
  if (m.includes('not enabled') || m.includes('unsupported provider')) {
    return `${label} sign-in isn't switched on yet. Use email, or another provider.`
  }
  return `Could not start ${label} sign-in. Please try again, or use email.`
}

export default function SocialAuth({
  mode,
  role,
}: {
  mode: 'login' | 'signup'
  /**
   * Signup only. Carried through the OAuth round-trip so a doctor who signs up
   * with Google does not silently land as a patient — without this the callback
   * has nothing to go on and defaults everyone to 'patient'.
   * Never includes 'admin': the callback refuses anything but patient|doctor.
   */
  role?: 'patient' | 'doctor'
}) {
  const [busy, setBusy] = useState<Provider | null>(null)
  const [error, setError] = useState('')
  // null = not yet known. Render nothing until the answer arrives rather than
  // flashing three buttons and removing two.
  const [enabled, setEnabled] = useState<Provider[] | null>(null)

  useEffect(() => {
    let live = true
    fetch('/api/auth/providers')
      .then(r => r.json())
      .then(d => { if (live) setEnabled((d.enabled ?? []) as Provider[]) })
      .catch(() => { if (live) setEnabled([]) })
    return () => { live = false }
  }, [])

  async function start(p: Provider, label: string) {
    setBusy(p)
    setError('')
    const supabase = createClient()
    const callback = new URL('/auth/callback', location.origin)
    if (mode === 'signup' && role) callback.searchParams.set('role', role)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: p,
      options: { redirectTo: callback.toString() },
    })

    // A successful call navigates away, so reaching here means it failed.
    if (error) {
      setError(friendlyError(error.message, label))
      setBusy(null)
    }
  }

  // Nothing enabled (or still checking): the email form below stands alone.
  if (!enabled || enabled.length === 0) return null
  const shown = PROVIDERS.filter(p => enabled.includes(p.id))

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shown.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => start(p.id, p.label)}
            disabled={busy !== null}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: '12px 20px', background: p.bg, color: p.fg,
              border: p.border ?? 'none', borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy && busy !== p.id ? 0.5 : busy === p.id ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <Mark id={p.id} />
            {busy === p.id
              ? 'Redirecting…'
              : `${mode === 'signup' ? 'Sign up' : 'Continue'} with ${p.label}`}
          </button>
        ))}
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: 14, padding: '12px 16px', background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10,
            fontSize: 13, color: '#F87171',
          }}
        >
          {error}
        </div>
      )}
    </div>
  )
}
