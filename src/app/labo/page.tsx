import Link from "next/link";
import { ClosingCTA, WaveArt, Framed, Eyebrow } from "@/components/labo/Sections";
import {
  HERO, TRUST_BAR, PROGRAMS, HOW_SHORT, CLINICIAN, EXTRA_PRICING, HEALTHIE, PRACTICE, ABOUT,
} from "@/labo/content";

export default function LaboHome() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="hero">
        <WaveArt />
        <div className="wrap">
          <div className="hero-in">
            <div className="hero-left">
              <Eyebrow>{HERO.eyebrow}</Eyebrow>
              <h1 className="h1-home">{HERO.h1}</h1>
              <p className="lead hero-lede">{HERO.lede}</p>
              <div className="hero-btns">
                <a className="btn btn-pine btn-lg" href={HEALTHIE.intake}
                   target="_blank" rel="noopener noreferrer">Start your intake</a>
                <a className="btn btn-outline btn-lg" href={HEALTHIE.book}
                   target="_blank" rel="noopener noreferrer">Book a consult</a>
              </div>
            </div>
            <div className="hero-stats">
              {HERO.stats.map((s) => (
                <div key={s.figure} className="hero-stat">
                  <div className="stat">{s.figure}</div>
                  <p>{s.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ───────────────────────────────────────────────────── */}
      <div className="band-pine">
        <div className="trust-in">
          {TRUST_BAR.map((t, i) => (
            <span key={t}>
              {i > 0 && <span className="trust-sep" aria-hidden="true">/&nbsp;&nbsp;</span>}
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── FOUR PROGRAMS ───────────────────────────────────────────────── */}
      <section className="wrap sect">
        <div className="head-row">
          <h2 className="h2">Four programs</h2>
          <p className="head-note">
            Each one begins with labs and a video visit. Nothing is prescribed off a questionnaire.
          </p>
        </div>
        <div className="hair prog-grid">
          {PROGRAMS.map((p) => (
            <Link key={p.slug} className="prog-cell" href={`/programs/${p.slug}`}>
              <div className="prog-top">
                <span className="eyebrow-brass">{p.index}</span>
                <span className="prog-price">{p.priceMeta}</span>
              </div>
              <h3 className="h3">{p.name}</h3>
              <p className="prog-body">{p.cardBlurb}</p>
              <span className="prog-more">Read more <i aria-hidden="true">→</i></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="band-raised">
        <div className="wrap" style={{ paddingBlock: 88 }}>
          <Eyebrow>How it works</Eyebrow>
          <div className="steps" style={{ marginTop: 42 }}>
            {HOW_SHORT.map((s) => (
              <div key={s.n} className="step">
                <span className="step-n">{s.n}</span>
                <h3 className="h3-sm">{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLINICIAN ───────────────────────────────────────────────────── */}
      <section className="wrap sect">
        <div className="clin">
          <Framed src={ABOUT.slides[0].src} alt={PRACTICE.provider} pos={ABOUT.slides[0].pos} />
          <div>
            <Eyebrow>Your clinician</Eyebrow>
            <blockquote className="quote clin-quote">&ldquo;{CLINICIAN.quote}&rdquo;</blockquote>
            <p className="body-sm" style={{ fontSize: 15.5 }}>{CLINICIAN.body}</p>
            <div className="clin-by">
              <span className="clin-name">{PRACTICE.provider}</span>
              <Link className="link-brass" href="/about">Full background</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ─────────────────────────────────────────────── */}
      <section className="wrap sect-sm">
        <div className="head-row">
          <h2 className="h2">Straightforward pricing</h2>
          <Link className="link-brass" href="/pricing">See what&rsquo;s included</Link>
        </div>
        <div>
          {PROGRAMS.map((p) => (
            <div key={p.slug} className="price-row">
              <span className="price-name">{p.name}</span>
              <span className="price-note">{p.pricingNote}</span>
              <span className="price-amt">{p.priceMeta}</span>
            </div>
          ))}
          <div className="price-row">
            <span className="price-name">{EXTRA_PRICING[0].name}</span>
            <span className="price-note">One-time, credited toward your first month</span>
            <span className="price-amt">{EXTRA_PRICING[0].price}</span>
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
