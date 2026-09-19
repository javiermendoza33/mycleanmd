import { ClosingCTA, Eyebrow, PageHero } from "@/components/labo/Sections";
import Carousel from "@/components/labo/Carousel";
import { ABOUT, PRACTICE } from "@/labo/content";

export const metadata = {
  title: "About the provider",
  description: "Monika Jauregui, DNP, NP-C — board-certified family nurse practitioner. Fifteen years in nursing, from the ICU to transplant medicine to telehealth.",
  alternates: { canonical: "/about" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PRACTICE.provider,
  jobTitle: "Family Nurse Practitioner",
  description: ABOUT.lede,
  worksFor: { "@type": "MedicalBusiness", name: PRACTICE.name },
  knowsLanguage: ["English", "Spanish"],
};

export default function About() {
  return (
    <>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero eyebrow="About the provider" title={PRACTICE.provider} lede={ABOUT.lede} />

      <section>
        <div className="wrap abgrid">
          <Carousel />
          <div>
            <div className="bio">
              {ABOUT.bio.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {/* the homepage's credential rows, with the full CV list */}
            <ul className="creds">
              {ABOUT.credentials.map((c) => (
                <li key={c.label}><b>{c.label}</b><span>{c.value}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grey">
        <div className="wrap">
          <div className="tight" style={{ marginBottom: 42 }}>
            <Eyebrow>The record</Eyebrow>
            <h2 style={{ marginTop: 15 }}>Practice history</h2>
          </div>
          <ul className="defs">
            {ABOUT.history.map((h) => (
              <li key={h.dates + h.org}>
                <span className="dt">{h.dates}</span>
                <p className="dd"><b>{h.role} — {h.org}</b>{h.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="tight" style={{ marginBottom: 46 }}>
            <Eyebrow>How I practice</Eyebrow>
            <h2 style={{ marginTop: 15 }}>Three commitments that decide what gets prescribed.</h2>
          </div>
          <div className="three">
            {ABOUT.practice.map((p) => (
              <div key={p.title}><h3>{p.title}</h3><p>{p.body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
