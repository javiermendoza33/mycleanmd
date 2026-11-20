import Link from "next/link";
import { PageHero, Eyebrow, ClosingCTA } from "@/components/labo/Sections";
import { PROGRAMS, AVAILABILITY, METHOD, PRACTICE } from "@/labo/content";
import Gate from "./Gate";

export default function MethodHome() {
  return (
    <>
      <PageHero
        eyebrow="Telehealth"
        title={<>Hormone, weight and peptide care — <em>by video</em>.</>}
        lede={`${METHOD.name} is the telehealth side of the practice: real labs first, a real dose plan, and a clinician actually watching. Licensed for residents of ${AVAILABILITY}.`}
      />

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
