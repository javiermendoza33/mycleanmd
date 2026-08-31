import { ClosingCTA, Eyebrow } from "@/components/labo/Sections";
import { HOW_LONG, INCLUDED } from "@/labo/content";

export const metadata = {
  title: "How it works",
  description: "Intake, labs, a video visit, then treatment. Four steps, and none of them are a questionnaire that prescribes itself.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorks() {
  return (
    <>
      <header className="phead">
        <div className="wrap">
          <Eyebrow>How it works</Eyebrow>
          <h1 className="h1">Four steps, and none of them are a questionnaire that prescribes itself.</h1>
          <p className="lead">
            Every program follows the same path. What changes is the panel we order and the
            protocol we build from it.
          </p>
        </div>
      </header>

      <section className="wrap" style={{ paddingBottom: 20 }}>
        {HOW_LONG.map((s) => (
          <div key={s.n} className="how-row">
            <span className="how-n">{s.n}</span>
            <div>
              <h2 className="how-t">{s.title}</h2>
              <span className="how-meta">{s.meta}</span>
            </div>
            <div>
              <p className="body" style={{ margin: 0 }}>{s.body}</p>
              <p className="how-detail">{s.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="band-raised">
        <div className="wrap" style={{ paddingBlock: 80 }}>
          <div className="incl">
            <div>
              <Eyebrow>What you get</Eyebrow>
              <h2 className="h2-sub" style={{ marginTop: 20 }}>Included in every program</h2>
            </div>
            <div className="incl-grid">
              {INCLUDED.map((i) => <div key={i}>{i}</div>)}
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
