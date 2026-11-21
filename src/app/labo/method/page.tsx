import Link from "next/link";
import { Eyebrow, ClosingCTA } from "@/components/labo/Sections";
import { PROGRAMS, AVAILABILITY, METHOD, PRACTICE } from "@/labo/content";
import { posts } from "@/labo/method/posts";
import HeroVideo from "@/components/labo/HeroVideo";
import Gate from "./Gate";

/** The 4 program-evidence articles, one per program, in program order — the
 *  2 general trust articles (how telehealth works, compounded meds) stay
 *  reachable from /blog but don't need a homepage slot. */
const JOURNAL_TEASER = [
  "glp-1-weight-loss-what-the-evidence-shows",
  "peptide-therapy-what-we-know-and-dont",
  "testosterone-therapy-for-men-what-to-know",
  "hormone-therapy-for-women-the-new-evidence",
].map((slug) => posts.find((p) => p.slug === slug)!);

/**
 * Nov 19 2026: ported onto the Clinic's own storefront hero pattern (split
 * hero, type left / photo right) instead of the plain White Room PageHero,
 * per Javier's ask to give Method "the same feel and look as Clinic."
 * Nov 20 2026: the still photo (misc/cta-bg.jpg, a generic skincare shot —
 * the library has no hormone/weight/peptide content) was swapped for a real
 * clip Javier supplied (iStock-1396059447, an active woman jogging) — a much
 * closer match for a hormone/weight/energy program than a static beauty
 * portrait. Re-encoded to web H.264 (desktop 1280w ~2.2Mbps, mobile 720w
 * ~520kbps, no audio) via `HeroVideo`, same fade-in-over-its-own-first-frame
 * pattern as the Clinic's own hero.
 */
export default function MethodHome() {
  return (
    <>
      <section className="fhero">
        <div className="fgrid">
          <div className="ftext">
            <span className="kicker">Telehealth</span>
            <h1>Hormone, weight and peptide care — <em>by video</em>.</h1>
            <p className="sub">{METHOD.name} is the telehealth side of the practice: real labs first, a real dose plan, and a clinician actually watching. Licensed for residents of {AVAILABILITY}.</p>
            <div className="acts">
              <Link className="btn btn-primary" href="/programs">See programs</Link>
              <Link className="btn btn-ghost" href="/pricing">Pricing</Link>
            </div>
          </div>
          <div className="fmedia">
            <HeroVideo
              desktopSrc="/labo/img/method/hero.mp4"
              mobileSrc="/labo/img/method/hero-mobile.mp4"
              poster="/labo/img/method/hero-poster.jpg"
            />
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap tight">
          <Gate />
        </div>
      </section>

      <section className="grey">
        <div className="wrap">
          <Eyebrow>Programs</Eyebrow>
          <h2 style={{ marginTop: 15 }}>What brings you here?</h2>
          <div className="tiles" style={{ marginTop: 38 }}>
            {PROGRAMS.map((p) => (
              <article className="tile" key={p.slug}>
                <span className="kicker">Program {p.index}</span>
                <h3>{p.name}</h3>
                <p>{p.cardBlurb}</p>
                <p className="mono" style={{ marginTop: 12, fontWeight: 600 }}>{p.priceMeta}</p>
                <div style={{ display: "flex", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
                  <Link className="btn btn-primary" href={`/join/${p.slug}`}>Get started</Link>
                  <Link className="more" href={`/programs/${p.slug}`}>Learn more</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="rowhead"><h2>From the journal</h2><Link className="more" href="/blog">Read all</Link></div>
          {/* .cards defaults to a 3-column grid (right for the 6-post /blog index) — .cols4 here so
              exactly 4 program-evidence teasers fill one clean row instead of 3-then-1 (see labo.css
              for the responsive collapse — an inline style would have beaten the existing @media rules
              at narrow widths, so this needed its own small CSS class instead). */}
          <div className="cards cols4" style={{ marginTop: 30 }}>
            {JOURNAL_TEASER.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card">
                <div className="img"><img src={p.image.src} alt={p.image.alt} loading="lazy" /></div>
                <div className="cb">
                  <h2 style={{ fontSize: "1.15rem" }}>{p.title}</h2>
                  <p>{p.excerpt}</p>
                  <span className="more">Read more</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grey">
        <div className="wrap tight" style={{ textAlign: "center" }}>
          <Eyebrow>Also from {PRACTICE.name}</Eyebrow>
          <h2 style={{ marginTop: 15 }}>Need to be seen in person?</h2>
          <p className="sub" style={{ marginTop: 17 }}>
            Botox, fillers, laser and skin treatments at our Seattle clinic — {PRACTICE.name} handles those in person.
          </p>
          <div style={{ marginTop: 26 }}>
            <a className="btn btn-ghost" href={`https://${PRACTICE.domain}`}>Visit {PRACTICE.name} ↗</a>
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
