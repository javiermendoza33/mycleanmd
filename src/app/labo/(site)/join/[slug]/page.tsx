import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/labo/Sections";
import { PROGRAMS, getProgram } from "@/labo/content";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const p = getProgram((await params).slug);
  if (!p) return { title: "Not found" };
  return { title: `Join · ${p.name}`, alternates: { canonical: `/join/${p.slug}` } };
}

export default async function JoinProgramPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const p = getProgram((await params).slug);
  if (!p) notFound();
  const configured = p.stripePriceId !== "PRICE_ID_NOT_SET";

  return (
    <section>
      <div className="wrap tight" style={{ padding: "64px 0" }}>
        <Eyebrow>Program {p.index}</Eyebrow>
        <h1 style={{ marginTop: 15 }}>{p.name}</h1>
        <p className="sub" style={{ marginTop: 17 }}>{p.lede}</p>

        <div className="tile pricecard" style={{ marginTop: 34, maxWidth: 420 }}>
          <span className="kicker">Program fee</span>
          <span className="amt mono">{p.price}<span className="u"> / mo</span></span>
          <p style={{ fontSize: ".92rem", color: "var(--muted)" }}>{p.priceNote}</p>
          <ul className="tl" style={{ marginTop: 18, gap: 10 }}>
            {p.pricingBullets.map((b) => <li key={b}>{b}</li>)}
          </ul>

          {configured ? (
            <a className="btn btn-primary" style={{ marginTop: 22 }} href={`/api/labo/checkout?program=${p.slug}`}>
              Continue to secure checkout
            </a>
          ) : (
            <p style={{ marginTop: 22, fontSize: ".85rem", color: "var(--muted)" }}>
              Checkout isn&rsquo;t connected yet for this program — Stripe pricing still
              needs to be set up.
            </p>
          )}
          <p style={{ marginTop: 14, fontSize: ".8rem", color: "var(--muted)" }}>
            {p.pricingNote}
          </p>
        </div>
      </div>
    </section>
  );
}
