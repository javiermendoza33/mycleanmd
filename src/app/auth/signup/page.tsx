'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const ROLES = [
  { value: 'patient', label: 'Patient', desc: 'I need care', icon: '🧑‍⚕️' },
  { value: 'doctor', label: 'Provider', desc: 'I practice medicine', icon: '👨‍⚕️' },
] as const

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [role, setRole] = useState<'patient' | 'doctor'>('patient')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name, role } },
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: name, role, email })
    }
    if (role === 'doctor') router.push('/doctor/dashboard')
    else router.push('/patient/dashboard')
    router.refresh()
  }

  const focusStyle = { borderColor: 'var(--teal)' }
  const blurStyle = { borderColor: 'var(--divider)' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', background: 'var(--bg-dark)' }}>

      {/* LEFT — Info panel */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 64px', background: 'var(--sidebar-bg)', borderRight: '1px solid var(--divider)' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 64, display: 'block' }}>
          <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--teal)' }}>Care</em>MD
        </Link>

        <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 600, marginBottom: 20 }}>
          Join 40,000+ patients
        </p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(30px,2.8vw,44px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: -1, color: '#fff', marginBottom: 32 }}>
          The care you deserve,<br />
          <em style={{ fontStyle: 'italic', color: 'var(--teal)' }}>on your schedule.</em>
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 380, marginBottom: 48 }}>
          Same-day visits, prescription delivery, and ongoing care — all from your phone, tablet, or laptop.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { icon: '🏥', title: '50+ specialties', sub: 'Primary care, mental health, dermatology & more' },
            { icon: '⚡', title: 'Same-day available', sub: 'Connect with a doctor in as little as 15 minutes' },
            { icon: '💊', title: 'Prescriptions delivered', sub: 'Sent to your pharmacy or shipped to your door' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, background: 'rgba(126,207,207,0.08)', border: '1px solid rgba(126,207,207,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 64, fontSize: 12, color: 'var(--muted)' }}>© 2026 CareMD · HIPAA Compliant</p>
      </div>

      {/* RIGHT — Form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 72px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: -0.5, marginBottom: 8 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle} disabled={googleLoading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '12px 20px', background: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#1a1a1a', cursor: 'pointer', marginBottom: 20, opacity: googleLoading ? 0.7 : 1 }}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
            <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>or sign up with email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Role selector */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>I am joining as a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {ROLES.map(r => (
                  <button
                    key={r.value} type="button" onClick={() => setRole(r.value)}
                    style={{ padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${role === r.value ? 'var(--teal)' : 'var(--divider)'}`, background: role === r.value ? 'var(--teal-dim)' : 'var(--bg-dark)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{r.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: role === r.value ? 'var(--teal)' : '#fff' }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 6 }}>Full name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} required
                placeholder="Jane Smith"
                style={{ width: '100%', padding: '11px 14px', background: 'var(--bg-dark)', border: '1px solid var(--divider)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none' }}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, blurStyle)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com"
                style={{ width: '100%', padding: '11px 14px', background: 'var(--bg-dark)', border: '1px solid var(--divider)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none' }}
                onFocus={e => Object.assign(e.target.style, focusStyle)}
                onBlur={e => Object.assign(e.target.style, blurStyle)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                  placeholder="Min. 8 characters"
                  style={{ width: '100%', padding: '11px 44px 11px 14px', background: 'var(--bg-dark)', border: '1px solid var(--divider)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none' }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, blurStyle)}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 12 }}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 10, fontSize: 13, color: '#F87171' }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? 'rgba(126,207,207,0.5)' : 'var(--teal)', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, color: 'var(--bg-dark)', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}
            >
              {loading ? 'Creating account…' : 'Create account →'}
            </button>

            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
              By signing up you agree to our{' '}
              <a href="#" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Terms</a> and{' '}
              <a href="#" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Privacy Policy</a>.
              🔒 HIPAA compliant.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
