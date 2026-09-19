import { PageHero } from "@/components/labo/Sections";
import { LEGAL } from "@/labo/content";

export const metadata = {
  title: "Disclaimers & notices",
  description: "Scope of licensure, telehealth consent, compounded medications, controlled substances and privacy notices for The Labo Method.",
  alternates: { canonical: "/legal" },
  robots: { index: true, follow: true },
};

export default function Legal() {
  return (
    <>
      <PageHero eyebrow="Legal" title={<>Disclaimers &amp; notices</>} />
      <section>
        <div className="wrap tight">
          <ul className="defs">
            {LEGAL.map((s) => (
              <li key={s.title}>
                <span className="dt">{s.title}</span>
                <p className="dd">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
