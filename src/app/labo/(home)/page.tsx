import Link from "next/link";
import { Footer } from "@/components/labo/Chrome";
import { BookCta, LocationCard, PartnerLogos, SectionHead, ServiceCard, TestimonialCard } from "@/components/labo/Clinic";
import { CLINIC, LASER_SPECS, NAV, PRACTICE, PROGRAMS, METHOD } from "@/labo/content";
import { services } from "@/labo/clinic/services";
import { testimonials } from "@/labo/clinic/testimonials";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { alastinLine, SHOP } from "@/labo/clinic/products";
import QuizTabs from "@/components/labo/shop/QuizTabs";
import MobileNav from "@/components/labo/MobileNav";
import BagLink from "@/components/labo/shop/BagLink";
import SearchButton from "@/components/labo/search/SearchButton";
import { ProductCard } from "@/components/labo/shop/ProductCard";

/**
 * thelabomethod.com homepage — the clinic storefront (Nov 19 2026).
 *
 * Javier: "Monika wanted a look and feel like facileskin.com… she wants to sell products as well. can we do
 * something now a bit different". The facile pattern: a promo bar, a split hero (type on the signature colour, a
 * portrait in a box — the swimmer video came out Nov 19), a value ticker, a boxed best-sellers row with full-width Add-to-bag bars, the services as a
 * hairline grid, shop-by-concern tiles, then Mónika, reviews, the location, the laser line, partners, telehealth
 * and the booking band. Content and photos are the clinic's own (Nov 18); the shop catalog is labo/clinic/products.ts.
 */
const TELE = [
  { slug: PROGRAMS[0].slug, name: "GLP-1 weight management", note: "Semaglutide or tirzepatide, dosed against your metabolic panel." },
  { slug: PROGRAMS[1].slug, name: "Peptide therapy", note: "Recovery and repair protocols, cycled and re-tested." },
  { slug: PROGRAMS[2].slug, name: "Testosterone for men", note: "A full endocrine work-up first, treatment only where indicated." },
  { slug: PROGRAMS[3].slug, name: "Hormone therapy for women", note: "Perimenopause and menopause care that takes symptoms seriously." },
];

/** Fitzpatrick I–VI and which wavelength reaches them safely — the laser section's signature row. */
const SKIN = ["#F6E3D4", "#EDCDB3", "#D9AE8A", "#B98463", "#8A5A3E", "#5A3826"];

const STRIP = ["Nurse practitioner-led", "Medical-Grade skincare", "Botox® · Dysport®", "Dermal Fillers", "Candela GentleMax Pro Plus Laser", "Where South Lake Union meets Eastlake, Seattle", SHOP.promo, "Free skincare shipping over $" + SHOP.freeShippingOver];

const CONCERN_TILES = [
  { c: "Acne", t: "Breakouts & congestion" },
  { c: "Aging", t: "Lines, firmness & glow" },
  { c: "Dryness", t: "Barrier & hydration" },
  { c: "Sensitive", t: "Redness & reactivity" },
  { c: "Pigment", t: "Dark spots & tone" },
];

