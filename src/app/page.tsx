import Link from 'next/link'
import Image from 'next/image'

const NAV_LINKS = ['Specialties', 'How it works', 'For employers', 'About']
const TRUST = ['Licensed in all 50 states', 'HIPAA-secure visits', 'Same-day appointments', 'Prescriptions delivered']
const STEPS = [
  { num: '01', icon: '🔍', title: 'Choose your specialty', desc: 'Primary care, mental health, dermatology, urgent care. No referrals needed.' },
  { num: '02', icon: '📹', title: 'Meet your doctor', desc: 'Secure video visit on any device. Your doctor listens and creates a care plan.' },
  { num: '03', icon: '💊', title: 'Get care, delivered', desc: 'Prescriptions sent to your pharmacy or door. Follow-up included at no extra charge.' },
]
const SPECIALTIES = [
  { icon: '🫀', title: 'Primary Care',      desc: 'Checkups, chronic conditions, prescriptions' },
  { icon: '🧠', title: 'Mental Health',     desc: 'Therapy, psychiatry, ADHD, anxiety, depression' },
  { icon: '🌿', title: 'Dermatology',       desc: 'Acne, eczema, hair loss, rosacea' },
  { icon: '🚨', title: 'Urgent Care',       desc: 'UTIs, infections, rashes — seen in minutes' },
  { icon: '🌸', title: "Women's Health",    desc: 'Birth control, hormones, OB/GYN consults' },
  { icon: '🥗', title: 'Nutrition & Weight',desc: 'GLP-1 care, dietitian, weight management plans' },
]

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', background: 'rgba(11,24,40,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(126,207,207,0.08)' }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
          <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--teal)' }}>Care</em>MD
        </span>
        <div style={{ display: 'flex', gap: 32 }}>
          {NAV_LINKS.map(l => <a key={l} href="#" style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>{l}</a>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link href="/auth/login" style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>Log in</Link>
          <Link href="/auth/signup" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: 'var(--teal)', color: 'var(--bg-dark)', fontSize: 14, fontWeight: 600, borderRadius: 100, textDecoration: 'none' }}>
            See a doctor →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 68, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg-dark) 38%, transparent 58%)', zIndex: 1, pointerEvents: 'none' }} />
        {/* Hero photo */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', zIndex: 0 }}>
          <Image
            src="/hero.png"
            alt="Happy couple after telehealth visit"
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center top', opacity: 0.75, filter: 'brightness(1.0) saturate(0.8)' }}
          />
          {/* Fade left into dark bg */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg-dark) 0%, rgba(11,24,40,0.6) 30%, rgba(11,24,40,0) 65%)' }} />
          {/* Fade top */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--bg-dark) 0%, rgba(11,24,40,0) 15%, rgba(11,24,40,0) 80%, rgba(11,24,40,0.6) 100%)' }} />
          {/* Teal tint for brand cohesion */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,16,24,0.12)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 0 80px 72px', maxWidth: 620 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', background: 'rgba(126,207,207,0.1)', border: '1px solid rgba(126,207,207,0.2)', borderRadius: 100, fontSize: 13, color: 'var(--accent-2,#C8DFE8)', marginBottom: 32, width: 'fit-content' }}>
            <span style={{ color: 'var(--teal)', letterSpacing: -1 }}>★★★★★</span> 4.8 / 5 &nbsp;·&nbsp; 14,200 verified reviews
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(44px,5.5vw,72px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: -2, marginBottom: 28, color: '#fff' }}>
            <strong style={{ fontWeight: 700 }}>Expert doctors.</strong><br />
            <em style={{ fontStyle: 'italic', color: 'var(--teal)' }}>Zero</em> waiting<br />
            rooms.
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--muted)', marginBottom: 40, maxWidth: 460 }}>
            Board-certified physicians for primary care, mental health, dermatology, and more — available by video visit,{' '}
            <strong style={{ color: '#C8DFE8', fontWeight: 500 }}>starting at $49.</strong>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', background: 'var(--teal)', color: 'var(--bg-dark)', fontSize: 15, fontWeight: 700, borderRadius: 100, textDecoration: 'none' }}>
              See a doctor today
              <span style={{ width: 30, height: 30, background: 'var(--bg-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>↗</span>
            </Link>
            <a href="#specialties" style={{ padding: '14px 28px', border: '1px solid var(--divider)', color: '#C8DFE8', fontSize: 15, fontWeight: 500, borderRadius: 100, textDecoration: 'none' }}>
              Browse specialties
            </a>
          </div>
        </div>

        <div style={{ position: 'absolute', right: 52, bottom: 80, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {TRUST.map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#C8DFE8' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', border: '1.5px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--teal)', flexShrink: 0 }}>✓</span>
              {t}
            </div>
          ))}
        </div>
      </section>


      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 72px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 600, marginBottom: 20 }}>How CareMD works</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: -1, marginBottom: 64, maxWidth: 520 }}>
          From symptom to <em style={{ fontStyle: 'italic', color: 'var(--teal)' }}>treatment</em> in under an hour.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ padding: '48px 40px', background: 'var(--card-bg)', border: '1px solid var(--divider)', borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : 0 }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 72, fontWeight: 700, fontStyle: 'italic', color: 'rgba(126,207,207,0.12)', lineHeight: 1, display: 'block', marginBottom: 32 }}>{s.num}</span>
              <span style={{ fontSize: 28, marginBottom: 16, display: 'block' }}>{s.icon}</span>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{s.title}</div>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--muted)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALTIES */}
      <section id="specialties" style={{ padding: '0 72px 100px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 600, marginBottom: 20 }}>What we treat</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: -1, marginBottom: 48, maxWidth: 520 }}>
          The care you need, <em style={{ fontStyle: 'italic', color: 'var(--teal)' }}>when</em> you need it.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {SPECIALTIES.map(s => (
            <Link key={s.title} href="/auth/signup" style={{ padding: 32, background: 'var(--card-bg)', border: '1px solid var(--divider)', borderRadius: 16, textDecoration: 'none', display: 'block' }}>
              <span style={{ fontSize: 28, marginBottom: 16, display: 'block' }}>{s.icon}</span>
              <div style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>{s.desc}</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20, fontSize: 13, color: 'var(--teal)', fontWeight: 500 }}>Book a visit →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <div style={{ margin: '0 72px 100px', padding: '72px 80px', background: 'var(--teal)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
        <div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,3vw,40px)', fontWeight: 700, color: 'var(--bg-dark)', letterSpacing: -1, lineHeight: 1.15, marginBottom: 10 }}>Ready to feel better?</div>
          <p style={{ fontSize: 15, color: 'rgba(11,24,40,0.65)' }}>Your first visit is a few clicks away. No insurance required.</p>
        </div>
        <Link href="/auth/signup" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 30px', background: 'var(--bg-dark)', color: 'var(--teal)', fontSize: 15, fontWeight: 700, borderRadius: 100, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
          See a doctor today ↗
        </Link>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--divider)', padding: '48px 72px 36px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--teal)' }}>Care</em>MD
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 220, lineHeight: 1.6 }}>Expert telehealth care for every body, available wherever you are.</p>
        </div>
        <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
          {[
            { title: 'Specialties', links: ['Primary Care','Mental Health','Dermatology','Urgent Care'] },
            { title: 'Company',     links: ['About','Careers','Blog','Press'] },
            { title: 'Legal',       links: ['Privacy','Terms','HIPAA Notice'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, marginBottom: 16 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => <li key={l}><a href="#" style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ width: '100%', borderTop: '1px solid var(--divider)', paddingTop: 24, marginTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>© 2026 CareMD. Not for emergencies — call 911 for life-threatening conditions.</p>
        </div>
      </footer>

    </div>
  )
}
