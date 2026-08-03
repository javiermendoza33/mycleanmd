import Link from 'next/link'
import Image from 'next/image'
import { BRAND, C, GOLD } from '@/lib/brand'

/**
 * Marketing landing page — medical weight loss (GLP-1).
 *
 * Rebuilt Aug 2026 from the running production build, which had been deployed
 * from an uncommitted working tree and existed nowhere in git. Copy, palette
 * and layout were taken from the live render, so this is a faithful
 * reconstruction rather than the original file — small spacing differences are
 * possible. The previous CareMD multi-specialty page it replaced is in git
 * history at f8783a8 if any of it is ever wanted back.
 */

const NAV = [
  { label: 'How it works', href: '#how' },
  { label: "What's included", href: '#included' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const HERO_POINTS = [
  'FDA-cleared medications',
  'Licensed in all 50 states',
  'Prescriptions in 24 hours',
  'Delivered to your door',
]

const STEPS = [
  {
    num: '01', icon: '📋', title: 'Complete your health assessment',
    desc: 'Answer questions about your health history, current medications, and weight loss goals. Takes about 5 minutes.',
  },
  {
    num: '02', icon: '🩺', title: 'Meet your weight loss physician',
    desc: 'Same-day video consult with a board-certified doctor who reviews your case and prescribes the right GLP-1 for you.',
  },
  {
    num: '03', icon: '💊', title: 'GLP-1 delivered to your door',
    desc: 'Your semaglutide or tirzepatide prescription ships monthly. Check-ins every 4 weeks to track progress and adjust your dose.',
  },
]

const INCLUDED = [
  { icon: '💊', title: 'Semaglutide & Tirzepatide', desc: 'FDA-cleared GLP-1 medications with proven 15–22% average body weight reduction in clinical trials' },
  { icon: '🩺', title: 'Board-Certified Physicians', desc: 'Weight loss specialists licensed in all 50 states — available same day, no referral needed' },
  { icon: '🥗', title: 'Nutrition Coaching', desc: 'Personalized meal plans from registered dietitians designed to maximize your GLP-1 results' },
  { icon: '📊', title: 'Monthly Check-ins', desc: 'Progress tracking, lab monitoring, and dose adjustments every 4 weeks to keep you on track' },
  { icon: '🚚', title: 'Home Delivery', desc: 'Medications shipped discreetly to your door every month — no pharmacy lines, no hassle' },
  { icon: '💬', title: '7-Day Support', desc: 'Message your care team any day of the week through your patient portal — never feel alone in your journey' },
]

const STATS = [
  { value: '20%',  label: 'average body weight lost', sub: 'NEJM clinical trials' },
  { value: '24hr', label: 'prescription turnaround',  sub: 'avg. from assessment' },
  { value: '14k+', label: 'patients treated',         sub: 'and counting' },
  { value: '50',   label: 'states covered',           sub: 'licensed nationwide' },
]

const FOOTER = [
  { head: 'Program', links: ['GLP-1 Medications', 'Semaglutide', 'Tirzepatide', 'Nutrition Coaching'] },
  { head: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
  { head: 'Legal',   links: ['Privacy', 'Terms', 'HIPAA Notice'] },
]

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1, gap: 2 }}>
      <span style={{
        fontSize: 9, fontWeight: 500, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: light ? 'rgba(255,255,255,.55)' : C.muted,
      }}>
        {BRAND.prefix}
      </span>
      <span style={{ fontSize: 26, lineHeight: 1 }}>
        <em style={{ fontStyle: 'italic', fontWeight: 500, color: C.teal, letterSpacing: '-0.01em' }}>{BRAND.nameItalic}</em>
        <strong style={{ fontWeight: 900, letterSpacing: '-0.04em', color: light ? '#fff' : C.ink }}>{BRAND.nameBold}</strong>
      </span>
    </span>
  )
}

