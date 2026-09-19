import { PageHero } from "@/components/labo/Sections";
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
    <>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="Frequently asked" title="Before you start" />
      <section>
        <div className="wrap tight">
          <Faq />
          <div className="tile" style={{ marginTop: 56 }}>
            <h3>Still unsure whether this fits?</h3>
            <p>Book a consult and ask. There is no obligation to start a program.</p>
            <div>
              <a className="btn btn-ghost" href={HEALTHIE.book} target="_blank" rel="noopener noreferrer">
                Book a $149 consult
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
