import Link from "next/link";
import Faq from "@/components/labo/Faq";
import { CLINIC, GROUP_NOTE, GROUPS, LASER_FAQ, TREATMENTS } from "@/labo/content";

const GROUP_KEYS = ["laser", "injectables", "skin"] as const;

export const metadata = {
  title: "Treatments · laser, Botox, fillers, Sculptra, microneedling · Seattle",
  description: `Laser hair removal, sun spots, spider veins, skin rejuvenation and nail treatment on the ${CLINIC.device}, plus Botox, dermal fillers, Sculptra and microneedling in Seattle. Every plan starts with an exam by a nurse practitioner.`,
  alternates: { canonical: "/treatments" },
};

/** FAQPage structured data for the laser questions. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: LASER_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

/**
 * /treatments (Oct 26 2026) — one editorial section per laser service, anchored
 * by slug so the homepage rows deep-link here. Prices are placeholders until
 * Monika confirms them (content.ts blocking item #5).
 */
export default function TreatmentsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pageh">
        <div className="wrap">
          <span className="kicker">Laser &amp; aesthetics · {CLINIC.city}</span>
          <h1>Treatments.</h1>
          <p className="sub">Laser on the {CLINIC.device}, injectables and skin treatments. Each begins with a consultation and an exam.</p>
          {GROUP_KEYS.map((g) => (
            <nav className="txjump" aria-label={GROUPS[g]} key={g}>
              <span className="mono">{GROUPS[g]}</span>
              {TREATMENTS.filter((t) => t.group === g).map((t) => <a key={t.slug} href={`#${t.slug}`}>{t.name}</a>)}
            </nav>
          ))}
        </div>
      </section>

      <section style={{ paddingTop: 40 }}>
        <div className="wrap">
          {GROUP_KEYS.map((g) => (
            <div key={g} id={`group-${g}`} className="txgsec">
              <div className="txghead"><h3>{GROUPS[g]}</h3><span className="mono">{GROUP_NOTE[g]}</span></div>
          {TREATMENTS.filter((t) => t.group === g).map((t) => (
            <article className="txsec" id={t.slug} key={t.slug}>
              <div>
                <span className="kicker">{String(TREATMENTS.indexOf(t) + 1).padStart(2, "0")} · {t.skin}</span>
                <h2 style={{ marginTop: 14 }}>{t.name}</h2>
                <ul className="chips" style={{ marginTop: 18 }}>{t.treats.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="bd">
                {t.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
                <ul className="defs" style={{ marginTop: 24 }}>
                  <li><span className="dt">{t.techLabel ?? "Wavelength"}</span><span className="dd">{t.wavelength}</span></li>
                  <li><span className="dt">Course</span><span className="dd">{t.sessions}</span></li>
                  <li><span className="dt">From</span><span className="dd mono">{t.from}<span style={{ color: "var(--muted)" }}>{t.unit}</span></span></li>
                </ul>
              </div>
            </article>
          ))}
            </div>
          ))}
          <p className="note">Starting prices; per unit, syringe, vial or session as shown. Prices are per session and confirmed in writing at your consultation, with the total for the full course.</p>
        </div>
      </section>

      <section className="grey">
        <div className="wrap tight">
          <span className="kicker">Questions</span>
          <h2 style={{ marginTop: 15, marginBottom: 30 }}>Before your first visit.</h2>
          <Faq items={LASER_FAQ} />
          <div className="tile" style={{ marginTop: 48, background: "var(--paper)" }}>
            <h3>Not sure which treatment fits?</h3>
            <p>Book a consultation. You leave with an exam, a test spot and a written plan — no obligation to start.</p>
            <div><Link className="btn btn-primary" href="/contact">Request a consultation</Link></div>
          </div>
        </div>
      </section>
    </>
  );
}
