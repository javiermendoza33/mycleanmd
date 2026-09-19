import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow, ClosingCTA } from "@/components/labo/Sections";
import { PROGRAMS, getProgram, HEALTHIE } from "@/labo/content";

/** One template, four content objects — exactly as the handoff specifies. */
export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const p = getProgram((await params).slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.name,
    description: p.lede,
    alternates: { canonical: `/programs/${p.slug}` },
    openGraph: { title: p.name, description: p.lede },
  };
}

export default async function ProgramPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const p = getProgram((await params).slug);
  if (!p) notFound();
  const others = PROGRAMS.filter((o) => o.slug !== p.slug);

  return (
    <>
      <header className="pageh">
        <div className="wrap proghead">
          <div>
            <Eyebrow>Program {p.index}</Eyebrow>
            <h1 style={{ marginTop: 15, fontSize: "clamp(2.3rem,5.4vw,3.8rem)", letterSpacing: "-.033em" }}>
              {p.name}
            </h1>
            <p className="sub" style={{ marginTop: 18 }}>{p.lede}</p>
          </div>
          <aside className="tile pricecard">
            <span className="kicker">Program fee</span>
            <span className="amt mono">{p.price}<span className="u"> / mo</span></span>
            <p style={{ fontSize: ".92rem", color: "var(--muted)" }}>{p.priceNote}</p>
            <a className="btn btn-primary" href={HEALTHIE.program(p.slug)}
               target="_blank" rel="noopener noreferrer">Start your intake</a>
          </aside>
        </div>
      </header>

      <section>
        <div className="wrap">
          <div className="clin" style={{ alignItems: "start" }}>
            <div>
              <h3>{p.leftHeading}</h3>
              <ul className="tl" style={{ marginTop: 22, gap: 14 }}>
                {p.leftItems.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
            <div>
              <h3>{p.rightHeading}</h3>
              <ul className="defs kv" style={{ marginTop: 10 }}>
                {p.rightItems.map((r) => (
                  <li key={r.key}>
                    <span className="dt">{r.key}</span>
                    <span className="dd">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grey">
        <div className="wrap tight">
          <Eyebrow>Worth saying plainly</Eyebrow>
          <h2 style={{ marginTop: 15 }}>{p.noteHeading}</h2>
          <p className="sub" style={{ marginTop: 17 }}>{p.noteBody}</p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 30 }}>
            <a className="btn btn-primary" href={HEALTHIE.book}
               target="_blank" rel="noopener noreferrer">Book a $149 consult</a>
            <Link className="btn btn-ghost" href="/faq">Read the FAQ</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="tight" style={{ marginBottom: 42 }}>
            <Eyebrow>Other programs</Eyebrow>
            <h2 style={{ marginTop: 15 }}>Every one begins with a panel.</h2>
          </div>
          <div className="tiles">
            {others.map((o) => (
              <article className="tile" key={o.slug}>
                <span className="kicker">Program {o.index}</span>
                <h3>{o.name}</h3>
                <p>{o.navBlurb}</p>
                <Link className="more" href={`/programs/${o.slug}`}>Learn more</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
