'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const TOTAL = 6

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
]

const CARE_TYPES = [
  { key: 'primary',     icon: '🫀', label: 'Primary Care',         sub: 'Checkups, prescriptions, chronic care' },
  { key: 'mental',      icon: '🧠', label: 'Mental Health',        sub: 'Therapy, psychiatry, anxiety & more' },
  { key: 'dermatology', icon: '🌿', label: 'Skincare',             sub: 'Acne, eczema, hair loss, skincare' },
  { key: 'urgent',      icon: '🚨', label: 'Urgent Care',          sub: 'Infections, rashes, seen fast' },
  { key: 'womens',      icon: '🌸', label: "Women's Health",       sub: 'Birth control, hormones, OB/GYN' },
  { key: 'weight',      icon: '🥗', label: 'Weight Loss',          sub: 'GLP-1, nutrition, weight management' },
  { key: 'male',        icon: '♂️',  label: 'Male Sexual Health',   sub: 'ED, testosterone, premature ejaculation' },
  { key: 'hair',        icon: '💆', label: 'Hair Loss',            sub: 'Minoxidil, finasteride, regrowth plans' },
  { key: 'longevity',   icon: '⏳', label: 'Longevity',            sub: 'Preventive care, biomarkers, aging' },
  { key: 'menopause',   icon: '🌡️', label: 'Menopause',           sub: 'HRT, hot flashes, symptom management' },
  { key: 'nutrition',   icon: '🍎', label: 'Nutrition',            sub: 'Diet coaching, meal planning, macros' },
]