export default function Home() {
  return (
    <div style={{ background: C.white, color: C.ink, fontFamily: 'system-ui, sans-serif' }}>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', background: 'rgba(244,247,245,0.92)',
        backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.line}`,
      }}>
        <Link href="/"><Wordmark /></Link>
        <div style={{ display: 'flex', gap: 34, fontSize: 14 }}>
          {NAV.map(n => <a key={n.label} href={n.href} style={{ opacity: .75 }}>{n.label}</a>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 14 }}>
          <Link href="/auth/login" style={{ opacity: .75 }}>Log in</Link>
          <Link href="/onboarding" style={{
            background: C.teal, color: C.ink, borderRadius: 100,
            padding: '9px 20px', fontWeight: 600,
          }}>Get started &rarr;</Link>
        </div>
      </nav>

      {/* HERO — full-bleed photo, copy fading over it from the left */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 72 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image src="/hero.png" alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: '70% center' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(90deg, ${C.paper} 0%, ${C.paper} 32%, rgba(244,247,245,0.72) 46%, rgba(244,247,245,0) 62%)`,
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '0 48px', width: '100%' }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32,
              background: 'rgba(126,207,207,0.15)', border: '1px solid rgba(126,207,207,0.35)',
              borderRadius: 100, padding: '8px 18px', fontSize: 13.5,
            }}>
              <span style={{ color: C.teal, letterSpacing: 1 }}>★★★★★</span>
              <span>4.8 / 5 &nbsp;·&nbsp; 14,200 verified patients</span>
            </div>

            <h1 style={{
              fontFamily: 'Georgia, serif', fontWeight: 400,
              fontSize: 'clamp(44px, 5.5vw, 70px)', lineHeight: 1.1,
              letterSpacing: '-2px', color: C.ink,
            }}>
              Lose up to 20%<br />of your body weight<br />
              <em style={{ fontStyle: 'italic', color: C.teal }}>medically.</em>
            </h1>

            <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.6, color: C.muted, maxWidth: 520 }}>
              Board-certified physicians prescribe FDA-cleared semaglutide and tirzepatide — the same
              medications proven in clinical trials — shipped to your door.{' '}
              <strong style={{ color: C.ink }}>Starting at $149/mo.</strong>
            </p>

            <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
              <Link href="/onboarding" style={{
                ...GOLD, borderRadius: 100, padding: '15px 34px', fontSize: 15,
                fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 10,
              }}>
                Start my program <span style={{ opacity: .7 }}>↗</span>
              </Link>
              <a href="#included" style={{
                background: 'rgba(126,207,207,0.08)', color: C.teal, border: `1px solid ${C.teal}`,
                borderRadius: 100, padding: '14px 28px', fontSize: 15, fontWeight: 600,
              }}>
                See what&apos;s included
              </a>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 26px', marginTop: 40, fontSize: 13.5, color: C.muted }}>
              {HERO_POINTS.map(t => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%', border: `1px solid ${C.teal}`,
                    color: C.teal, fontSize: 10, display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>✓</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: C.white, padding: '110px 48px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.22em', color: C.teal, marginBottom: 14 }}>HOW IT WORKS</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(30px,3.4vw,45px)', letterSpacing: '-1px', marginBottom: 60 }}>
            From assessment to prescription in 24 hours.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 40 }}>
            {STEPS.map(s => (
              <div key={s.num}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, letterSpacing: '0.1em', marginBottom: 16 }}>{s.num}</div>
                <div style={{ fontSize: 30, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: C.muted }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section id="included" style={{ background: C.paper, padding: '110px 48px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.22em', color: C.teal, marginBottom: 14 }}>WHAT&apos;S INCLUDED</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(30px,3.4vw,45px)', letterSpacing: '-1px', marginBottom: 60 }}>
            Everything you need to succeed.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 22 }}>
            {INCLUDED.map(f => (
              <div key={f.title} style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: '30px 28px' }}>
                <div style={{ fontSize: 26, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16.5, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: C.muted }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: C.white, padding: '90px 48px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 30 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 46, color: C.teal, letterSpacing: '-1.5px' }}>{s.value}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>{s.label}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING CTA */}
      <section id="pricing" style={{ background: C.paper, padding: '110px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(30px,3.4vw,45px)', letterSpacing: '-1px' }}>
            Start losing weight this week.
          </h2>
          <p style={{ fontSize: 16.5, color: C.muted, marginTop: 18, lineHeight: 1.6 }}>
            Your prescription could be ready in 24 hours. No insurance required.
          </p>
          <Link href="/onboarding" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 34,
            background: C.ink, color: C.teal, borderRadius: 100,
            padding: '15px 30px', fontSize: 15, fontWeight: 700,
          }}>
            Get my prescription ↗
          </Link>
        </div>
      </section>

      <footer style={{ background: C.ink, color: 'rgba(255,255,255,0.7)', padding: '70px 48px 40px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.4fr) repeat(auto-fit,minmax(150px,1fr))', gap: 40 }}>
            <div>
              <Wordmark light />
              <p style={{ fontSize: 13.5, lineHeight: 1.65, marginTop: 18, maxWidth: 260 }}>{BRAND.tagline}</p>
            </div>
            {FOOTER.map(col => (
              <div key={col.head}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: C.teal, marginBottom: 16 }}>
                  {col.head.toUpperCase()}
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5 }}>
                  {col.links.map(l => <li key={l}>{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p style={{
            fontSize: 12.5, marginTop: 56, paddingTop: 26,
            borderTop: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)',
          }}>
            © {new Date().getFullYear()} {BRAND.name}. Not for emergencies — call 911 for life-threatening conditions.
          </p>
        </div>
      </footer>
    </div>
  )
}
