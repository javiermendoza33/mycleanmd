import { ClosingCTA, Eyebrow, PageHero } from "@/components/labo/Sections";
import { HOW_LONG, INCLUDED } from "@/labo/content";

export const metadata = {
  title: "How it works",
  description: "Intake, labs, a video visit, then treatment. Four steps, and none of them are a questionnaire that prescribes itself.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorks() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Four steps, and none of them are a questionnaire that prescribes itself."
        lede="Every program follows the same path. What changes is the panel we order and the protocol we build from it."
      />

      <section>
        <div className="wrap">
          {HOW_LONG.map((s) => (
            <div key={s.n} className="hlrow">
              <span className="n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <span className="meta">{s.meta}</span>
              </div>
              <div className="bd">
                <p>{s.body}</p>
                <p>{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grey">
        <div className="wrap">
          <div className="tight">
            <Eyebrow>What you get</Eyebrow>
            <h2 style={{ marginTop: 15 }}>Included in every program.</h2>
          </div>
          <div className="inclgrid" style={{ marginTop: 38 }}>
            {INCLUDED.map((i) => <div key={i}>{i}</div>)}
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