export default function LaboHome() {
  const s = CLINIC_SITE;
  return (
    <>
      <div className="promo"><div className="wrap"><span>{SHOP.promo}</span></div></div>
      <header className="site">
        <div className="wrap bar">
          <a className="brand" href="#top" style={{ marginRight: 0 }}>{PRACTICE.name}</a>
          <a className="more" href={`https://${METHOD.domain}`}
             style={{ fontFamily: "var(--font-clinic)", fontWeight: 800, letterSpacing: "-.02em", fontSize: "1.05rem", color: METHOD.accent, textDecorationColor: METHOD.accent, marginRight: "auto" }}>Telehealth</a>
          <nav className="main" aria-label="Sections">
            {NAV.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          </nav>
          <SearchButton />
          <BagLink />
          <Link className="btn btn-primary btn-sm" href="/booking">Book now</Link>
          <MobileNav />
        </div>
      </header>

      <main id="top">
        {/* ── HERO — type on paper, the clinic's video in a box ─────────── */}
        <section className="fhero">
          <div className="fgrid">
            <div className="ftext">
              <span className="kicker">Medical spa · Seattle, Where South Lake Union meets Eastlake</span>
              <h1>Skin that looks like <em>you</em>, on your best day.</h1>
              <p className="sub">A nurse practitioner&ndash;founded aesthetic clinic offering modern, evidence-based injectables, lasers, chemical peels, and medical-grade skincare&mdash;tailored to your skin, your lifestyle, and the results you actually want.</p>
              <div className="acts">
                <Link className="btn btn-primary" href="/booking">Book a visit</Link>
                <Link className="btn btn-ghost" href="/shop">Shop skincare</Link>
              </div>
            </div>
            <div className="fmedia">
              {/* Nov 19 2026 (Javier: "take the highest resolution picture we have that fits and put instead of the video"):
                  the 1877×2560 portrait from the clinic's own photo set — the sharpest file that fills the tall box. */}
              <img className="still" src="/labo/img/about/team.jpg" alt="Woman with glowing, even skin, hand resting at her shoulder" fetchPriority="high" />
            </div>
          </div>
        </section>

        {/* ── VALUE STRIP ───────────────────────────────────────────────── */}
        <div className="strip" aria-hidden="true"><div className="track">{[...STRIP, ...STRIP].map((x, i) => <span key={i}>{x}</span>)}</div></div>

        {/* ── SKIN QUIZ (Nov 21 2026 — replaced the Best sellers row, Javier: "i like this idea of take our quiz") ── */}
        <section id="shop">
          <div className="wrap">
            <div className="rowhead"><div><span className="kicker">Find your routine</span><h2 style={{ marginTop: 8 }}>Not sure where to start? Take the skin quiz</h2></div><Link className="more" href="/shop">Shop all</Link></div>
            <QuizTabs />
          </div>
        </section>

        {/* ── OUR OWN LINE (Nov 20 2026) ───────────────────────────────── */}
        <section className="grey" style={{ paddingBlock: 64 }}>
          <div className="wrap">
            <div className="rowhead"><div><span className="kicker">Authorized partner · Anti-aging &amp; serums</span><h2 style={{ marginTop: 8 }}>ALASTIN Skincare®</h2></div><Link className="more" href="/shop?line=ALASTIN%20Skincare%C2%AE">See the line</Link></div>
            <div className="pgrid">{alastinLine.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────────────── */}
        <section id="services">
          <div className="wrap">
            <SectionHead eyebrow="Injectables · Skincare · Laser · Wellness" title="Find the right service for you" lede="Every one of our clients is different, so every treatment is tailored to your skin type, lifestyle and the results you want." />
            <div className="cards">{services.map((x) => <ServiceCard key={x.slug} service={x} />)}</div>
          </div>
        </section>

        {/* ── SHOP BY CONCERN ──────────────────────────────────────────── */}
        <section className="grey" style={{ paddingBlock: 64 }}>
          <div className="wrap">
            <div className="rowhead"><h2>Shop by concern</h2><Link className="more" href="/shop">The shop</Link></div>
            <div className="ctiles">{CONCERN_TILES.map((x) => <Link key={x.c} href={`/shop?c=${x.c}`}><b>{x.c}</b><span>{x.t}</span></Link>)}</div>
          </div>
        </section>

        {/* ── ABOUT — Mónika's welcome ─────────────────────────────────── */}
        <section>
          <div className="wrap split narrow">
            <div>
              <div className="frame"><img src="/labo/img/about/founder.webp" alt="Mónika Jáuregui, founder of The Labo Clinic" loading="lazy" /></div>
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
        <section id="testimonials" className="grey">
          <div className="wrap">
            <SectionHead eyebrow="What they're saying" title="Kind words from happy, refreshed patients" />
            <div className="quotes">{testimonials.map((t) => <TestimonialCard key={t.author} t={t} />)}</div>
            <p className="centre"><Link className="more" href="/testimonials">Read all testimonials</Link></p>
          </div>
        </section>

        {/* ── LOCATIONS ────────────────────────────────────────────────── */}
        <section id="locations">
          <div className="wrap">
            <SectionHead eyebrow="Come see us IRL" title="Visit us where South Lake Union meets Eastlake" lede={`By appointment only, seven days a week, for now. Text or call ${s.phoneDisplay}.`} />
            <div className="locs">{s.locations.map((loc) => <LocationCard key={loc.id} location={loc} />)}</div>
          </div>
        </section>

        {/* ── THE LASER — the clinic's new line ────────────────────────── */}
        <section id="laser" className="grey">
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
            <div className="skinrow" aria-label="Wavelength by skin type" style={{ background: "var(--paper)" }}>
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
            <ul className="defs specs" style={{ background: "var(--paper)" }}>
              {LASER_SPECS.map((x) => <li key={x.k}><span className="dt">{x.k}</span><span className="dd">{x.v}</span></li>)}
            </ul>
          </div>
        </section>

        {/* ── PARTNERS ─────────────────────────────────────────────────── */}
        <section style={{ paddingBlock: 70 }}>
          <div className="wrap">
            <SectionHead eyebrow="Our partners" title="Trusted brands, real results" />
            <PartnerLogos />
          </div>
        </section>

        {/* ── TELEHEALTH — Nov 19 2026: split into its own brand, "The Labo
             Method" (Javier: "a differnt model for Telehealth... Called The
             Labo Method"). This is now just a teaser; the actual programs,
             pricing and the eligibility gate live at method.thelabomethod.com. */}
        <section id="telehealth" className="grey">
          <div className="wrap">
            <div className="headline2">
              <span className="kicker">{METHOD.name} · by video</span>
              <h2>Hormone and metabolic care, by telehealth.</h2>
              <p className="sub" style={{ marginTop: 17, maxWidth: "52ch" }}>The same clinician, the same standard: a full lab panel before anything is prescribed. {METHOD.name} is the telehealth side of the practice.</p>
            </div>
            <div className="tele" style={{ background: "var(--paper)" }}>
              {TELE.map((t) => (
                <a className="trow" key={t.slug} href={`https://${METHOD.domain}/programs/${t.slug}`}><b>{t.name}</b><span>{t.note}</span><i aria-hidden="true">›</i></a>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 30 }}>
              <a className="btn btn-primary" href={`https://${METHOD.domain}`}>Visit {METHOD.name} ↗</a>
            </div>
          </div>
        </section>

        <BookCta />
      </main>

      <Footer />
    </>
  );
}