const sel: React.CSSProperties = { borderColor: 'var(--teal)', background: 'var(--teal-dim)' }
const unsel: React.CSSProperties = { borderColor: 'var(--divider)', background: 'var(--card-bg)' }

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step 1
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  // Step 2
  const [month, setMonth] = useState('')
  const [day,   setDay]   = useState('')
  const [year,  setYear]  = useState('')
  // Step 3
  const [phone, setPhone]         = useState('')
  const [smsUpdates, setSmsUpdates] = useState(false)
  const [smsPromo, setSmsPromo]   = useState(false)
  // Step 4
  const [gender, setGender] = useState('')
  // Step 5
  const [state, setState]   = useState('')
  // Step 6
  const [careTypes, setCareTypes] = useState<string[]>([])

  function toggleCare(key: string) {
    setCareTypes(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0,3)}) ${digits.slice(3)}`
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`
  }

  const next = () => setStep(s => Math.min(s + 1, TOTAL))
  const back = () => setStep(s => Math.max(s - 1, 1))

  async function finish() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: `${firstName} ${lastName}`,
        email: user.email,
        role: 'patient',
        gender,
        state,
        care_type: careTypes[0] ?? 'primary',
        phone: phone.replace(/\D/g,''),
      })
    }
    const primary = careTypes[0] ?? 'primary'
    router.push(`/patient/care/${primary}`)
  }

  // Shared styles
  const inp: React.CSSProperties = {
    width: '100%', padding: '16px 20px', background: 'var(--card-bg)',
    border: '1px solid var(--divider)', borderRadius: 100, fontSize: 16,
    color: '#fff', outline: 'none', boxSizing: 'border-box',
  }
  const btn = (active: boolean): React.CSSProperties => ({
    width: '100%', marginTop: 32, padding: '17px', border: 'none', borderRadius: 100,
    fontSize: 16, fontWeight: 700, cursor: active ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
    background: active ? 'var(--teal)' : 'var(--divider)',
    color: active ? 'var(--bg-dark)' : 'var(--muted)',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ height: 68, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 20, borderBottom: '1px solid var(--divider)', flexShrink: 0 }}>
        {step > 1
          ? <button onClick={back} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--divider)', background: 'none', color: 'var(--muted)', fontSize: 18, cursor: 'pointer', flexShrink: 0 }}>←</button>
          : <Link href="/" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--divider)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 18, textDecoration: 'none', flexShrink: 0 }}>←</Link>
        }
        <div style={{ flex: 1, height: 5, background: 'var(--divider)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(step / TOTAL) * 100}%`, background: 'var(--teal)', borderRadius: 3, transition: 'width 0.4s ease' }} />
        </div>
        <Link href="/" style={{ textDecoration: 'none', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--teal)' }}>Care</em>MD
        </Link>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>

          {/* ── Step 1: Name ── */}
          {step === 1 && (
            <div>
              <h1 style={{ fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: -0.5, marginBottom: 40, lineHeight: 1.15 }}>
                What is your first and last name?
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input autoFocus type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                  placeholder="First name" style={inp}
                  onFocus={e => e.target.style.borderColor='var(--teal)'}
                  onBlur={e => e.target.style.borderColor='var(--divider)'}
                  onKeyDown={e => e.key==='Enter' && firstName && lastName && next()}
                />
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="Last name" style={inp}
                  onFocus={e => e.target.style.borderColor='var(--teal)'}
                  onBlur={e => e.target.style.borderColor='var(--divider)'}
                  onKeyDown={e => e.key==='Enter' && firstName && lastName && next()}
                />
              </div>
              <button onClick={next} disabled={!firstName.trim() || !lastName.trim()} style={btn(!!(firstName && lastName))}>Next</button>
            </div>
          )}

          {/* ── Step 2: DOB ── */}
          {step === 2 && (
            <div>
              <h1 style={{ fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: -0.5, marginBottom: 40, lineHeight: 1.15 }}>
                What is your date of birth?
              </h1>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.4fr', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <select value={month} onChange={e => setMonth(e.target.value)}
                    style={{ ...inp, appearance: 'none', cursor: 'pointer', color: month ? '#fff' : 'var(--muted)' }}
                    onFocus={e => e.target.style.borderColor='var(--teal)'}
                    onBlur={e => e.target.style.borderColor='var(--divider)'}
                  >
                    <option value="" disabled>Select a month</option>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>▾</span>
                </div>
                <input type="text" inputMode="numeric" value={day} maxLength={2}
                  onChange={e => setDay(e.target.value.replace(/\D/g,''))}
                  placeholder="DD" style={{ ...inp, textAlign: 'center' }}
                  onFocus={e => e.target.style.borderColor='var(--teal)'}
                  onBlur={e => e.target.style.borderColor='var(--divider)'}
                />
                <input type="text" inputMode="numeric" value={year} maxLength={4}
                  onChange={e => setYear(e.target.value.replace(/\D/g,''))}
                  placeholder="YYYY" style={{ ...inp, textAlign: 'center' }}
                  onFocus={e => e.target.style.borderColor='var(--teal)'}
                  onBlur={e => e.target.style.borderColor='var(--divider)'}
                />
              </div>
              <button onClick={next} disabled={!month || !day || year.length < 4} style={btn(!!(month && day && year.length === 4))}>Next</button>
            </div>
          )}

          {/* ── Step 3: Phone ── */}
          {step === 3 && (
            <div>
              <h1 style={{ fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: -0.5, marginBottom: 40, lineHeight: 1.15 }}>
                What is your phone number?
              </h1>
              <input type="tel" inputMode="tel" value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="Phone Number" style={inp}
                onFocus={e => e.target.style.borderColor='var(--teal)'}
                onBlur={e => e.target.style.borderColor='var(--divider)'}
              />

              {/* SMS opt-ins */}
              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { val: smsUpdates, set: setSmsUpdates, label: 'I agree to receive order and account updates via SMS from The Labo Clinic.' },
                  { val: smsPromo,   set: setSmsPromo,   label: 'I agree to receive promotional messages via SMS from The Labo Clinic.' },
                ].map((item, i) => (
                  <button key={i} onClick={() => item.set(!item.val)}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${item.val ? 'var(--teal)' : 'var(--divider)'}`, background: item.val ? 'var(--teal)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s' }}>
                      {item.val && <span style={{ color: 'var(--bg-dark)', fontSize: 13, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Legal */}
              <p style={{ marginTop: 32, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                Message frequency varies. Message and data rates may apply. Reply STOP to cancel, HELP for help. See our{' '}
                <a href="#" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Terms & Conditions</a> and{' '}
                <a href="#" style={{ color: 'var(--teal)', textDecoration: 'none' }}>Privacy Policy</a>.
              </p>

              <button onClick={next} style={btn(true)}>Next</button>
            </div>
          )}

          {/* ── Step 4: Gender ── */}
          {step === 4 && (
            <div>
              <h1 style={{ fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: -0.5, marginBottom: 40, lineHeight: 1.15 }}>
                What is your birth-assigned gender?
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Female', 'Male'].map(g => (
                  <button key={g} onClick={() => { setGender(g); next() }}
                    style={{ width: '100%', padding: '22px', border: `1.5px solid ${gender === g ? 'var(--teal)' : 'var(--divider)'}`, borderRadius: 100, background: gender === g ? 'var(--teal-dim)' : 'var(--card-bg)', fontSize: 17, fontWeight: 600, color: gender === g ? 'var(--teal)' : '#fff', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 5: State ── */}
          {step === 5 && (
            <div>
              <h1 style={{ fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: -0.5, marginBottom: 40, lineHeight: 1.15 }}>
                What state do you live in?
              </h1>
              <div style={{ position: 'relative' }}>
                <select value={state} onChange={e => setState(e.target.value)}
                  style={{ ...inp, appearance: 'none', cursor: 'pointer', color: state ? '#fff' : 'var(--muted)' }}
                  onFocus={e => e.target.style.borderColor='var(--teal)'}
                  onBlur={e => e.target.style.borderColor='var(--divider)'}
                >
                  <option value="" disabled>State</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none' }}>▾</span>
              </div>
              <button onClick={next} disabled={!state} style={btn(!!state)}>Next</button>
            </div>
          )}

          {/* ── Step 6: Care type ── */}
          {step === 6 && (
            <div>
              <h1 style={{ fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: -0.5, marginBottom: 10, lineHeight: 1.15 }}>
                What kinds of care are you interested in?
              </h1>
              <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 32 }}>Select all that apply.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {CARE_TYPES.map(c => {
                  const active = careTypes.includes(c.key)
                  return (
                    <button key={c.key} onClick={() => toggleCare(c.key)}
                      style={{ padding: '22px 18px', borderRadius: 16, border: `1.5px solid ${active ? 'var(--teal)' : 'var(--divider)'}`, background: active ? 'var(--teal-dim)' : 'var(--card-bg)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: active ? 'var(--teal)' : '#fff', marginBottom: 4 }}>{c.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{c.sub}</div>
                    </button>
                  )
                })}
              </div>
              <button onClick={finish} disabled={careTypes.length === 0 || saving} style={btn(careTypes.length > 0 && !saving)}>
                {saving ? 'Setting up your profile…' : "Let's go →"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
