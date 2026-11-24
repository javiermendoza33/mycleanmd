import { PageHero } from "@/components/labo/Sections";
import { METHOD } from "@/labo/content";
import { methodTermsSections, methodTermsUpdated } from "@/labo/method/terms";

export const metadata = {
  title: "Terms of use",
  description: `The terms for using ${METHOD.domain}, your account and ${METHOD.name}'s programs: eligibility, billing, cancellation, text messages and acceptable use.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function MethodTerms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of use" lede={`Last updated ${methodTermsUpdated}. Clinical disclaimers, telehealth consent and medication notices are at /legal.`} />
      <section style={{ paddingTop: 24 }}>
        <div className="wrap legalpage rich">
          {methodTermsSections.map((s, i) => (
            <div key={i}>
              {s.heading && <h2>{s.heading}</h2>}
              {s.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
              {s.list && s.list.length > 0 && <ul style={{ marginTop: 12 }}>{s.list.map((it, j) => <li key={j}>{it}</li>)}</ul>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
