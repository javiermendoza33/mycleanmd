import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/labo/Sections";
import { METHOD_OPEN, HEALTHIE } from "@/labo/content";
import { mc, lh, type Lang } from "@/labo/method/i18n";

export default function JoinView({ lang, slug }: { lang: Lang; slug: string }) {
  const c = mc(lang), t = c.t;
  const p = c.getProgram(slug);
  if (!p) notFound();
  const configured = p.stripePriceId !== "PRICE_ID_NOT_SET";

  return (
    <section>
      <div className="wrap tight" style={{ paddingBlock: 8 }}>
        <Eyebrow>{t.programN(p.index)}</Eyebrow>
        <h1 style={{ marginTop: 15 }}>{p.name}</h1>
        <p className="sub" style={{ marginTop: 17 }}>{p.lede}</p>

        <div className="tile pricecard" style={{ marginTop: 34, maxWidth: 420 }}>
          <span className="kicker">{t.programFee}</span>
          <span className="amt mono">{p.price}<span className="u">{t.perMo}</span></span>
          <p style={{ fontSize: ".92rem", color: "var(--muted)" }}>{p.priceNote}</p>
          <ul className="tl" style={{ marginTop: 18, gap: 10 }}>
            {p.pricingBullets.map((b) => <li key={b}>{b}</li>)}
          </ul>

          {configured ? (
            <a className="btn btn-primary" style={{ marginTop: 22 }} href={`/api/labo/checkout?program=${p.slug}`}>
              {t.join.checkout}
            </a>
          ) : !METHOD_OPEN ? (
            <>
              <p style={{ marginTop: 22, fontSize: ".9rem", fontWeight: 600 }}>{t.soon.joinNote}</p>
              <a className="btn btn-primary" style={{ marginTop: 12 }} href={lh(lang, HEALTHIE.program(p.slug))}>{t.soon.cta}</a>
            </>
          ) : (
            <p style={{ marginTop: 22, fontSize: ".85rem", color: "var(--muted)" }}>
              {t.join.notConnected}
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
