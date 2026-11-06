import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/labo/Sections";
import { PROGRAMS, AVAILABILITY } from "@/labo/content";

export const metadata: Metadata = {
  title: "Programs",
  description: `Telehealth hormone and metabolic programs for residents of ${AVAILABILITY}.`,
  alternates: { canonical: "/programs" },
};

export default function ProgramsIndexPage() {
  return (
    <>
      <header className="pageh">
        <div className="wrap tight">
          <Eyebrow>Telehealth programs</Eyebrow>
          <h1 style={{ marginTop: 15 }}>What brings you here?</h1>
          <p className="sub" style={{ marginTop: 17 }}>
            Every program starts the same way: real labs, a real plan, and a clinician
            who is actually watching. Licensed for residents of {AVAILABILITY}.
          </p>
        </div>
      </header>

      <section>
        <div className="wrap">
          <div className="tiles">
            {PROGRAMS.map((p) => (
              <article className="tile" key={p.slug}>
                <span className="kicker">Program {p.index}</span>
                <h3>{p.name}</h3>
                <p>{p.cardBlurb}</p>
                <p className="mono" style={{ marginTop: 12, fontWeight: 600 }}>{p.priceMeta}</p>
                <div style={{ display: "flex", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
                  <Link className="btn btn-primary" href={`/join/${p.slug}`}>Get started</Link>
                  <Link className="more" href={`/programs/${p.slug}`}>Learn more</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
