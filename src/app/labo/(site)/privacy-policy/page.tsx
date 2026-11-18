import { privacySections, privacyUpdated } from "@/labo/clinic/privacy";
import { PageHero } from "@/components/labo/Sections";

export const metadata = {
  title: "Privacy policy",
  description: "Privacy policy for The Labo Method.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" lede={privacyUpdated ? `Last updated ${privacyUpdated}.` : undefined} />
      <section style={{ paddingTop: 40 }}>
        <div className="wrap legalpage rich">
          {privacySections.map((s, i) => (
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
