'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import HeroCanvas from '@/components/HeroCanvas'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

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

  async function handleGoogle() {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    })
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

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '12px 20px', background: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', marginBottom: 24, opacity: googleLoading ? 0.7 : 1, transition: 'opacity 0.2s' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

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
