import Link from "next/link";
import Gate from "./Gate";
import { Footer } from "@/components/labo/Chrome";
import { CLINIC, FIRST_VISIT, HEALTHIE, LASER_SPECS, PRACTICE, PROGRAMS, TREATMENTS } from "@/labo/content";

/**
 * thelabomethod.com homepage — CLINIC FIRST (Oct 26 2026).
 *
 * Javier: "Now that you know what we will be offering with laser, let's create a
 * better, more premium site" → "one brand, clinic first" + "placeholders for now"
 * + "Seattle-based clinic, address to come". The in-person laser clinic leads;
 * the telehealth programs (and their eligibility gate, still the primary
 * element of that section) follow as the second line of the practice.
 *
 * Same White Room system (labo.css): Inter + Plex Mono, single light theme,
 * Ember accent. Photos are labelled placeholder frames (.ph) — no stock in the
 * clinic sections. Prices are Seattle-comp placeholders until Monika confirms
 * them (content.ts blocking item #5); the street address is not published.
 */
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const TELE = [
  { slug: PROGRAMS[0].slug, name: "GLP-1 weight management", note: "Semaglutide or tirzepatide, dosed against your metabolic panel." },
  { slug: PROGRAMS[1].slug, name: "Peptide therapy", note: "Recovery and repair protocols, cycled and re-tested." },
  { slug: PROGRAMS[2].slug, name: "Testosterone for men", note: "A full endocrine work-up first, treatment only where indicated." },
  { slug: PROGRAMS[3].slug, name: "Hormone therapy for women", note: "Perimenopause and menopause care that takes symptoms seriously." },
];

/** Fitzpatrick I–VI and which wavelength reaches them safely — the clinic's signature row. */
const SKIN = ["#F6E3D4", "#EDCDB3", "#D9AE8A", "#B98463", "#8A5A3E", "#5A3826"];

/** A photo frame. With `src` it shows a STOCK stand-in (Unsplash licence, free for commercial use — Oct 26 2026,
 *  Javier: "add some stock photos… I can replace them later"); without it, a labelled placeholder. Replace the
 *  files in public/labo/clinic-*.jpg (same names and aspect ratios) and drop the "Stock ·" captions. */
