'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import SocialAuth from '@/components/SocialAuth'

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

          <SocialAuth mode="signup" role={role} />
          <div style={{ height: 20 }} />

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
