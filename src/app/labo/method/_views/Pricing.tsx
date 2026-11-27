import { ClosingCTA, PageHero } from "@/components/labo/Sections";
import { HEALTHIE } from "@/labo/content";
import { mc, type Lang } from "@/labo/method/i18n";

export default function PricingView({ lang }: { lang: Lang }) {
  const c = mc(lang), t = c.t;
  return (
    <>
      <PageHero eyebrow={t.pricing.eyebrow} title={t.pricing.title} lede={t.pricing.lede} />
      <section style={{ paddingBlock: 0 }}>
        <div className="wrap"><div className="band" style={{ marginTop: 44 }}><img src="/labo/img/about/clinic.jpg" alt={t.pricing.imgAlt} /></div></div>
      </section>

      <section className="grey">
        <div className="wrap">
          <div className="tiles">
            {c.PROGRAMS.map((p) => (
              <article className="tile" key={p.slug}>
                <h2 className="h3">{p.name}</h2>
                <span className="price">{p.priceMeta}</span>
                <p>{p.pricingNote}</p>
                <ul className="tl">
                  {p.pricingBullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <div style={{ marginTop: "auto", paddingTop: 16 }}>
                  <a className="btn btn-ghost btn-sm" href={HEALTHIE.program(p.slug)}>{t.pricing.choose}</a>
                </div>
              </article>
            ))}
          </div>

          {/* the homepage's lab-row component, reused without the track — the signature move */}
          <div className="labwrap" style={{ marginTop: 20 }}>
            <div className="labhead">
              <h2 className="h4">{t.pricing.beyond}</h2>
              <span className="kicker">{t.pricing.selfPay}</span>
            </div>
            {c.EXTRA_PRICING.map((e) => (
              <div className="mk" style={{ gridTemplateColumns: "1fr auto" }} key={e.name}>
                <div className="nm">{e.name}<em>{e.note}</em></div>
                <div className="val">{e.price}</div>
              </div>
            ))}
          </div>

          <p className="note">{c.PRICING_FOOTNOTE}</p>
        </div>
      </section>

      <ClosingCTA lang={lang} />
    </>
  );
}
