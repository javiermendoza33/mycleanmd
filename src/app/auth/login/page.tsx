'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import HeroCanvas from '@/components/HeroCanvas'
import SocialAuth from '@/components/SocialAuth'

function LoginInner() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Surface the callback's failure instead of dropping the visitor on a form
  // with no explanation about why they are not signed in.
  useEffect(() => {
    if (params.get('error') === 'oauth_failed') {
      setError('That sign-in did not complete. Please try again, or use email.')
    }
  }, [params])

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', data.user.id).single()
    const role = profile?.role ?? 'patient'
    if (role === 'doctor') router.push('/doctor/dashboard')
    else if (role === 'admin') router.push('/admin/dashboard')
    else router.push('/patient/dashboard')
    router.refresh()
  }


  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', background: 'var(--bg-dark)' }}>

      {/* LEFT — Brand panel */}
      <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <HeroCanvas />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,24,40,0.92) 0%, rgba(11,24,40,0.6) 100%)' }} />

        {/* Content over canvas */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '48px 56px' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', fontSize: 22, fontWeight: 700, color: '#fff' }}>
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--teal)' }}>Care</em>MD
          </Link>

          {/* Center content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 600, marginBottom: 20 }}>
              Telehealth, simplified
            </p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px,3.5vw,52px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: -1.5, color: '#fff', marginBottom: 32 }}>
              Your doctor is<br />
              <em style={{ fontStyle: 'italic', color: 'var(--teal)' }}>one click</em> away.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--muted)', maxWidth: 360 }}>
              Board-certified physicians available today — no waiting rooms, no commute, no hassle.
            </p>

            {/* Trust items */}
            <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                ['✓', 'Licensed physicians in all 50 states'],
                ['✓', 'HIPAA-secure video visits'],
                ['✓', 'Same-day appointments available'],
              ].map(([check, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--teal)', flexShrink: 0 }}>{check}</span>
                  <span style={{ fontSize: 14, color: '#C8DFE8' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p style={{ fontSize: 12, color: 'var(--muted)', position: 'relative', zIndex: 1 }}>
            © 2026 CareMD · HIPAA Compliant · 256-bit Encrypted
          </p>
        </div>
      </div>

      {/* RIGHT — Form panel */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 72px', background: 'var(--sidebar-bg)', borderLeft: '1px solid var(--divider)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Header */}
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: -0.5, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 36 }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>Sign up free</Link>
          </p>

          <SocialAuth mode="login" />
          <div style={{ height: 24 }} />

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
            <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-dark)', border: '1px solid var(--divider)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                onBlur={e => e.target.style.borderColor = 'var(--divider)'}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>Password</label>
                <a href="#" style={{ fontSize: 13, color: 'var(--teal)', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'var(--bg-dark)', border: '1px solid var(--divider)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                  onBlur={e => e.target.style.borderColor = 'var(--divider)'}
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 13, padding: 0 }}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, fontSize: 13, color: '#F87171' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? 'rgba(126,207,207,0.5)' : 'var(--teal)', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, color: 'var(--bg-dark)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s', marginTop: 4 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* HIPAA note */}
          <p style={{ marginTop: 32, fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
            🔒 Your health data is protected under HIPAA.<br />256-bit encrypted & never sold.
          </p>
        </div>
      </div>
    </div>
  )
}

/* useSearchParams needs a Suspense boundary or the whole route opts out of
   static rendering. */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  )
}
