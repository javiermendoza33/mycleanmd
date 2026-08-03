'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BRAND, C } from '@/lib/brand'

/**
 * Site-access gate. Keeps the in-progress site off the public internet until
 * launch — every route except /gate itself is redirected here by src/proxy.ts
 * unless the visitor holds the gate cookie.
 *
 * This is a soft gate, not security: the password is checked client-side and
 * the cookie is not signed. It stops casual visitors and search engines, and
 * nothing behind it is patient data — the real portal still requires Supabase
 * auth. Do not treat it as protection for anything sensitive.
 */
function GateForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (value !== process.env.NEXT_PUBLIC_GATE_PASSWORD) {
      setError(true)
      return
    }
    // 30 days, so a returning visitor isn't asked again every session
    document.cookie = `_gate=${process.env.NEXT_PUBLIC_GATE_TOKEN}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
    router.replace(params.get('from') || '/')
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.paper, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, "Helvetica Neue", Arial, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Wordmark />
        </div>

        <div style={{
          background: '#fff', border: `1px solid ${C.line}`,
          borderRadius: 16, padding: '36px 32px',
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 6, letterSpacing: '-0.3px' }}>
            Site access
          </h1>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 28, lineHeight: 1.5 }}>
            This site is currently under development.
          </p>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="password"
              required
              placeholder="Password"
              value={value}
              onChange={e => { setValue(e.target.value); setError(false) }}
              style={{
                width: '100%', padding: '11px 14px', background: C.paper,
                border: `1px solid ${error ? '#C2564A' : C.line}`, borderRadius: 10,
                fontSize: 14, color: C.ink, outline: 'none',
              }}
            />
            <button type="submit" style={{
              width: '100%', padding: 12, background: C.teal, border: 'none',
              borderRadius: 10, fontSize: 14, fontWeight: 700, color: C.ink, cursor: 'pointer',
            }}>
              Enter &rarr;
            </button>
          </form>

          {error && (
            <p style={{ fontSize: 12, color: '#C2564A', marginTop: 12 }}>
              That password isn&apos;t right.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Wordmark() {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1, gap: 2, alignItems: 'center' }}>
      <span style={{
        fontSize: 9, fontWeight: 500, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: C.muted,
      }}>
        {BRAND.prefix}
      </span>
      <span style={{ fontSize: 28, lineHeight: 1 }}>
        <em style={{ fontStyle: 'italic', fontWeight: 500, color: C.teal, letterSpacing: '-0.01em' }}>
          {BRAND.nameItalic}
        </em>
        <strong style={{ fontWeight: 900, letterSpacing: '-0.04em', color: C.ink }}>
          {BRAND.nameBold}
        </strong>
      </span>
    </span>
  )
}

export default function GatePage() {
  // useSearchParams needs a Suspense boundary in the app router
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: C.paper }} />}>
      <GateForm />
    </Suspense>
  )
}
