import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/labo/Sections";
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
      <header className="phead" style={{ paddingBottom: 60 }}>
        <div className="wrap">
          <div className="pg-head">
            <div>
              <Eyebrow brass>Program {p.index}</Eyebrow>
              <h1 className="h1" style={{ fontSize: "clamp(34px,5.2vw,60px)", lineHeight: 1.06 }}>
                {p.name}
              </h1>
              <p className="lead" style={{ maxWidth: 580 }}>{p.lede}</p>
            </div>
            <div className="pg-card">
              <span className="eyebrow">Program fee</span>
              <div className="pg-card-price">{p.priceMeta}</div>
              <p className="pg-card-note">{p.priceNote}</p>
              <a className="btn btn-pine btn-block" href={HEALTHIE.program(p.slug)}
                 target="_blank" rel="noopener noreferrer">Start your intake</a>
            </div>
          </div>
        </div>
      </header>

      <section className="wrap" style={{ paddingBlock: 72 }}>
        <div className="pg-two">
          <div>
            <h2 className="h2-sub" style={{ fontSize: "clamp(24px,2.6vw,30px)" }}>{p.leftHeading}</h2>
            <div className="pg-list">
              {p.leftItems.map((i) => <div key={i} className="pg-item">{i}</div>)}
            </div>
          </div>
          <div>
            <h2 className="h2-sub" style={{ fontSize: "clamp(24px,2.6vw,30px)" }}>{p.rightHeading}</h2>
            <div className="pg-list">
              {p.rightItems.map((r) => (
                <div key={r.key} className="pg-item pg-kv">
                  <span className="pg-k">{r.key}</span>
                  <span>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="band-pine">
        <div className="wrap" style={{ paddingBlock: 76 }}>
          <div className="pg-note-band">
            <h2 className="pg-note-h">{p.noteHeading}</h2>
            <div>
              <p className="pg-note-b">{p.noteBody}</p>
              <div className="pg-note-btns">
                <a className="btn btn-brass" href={HEALTHIE.book}
                   target="_blank" rel="noopener noreferrer">Book a consult</a>
                <Link className="btn btn-ghost" href="/faq">Read the FAQ</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingBlock: 76 }}>
        <span className="eyebrow">Other programs</span>
        <div className="hair other-grid">
          {others.map((o) => (
            <Link key={o.slug} className="other-cell" href={`/programs/${o.slug}`}>
              <span className="eyebrow-brass">{o.index}</span>
              <div className="other-t">{o.name}</div>
              <p className="other-b">{o.navBlurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
