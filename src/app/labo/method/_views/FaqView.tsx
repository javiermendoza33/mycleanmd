import { PageHero } from "@/components/labo/Sections";
import Faq from "@/components/labo/Faq";
import { HEALTHIE } from "@/labo/content";
import { mc, lh, type Lang } from "@/labo/method/i18n";

export default function FaqView({ lang }: { lang: Lang }) {
  const c = mc(lang), t = c.t;
  /** FAQPage structured data — these are the questions people search. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(lang === "es" ? { inLanguage: "es" } : {}),
    mainEntity: c.FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow={t.faq.eyebrow} title={t.faq.title} />
      <section>
        <div className="wrap tight">
          <Faq items={c.FAQ} />
          <div className="tile" style={{ marginTop: 56 }}>
            <h3>{t.faq.unsureH}</h3>
            <p>{t.faq.unsureP}</p>
            <div>
              <a className="btn btn-ghost" href={lh(lang, HEALTHIE.book)}>
                {t.bookConsult(c.EXTRA_PRICING[0].price)}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
