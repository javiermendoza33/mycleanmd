import { Eyebrow } from "@/components/labo/Sections";
import { LEGAL } from "@/labo/content";

export const metadata = {
  title: "Disclaimers & notices",
  description: "Scope of licensure, telehealth consent, compounded medications, controlled substances and privacy notices for The Labo Method.",
  alternates: { canonical: "/legal" },
  robots: { index: true, follow: true },
};

export default function Legal() {
  return (
    <section className="wrap wrap-legal" style={{ paddingBlock: "88px 60px" }}>
      <Eyebrow>Legal</Eyebrow>
      <h1 className="h1-sm" style={{ marginTop: 24, fontSize: "clamp(32px,4.2vw,52px)" }}>
        Disclaimers &amp; notices
      </h1>
      <div style={{ marginTop: 36 }}>
        {LEGAL.map((s) => (
          <div key={s.title} className="lg-row">
            <h2 className="lg-t">{s.title}</h2>
            <p className="lg-b">{s.body}</p>
          </div>
        ))}
        <div className="rule" />
      </div>
    </section>
  );
}