function Ph({ label, ratio, className, src, alt, pos }: { label: string; ratio?: string; className?: string; src?: string; alt?: string; pos?: string }) {
  return (
    <figure className={`ph ${src ? "has-img" : ""} ${className ?? ""}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {src && <img src={src} alt={alt ?? ""} style={pos ? { objectPosition: pos } : undefined} loading={className === "hero-ph" ? "eager" : "lazy"} />}
      <span>{src ? `Stock · ${label}` : `Photo · ${label}`}</span>
    </figure>
  );
}

export default function LaboHome() {
  return (
    <>
      <header className="site">
        <div className="wrap bar">
          <a className="brand" href="#top">{PRACTICE.name}</a>
          <nav className="main" aria-label="Sections">
            <Link href="/treatments">Treatments</Link>
            <a href="#laser">The laser</a>
            <a href="#visit">First visit</a>
            <a href="#clinic">The clinic</a>
            <a href="#telehealth">Telehealth</a>
          </nav>
          <Link className="btn btn-primary btn-sm" href="/contact">Request a consultation</Link>
        </div>
      </header>

      <main id="top">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        {/* Oct 26 2026 (Javier: "more style like faithtexting.com with gradient images that blend"): the photo sits behind
            the whole hero and washes to white under the copy; a soft fade carries it into the next section. */}
        <section className="chero blend">
          <div className="wrap">
            <span className="kicker">Laser clinic · {CLINIC.city} · {CLINIC.status}</span>
            <h1>Laser care, practiced like medicine.</h1>
            <p className="sub">Hair removal, sun spots, veins and skin on the {CLINIC.device}. Every plan starts with an exam by a nurse practitioner.</p>
            <div className="acts">
              <Link className="btn btn-primary" href="/contact">Request a consultation</Link>
              <Link className="more" href="/treatments">See every treatment</Link>
            </div>
            <ul className="trust">
              <li>Exam before every first treatment</li>
              <li>Every skin type, I to VI</li>
              <li>Written plan and price up front</li>
            </ul>
          </div>
          <span className="bgcap">Stock · the treatment room</span>
        </section>

        {/* ── TREATMENTS — editorial numbered rows ─────────────────────── */}
        <section id="treatments">
          <div className="wrap">
            <div className="headline2">
              <span className="kicker">Five treatments, one laser</span>
              <h2>What we treat.</h2>
            </div>
            <ol className="txlist">
              {TREATMENTS.map((t, i) => (
                <li key={t.slug}>
                  <Link href={`/treatments#${t.slug}`} className="tx">
                    <span className="n mono">{String(i + 1).padStart(2, "0")}</span>
                    <span className="nm"><b>{t.name}</b><em>{t.short}</em></span>
                    <span className="meta mono">{t.sessions}</span>
                    <span className="pr mono">from {t.from}<small>{t.unit}</small></span>
                    <span className="go" aria-hidden="true">›</span>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="note">Prices are per session and confirmed in writing at your consultation, with the total for the full course.</p>
          </div>
        </section>

        {/* ── THE LASER — skin-type row + specs ────────────────────────── */}
        <section id="laser" className="grey">
          <div className="wrap">
            <div className="laser">
              <div>
                <span className="kicker">The laser</span>
                <h2 style={{ marginTop: 15 }}>One platform. Two wavelengths. Chosen for your skin.</h2>
                <p className="sub" style={{ marginTop: 18 }}>Most clinics own one laser and treat everyone with it. Ours carries two, because the wavelength that is right for fair skin is the wrong one for deep skin.</p>
              </div>
              <Ph label="GentleMax Pro Plus" ratio="4/5" src="/labo/clinic-laser.jpg" alt="Laser hair removal on a leg, the handpiece held against the skin" />
            </div>

            <div className="skinrow" aria-label="Wavelength by skin type">
              <div className="skhead"><h4>Which wavelength, for which skin</h4><span className="kicker">Fitzpatrick scale</span></div>
              <div className="sk">
                {SKIN.map((c, i) => (
                  <div className="cell" key={c}>
                    <i style={{ background: c }} />
                    <span className="mono">{["I", "II", "III", "IV", "V", "VI"][i]}</span>
                  </div>
                ))}
              </div>
              <div className="bands">
                <div className="band755"><span className="mono">755 nm Alexandrite</span><small>lighter skin · fine hair · pigment</small></div>
                <div className="band1064"><span className="mono">1064 nm Nd:YAG</span><small>every skin type · deeper tones · veins · nails</small></div>
              </div>
            </div>

            <ul className="defs specs">
              {LASER_SPECS.map((s) => (
                <li key={s.k}><span className="dt">{s.k}</span><span className="dd">{s.v}</span></li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FIRST VISIT ──────────────────────────────────────────────── */}
        <section id="visit">
          <div className="wrap">
            <div className="headline2">
              <span className="kicker">Your first visit</span>
              <h2>Nothing is treated before you are examined.</h2>
            </div>
            <div>
              {FIRST_VISIT.map((s) => (
                <div className="hlrow" key={s.n}>
                  <span className="n">{s.n}</span>
                  <div><h3>{s.h}</h3><span className="meta">{s.meta}</span></div>
                  <div className="bd"><p>{s.p}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLINICIAN ────────────────────────────────────────────────── */}
        <section className="grey">
          <div className="wrap clin">
            <Ph label="Monika, in the clinic" ratio="4/5" className="portrait" src="/labo/clinic-clinician.jpg" alt="A clinician talking a patient through her plan in a bright treatment room" />
            <div>
              <span className="kicker">Your clinician</span>
              <blockquote>A laser is a medical device. It should be used like one.</blockquote>
              <p className="sub">Treatment settings, protocols and every plan are set by a nurse practitioner who examines you first and follows your skin through the whole course.</p>
              <ul className="creds">
                <li><b>Clinician</b><span>{PRACTICE.provider}</span></li>
                <li><b>Licensure</b><span>Nurse practitioner, Washington and California</span></li>
                <li><b>Platform</b><span>{CLINIC.device}</span></li>
                <li><b>Approach</b><span>Exam first, test spot, written plan, adjust every visit</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── THE CLINIC ───────────────────────────────────────────────── */}
        <section id="clinic" className="cblend">
          <div className="wrap">
            <div className="visit2">
              <div>
                <span className="kicker">The clinic</span>
                <h2 style={{ marginTop: 15 }}>{CLINIC.city.split(",")[0]}. {CLINIC.status}.</h2>
                <ul className="defs" style={{ marginTop: 26 }}>
                  <li><span className="dt">Where</span><span className="dd">{CLINIC.address ?? <>{CLINIC.city}<br /><span style={{ color: "var(--muted)" }}>Address announced soon</span></>}</span></li>
                  <li><span className="dt">Hours</span><span className="dd">{CLINIC.hoursNote}</span></li>
                  <li><span className="dt">Contact</span><span className="dd"><a href={`mailto:${PRACTICE.email}`}>{PRACTICE.email}</a></span></li>
                </ul>
                <div className="acts" style={{ justifyContent: "flex-start", marginTop: 26 }}>
                  <Link className="btn btn-primary" href="/contact">Join the opening list</Link>
                </div>
              </div>
            </div>
          </div>
          <span className="bgcap">Stock · the clinic, Seattle</span>
        </section>

        {/* ── TELEHEALTH — the practice's second line, gate kept ───────── */}
        <section id="telehealth" className="grey">
          <div className="wrap">
            <div className="headline2">
              <span className="kicker">Also from {PRACTICE.name} · by video</span>
              <h2>Hormone and metabolic care, for California and Washington.</h2>
              <p className="sub" style={{ marginTop: 17, maxWidth: "52ch" }}>The same clinician, the same standard: a full lab panel before anything is prescribed.</p>
            </div>
            <div className="tele">
              {TELE.map((t) => (
                <Link className="trow" key={t.slug} href={`/programs/${t.slug}`}>
                  <b>{t.name}</b><span>{t.note}</span><i aria-hidden="true">›</i>
                </Link>
              ))}
            </div>
            <Gate />
            <p className="note" style={{ textAlign: "center" }}>Already a patient? <a className="more" href={HEALTHIE.login} {...ext}>Patient login</a></p>
          </div>
        </section>

        {/* ── CLOSE ────────────────────────────────────────────────────── */}
        <section className="close lblend">
          <div className="wrap">
            <h2>Start with a consultation.</h2>
            <p className="sub" style={{ margin: "20px auto 0", maxWidth: "44ch" }}>Thirty minutes, an exam, a test spot and a written plan with the full price. No pressure to book the course.</p>
            <div className="acts">
              <Link className="btn btn-primary" href="/contact">Request a consultation</Link>
              <Link className="btn btn-ghost" href="/treatments">See treatments</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
