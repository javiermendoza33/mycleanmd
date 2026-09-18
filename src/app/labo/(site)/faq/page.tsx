import { Eyebrow } from "@/components/labo/Sections";
import Faq from "@/components/labo/Faq";
import { FAQ, HEALTHIE } from "@/labo/content";

export const metadata = {
  title: "FAQ",
  description: "Licensure, insurance, using labs you already have, how fast you can start, who prescribes, and how to cancel.",
  alternates: { canonical: "/faq" },
};

/** FAQPage structured data — these are the questions people search. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <section className="wrap wrap-narrow" style={{ paddingBlock: "88px 88px" }}>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Eyebrow>Frequently asked</Eyebrow>
      <h1 className="h1" style={{ marginTop: 24, marginBottom: 40, fontSize: "clamp(34px,4.8vw,58px)" }}>
        Before you start
      </h1>
      <Faq />
      <div className="inset" style={{ gridTemplateColumns: "1fr auto", alignItems: "center", gap: 30 }}>
        <div>
          <h2 className="h2-sub" style={{ fontSize: 28 }}>Still unsure whether this fits?</h2>
          <p className="body-sm" style={{ margin: "12px 0 0" }}>
            Book a consult and ask. There is no obligation to start a program.
          </p>
        </div>
        <a className="btn btn-pine" href={HEALTHIE.book} target="_blank" rel="noopener noreferrer">
          Book a consult
        </a>
      </div>
    </section>
  );
}
