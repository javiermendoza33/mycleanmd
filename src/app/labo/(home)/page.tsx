import Link from "next/link";
import Gate from "./Gate";
import { Footer } from "@/components/labo/Chrome";
import HeroVideo from "@/components/labo/HeroVideo";
import { BookCta, LocationCard, PartnerLogos, SectionHead, ServiceCard, TestimonialCard } from "@/components/labo/Clinic";
import { CLINIC, HEALTHIE, LASER_SPECS, NAV, PRACTICE, PROGRAMS } from "@/labo/content";
import { services } from "@/labo/clinic/services";
import { testimonials } from "@/labo/clinic/testimonials";
import { CLINIC_SITE } from "@/labo/clinic/site";

/**
 * thelabomethod.com homepage — the clinic site, Nov 18 2026.
 *
 * Javier: "make TLM like the site was with same content and photos" — the
 * Skin Haven Cosmetic Clinic homepage (video hero, the services grid, Mónika's
 * welcome, testimonials, the two locations, the partner strip, the phone-first
 * booking band) rebuilt on the emerald/gold system, with the clinic's two lines
 * that the old site did not have — the Candela laser and the telehealth
 * programs — kept as sections lower down. Content and photos come from the
 * old site verbatim (content/wp in the skinhaven repo); only the brand changed.
 */
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const TELE = [
  { slug: PROGRAMS[0].slug, name: "GLP-1 weight management", note: "Semaglutide or tirzepatide, dosed against your metabolic panel." },
  { slug: PROGRAMS[1].slug, name: "Peptide therapy", note: "Recovery and repair protocols, cycled and re-tested." },
  { slug: PROGRAMS[2].slug, name: "Testosterone for men", note: "A full endocrine work-up first, treatment only where indicated." },
  { slug: PROGRAMS[3].slug, name: "Hormone therapy for women", note: "Perimenopause and menopause care that takes symptoms seriously." },
];

/** Fitzpatrick I–VI and which wavelength reaches them safely — the laser section's signature row. */
const SKIN = ["#F6E3D4", "#EDCDB3", "#D9AE8A", "#B98463", "#8A5A3E", "#5A3826"];

