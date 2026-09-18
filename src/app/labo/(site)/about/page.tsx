import { ClosingCTA, Eyebrow } from "@/components/labo/Sections";
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

      <section className="wrap" style={{ paddingBlock: "88px 76px" }}>
        <div className="ab-hero">
          <div className="ab-sticky"><Carousel /></div>
          <div>
            <Eyebrow>About the provider</Eyebrow>
            <h1 className="h1-sm" style={{ marginTop: 24 }}>{PRACTICE.provider}</h1>
            <p className="lead" style={{ marginTop: 22 }}>{ABOUT.lede}</p>
            <div className="rule" style={{ margin: "34px 0" }} />
            <div className="ab-bio">
              {ABOUT.bio.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="cred">
              {ABOUT.credentials.map((c) => (
                <div key={c.label}>
                  <span className="micro">{c.label}</span>
                  <p className="cred-v">{c.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingBlock: 80, borderTop: "1px solid var(--rule)" }}>
        <h2 className="h2-sub">Practice history</h2>
        <div style={{ marginTop: 30 }}>
          {ABOUT.history.map((h) => (
            <div key={h.dates + h.org} className="hist-row">
              <span className="hist-d">{h.dates}</span>
              <div>
                <span className="hist-r">{h.role}</span>
                <span className="hist-o">{h.org}</span>
              </div>
              <p className="hist-x" style={{ margin: 0 }}>{h.desc}</p>
            </div>
          ))}
          <div className="rule" />
        </div>
      </section>

      <section className="band-raised">
        <div className="wrap" style={{ paddingBlock: 80 }}>
          <h2 className="h2-sub">How I practice</h2>
          <div className="steps" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 48, marginTop: 34 }}>
            {ABOUT.practice.map((p) => (
              <div key={p.title} className="step">
                <h3 className="h3-sm" style={{ fontSize: 24, marginTop: 0 }}>{p.title}</h3>
                <p style={{ fontSize: 15, marginTop: 12 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
