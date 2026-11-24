import { PageHero } from "@/components/labo/Sections";
import { METHOD } from "@/labo/content";
import { methodPrivacySections, methodPrivacyUpdated } from "@/labo/method/privacy";

export const metadata = {
  title: "Privacy policy",
  description: `How ${METHOD.name} collects, uses and protects your information on the website, in your account and around your care.`,
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: true },   // carriers and 10DLC reviewers open this from the SMS form — keep it indexable even pre-launch
};

export default function MethodPrivacyPolicy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" lede={`Last updated ${methodPrivacyUpdated}.`} />
      <section style={{ paddingTop: 24 }}>
        <div className="wrap legalpage rich">
          {methodPrivacySections.map((s, i) => (
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