export default function LaboHome() {
  const s = CLINIC_SITE;
  return (
    <>
      <header className="site">
        <div className="wrap bar">
          <a className="brand" href="#top">{PRACTICE.name}</a>
          <nav className="main" aria-label="Sections">
            {NAV.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          </nav>
          <Link className="btn btn-primary btn-sm" href="/booking">Book now</Link>
        </div>
      </header>

      <main id="top">
        {/* ── HERO — the old site's looping clinic video under the emerald wash ── */}
        <section className="vhero">
          <img className="poster" src="/labo/img/hero-poster.jpg" alt="" aria-hidden="true" />
          <HeroVideo />
          <div className="wrap">
            <span className="kicker">Medical spa · Seattle &amp; Ruston, Washington</span>
            <h1>Your skincare &amp; wellness <em>haven</em> in Washington</h1>
            <p className="sub">Achieve your short- and long-term skincare and wellness goals with modern, science-based treatments, from Botox® and Dysport® to fillers, chemical peels, laser, IV/IM therapy and more. Optimal skin health and wellness is a journey, and we&rsquo;re ready to be your guide (and beauty besties)!</p>
            <div className="acts">
              <Link className="btn btn-primary" href="/booking">Book now</Link>
              <Link className="more" href="/services">Explore all services</Link>
            </div>
            <p className="led">Led by <Link href="/about">Mónika Jáuregui, DNP, CANS, FNP-C</Link>, Certified Aesthetic Nurse Specialist</p>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────────────── */}
        <section id="services">
          <div className="wrap">
            <SectionHead eyebrow="Injectables · Skincare · Laser · Wellness" title="Find the right service for you" lede="Because every one of our clients is different and requires a customized approach, we tailor every treatment to your skin type, lifestyle and desired results." />
            <div className="cards">{services.map((x) => <ServiceCard key={x.slug} service={x} />)}</div>
          </div>
        </section>

        {/* ── ABOUT — Mónika's welcome ─────────────────────────────────── */}
        <section className="grey">
          <div className="wrap split narrow">
            <div>
              <div className="frame"><img src="/labo/img/about/founder.webp" alt="Mónika Jáuregui, founder of The Labo Method" loading="lazy" /></div>
            </div>
            <div className="prose">
              <span className="kicker">Meet your new guide &amp; beauty bestie</span>
              <h2 style={{ marginTop: 15 }}>¡Hola! Mónika Jáuregui here.</h2>
              <p style={{ marginTop: 22 }}>We&rsquo;re a woman- and minority-owned and operated clinic offering effective, evidence-based aesthetic treatments to help you achieve excellent skin health and overall better wellness. With our medically innovative services that deliver actual results, you&rsquo;ll find greater confidence and feel more empowered to take on the day.</p>
              <p>At {PRACTICE.name}, we prioritize helping you look like you on your best day. Our cosmetic clinic is dedicated to attainable beauty, focused on what&rsquo;s already beautiful about you.</p>
              <div className="acts">
                <Link className="btn btn-primary" href="/about">Our story</Link>
                <img className="sig" src="/labo/img/about/signature.png" alt="Mónika Jáuregui's signature" style={{ marginTop: 0 }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        <section id="testimonials">
          <div className="wrap">
            <SectionHead eyebrow="Testimonials" title="Kind words from happy, refreshed patients" />
            <div className="quotes">{testimonials.map((t) => <TestimonialCard key={t.author} t={t} />)}</div>
            <p className="centre"><Link className="more" href="/testimonials">Read all testimonials</Link></p>
          </div>
        </section>

        {/* ── LOCATIONS ────────────────────────────────────────────────── */}
        <section id="locations" className="grey">
          <div className="wrap">
            <SectionHead eyebrow="Two Washington locations" title="Visit us in South Lake Union or Ruston" lede={`Open Monday through Friday, 10:00 am – 6:00 pm. Weekends by appointment only. Text or call ${s.phoneDisplay}.`} />
            <div className="locs">{s.locations.map((loc) => <LocationCard key={loc.id} location={loc} />)}</div>
          </div>
        </section>

        {/* ── THE LASER — the clinic's new line ────────────────────────── */}
        <section id="laser">
          <div className="wrap">
            <div className="laser">
              <div>
                <span className="kicker">The laser · {CLINIC.device}</span>
                <h2 style={{ marginTop: 15 }}>One platform. Two wavelengths. Chosen for your skin.</h2>
                <p className="sub" style={{ marginTop: 18 }}>Most clinics own one laser and treat everyone with it. Ours carries two, because the wavelength that is right for fair skin is the wrong one for deep skin.</p>
                <div className="acts" style={{ display: "flex", gap: 18, marginTop: 26, flexWrap: "wrap" }}>
                  <Link className="btn btn-primary" href="/treatments">See laser treatments</Link>
                </div>
              </div>
              <div className="frame" style={{ aspectRatio: "4/5" }}><img src="/labo/img/services/lasers.jpg" alt="Woman with smooth, glowing skin after a laser skin treatment" loading="lazy" /></div>
            </div>
            <div className="skinrow" aria-label="Wavelength by skin type" style={{ background: "var(--canvas)" }}>
              <div className="skhead"><h4>Which wavelength, for which skin</h4><span className="kicker">Fitzpatrick scale</span></div>
              <div className="sk">
                {SKIN.map((c, i) => (
                  <div className="cell" key={c}><i style={{ background: c }} /><span className="mono">{["I", "II", "III", "IV", "V", "VI"][i]}</span></div>
                ))}
              </div>
              <div className="bands">
                <div className="band755"><span className="mono">755 nm Alexandrite</span><small>lighter skin · fine hair · pigment</small></div>
                <div className="band1064"><span className="mono">1064 nm Nd:YAG</span><small>every skin type · deeper tones · veins · nails</small></div>
              </div>
            </div>
            <ul className="defs specs" style={{ background: "var(--canvas)" }}>
              {LASER_SPECS.map((x) => <li key={x.k}><span className="dt">{x.k}</span><span className="dd">{x.v}</span></li>)}
            </ul>
          </div>
        </section>

        {/* ── PARTNERS ─────────────────────────────────────────────────── */}
        <section className="grey" style={{ paddingBlock: 80 }}>
          <div className="wrap">
            <SectionHead eyebrow="Our partners" title="Trusted brands, real results" />
            <PartnerLogos />
          </div>
        </section>

        {/* ── TELEHEALTH — the practice's second line, gate kept ───────── */}
        <section id="telehealth">
          <div className="wrap">
            <div className="headline2">
              <span className="kicker">Also from {PRACTICE.name} · by video</span>
              <h2>Hormone and metabolic care, by telehealth.</h2>
              <p className="sub" style={{ marginTop: 17, maxWidth: "52ch" }}>The same clinician, the same standard: a full lab panel before anything is prescribed.</p>
            </div>
            <div className="tele" style={{ background: "var(--canvas)" }}>
              {TELE.map((t) => (
                <Link className="trow" key={t.slug} href={`/programs/${t.slug}`}><b>{t.name}</b><span>{t.note}</span><i aria-hidden="true">›</i></Link>
              ))}
            </div>
            <Gate />
            <p className="note" style={{ textAlign: "center" }}>Already a patient? <a className="more" href={HEALTHIE.login} {...ext}>Patient login</a></p>
          </div>
        </section>

        <BookCta />
      </main>

      <Footer />
    </>
  );
}
