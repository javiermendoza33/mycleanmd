'use client'

import { useState } from 'react'
import Link from 'next/link'

const SAGE       = '#5B9E82'
const SAGE_MID   = '#3D7A62'
const SAGE_LIGHT = '#EBF5EF'
const FOREST     = '#1C2D26'
const MUTED_SAGE = '#7A9386'
const PAGE_BG    = '#F4F7F5'
const CARD       = '#FFFFFF'
const BORDER     = '#E2ECE7'

const FEATURES = [
  'Eligible for FSA/HSA',
  'Unlimited video visits with real providers who care',
  'Nutrition coaching sessions',
  'Access to weight loss medication and more',
  '24/7 patient support',
]

const PLANS = [
  { id: '1m', label: '1 Month',  perMonth: 79, origTotal:  79, dueTotal:  39, save:  40, badge: null,           popular: false },
  { id: '3m', label: '3 Months', perMonth: 69, origTotal: 207, dueTotal: 167, save:  70, badge: 'Most popular', popular: true  },
  { id: '6m', label: '6 Months', perMonth: 59, origTotal: 354, dueTotal: 314, save: 160, badge: null,           popular: false },
  { id: '1y', label: '1 Year',   perMonth: 49, origTotal: 588, dueTotal: 548, save: 400, badge: null,           popular: false },
]

const MEDS = [
  { label: 'Compounded Semaglutide',  price: '$99 / mo',  emoji: '💉' },
  { label: 'Compounded Tirzepatide',  price: '$199 / mo', emoji: '💊' },
]

export default function WeightPlanPage() {
  const [selected, setSelected] = useState('3m')

  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 28px' }}>

        {/* Promo banner */}
        <div style={{
          padding: '13px 20px',
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          fontSize: 14,
          color: FOREST,
          lineHeight: 1.5,
          marginBottom: 36,
          boxShadow: '0 1px 4px rgba(28,45,38,0.05)',
        }}>
          Limited-time offer for you! <strong>$40 off your first month</strong> of membership.{' '}
          <span style={{ color: SAGE, textDecoration: 'underline', cursor: 'pointer' }}>Terms apply.</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: FOREST, lineHeight: 1.25, marginBottom: 26, letterSpacing: -0.5 }}>
          Join a community of members who have transformed their health with The Labo Clinic.
        </h1>

        {/* Feature checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 36 }}>
          {FEATURES.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: SAGE, fontSize: 14, fontWeight: 700, flexShrink: 0, lineHeight: 1 }}>✓</span>
              <span style={{ fontSize: 14, color: MUTED_SAGE }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {PLANS.map(plan => {
            const active = selected === plan.id
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '18px 20px',
                  background: CARD,
                  border: `1.5px solid ${active ? SAGE : BORDER}`,
                  borderRadius: 16,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: active ? `0 0 0 3px rgba(91,158,130,0.14)` : 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                {/* Left — radio + label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${active ? SAGE : BORDER}`,
                    background: active ? SAGE : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: FOREST, marginBottom: 3 }}>
                      {plan.label}
                    </p>
                    <p style={{ fontSize: 13, color: MUTED_SAGE }}>
                      <span style={{ textDecoration: 'line-through', marginRight: 4 }}>${plan.origTotal}</span>
                      <span style={{ color: FOREST, fontWeight: 500 }}>${plan.dueTotal} due today</span>
                    </p>
                  </div>
                </div>

                {/* Right — badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {plan.badge && (
                    <span style={{
                      padding: '5px 12px',
                      background: FOREST, color: '#fff',
                      borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
                    }}>
                      {plan.badge}
                    </span>
                  )}
                  <span style={{
                    padding: '5px 12px',
                    background: SAGE_LIGHT, color: SAGE_MID,
                    borderRadius: 100, fontSize: 11, fontWeight: 700,
                    border: `1px solid rgba(91,158,130,0.25)`,
                  }}>
                    Save ${plan.save}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Auto-renew note */}
        <p style={{ fontSize: 12, color: MUTED_SAGE, lineHeight: 1.65, marginBottom: 44 }}>
          At the end of the applicable subscription term, membership will automatically renew at standard rates.
        </p>

        {/* Medication section */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: FOREST, lineHeight: 1.4, marginBottom: 22 }}>
          Once you&apos;re a member, you can talk to your provider about medications that may be right for you.
        </h2>

        <div style={{ marginBottom: 12 }}>
          {MEDS.map((m, i) => (
            <div key={m.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px 0',
              borderBottom: `1px solid ${BORDER}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: SAGE_LIGHT,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>
                  {m.emoji}
                </div>
                <span style={{ fontSize: 14, color: FOREST, fontWeight: 500 }}>{m.label}</span>
              </div>
              <span style={{ fontSize: 14, color: FOREST, fontWeight: 600 }}>{m.price}</span>
            </div>
          ))}

          {/* Third item */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '15px 0', gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: SAGE_LIGHT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>
              ✨
            </div>
            <span style={{ fontSize: 14, color: MUTED_SAGE }}>
              And access to other treatments across skincare, hair growth, and more.
            </span>
          </div>
        </div>

        <p style={{ fontSize: 12, color: MUTED_SAGE, lineHeight: 1.65 }}>
          Monthly prices include a 28-day supply of medication. Medication orders must be approved by your provider.
        </p>

      </div>

      {/* Sticky footer CTA — offset by sidebar width (240px = ml-60) */}
      <div style={{
        position: 'fixed', bottom: 0, left: 240, right: 0,
        padding: '14px 28px',
        background: PAGE_BG,
        borderTop: `1px solid ${BORDER}`,
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Link
            href="/patient/care/weight/intake"
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              padding: '15px',
              background: FOREST, color: '#fff',
              borderRadius: 100, fontSize: 15, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Select plan
          </Link>
          <Link href="/patient/dashboard" style={{ fontSize: 13, color: MUTED_SAGE, textDecoration: 'none' }}>
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
