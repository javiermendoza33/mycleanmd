import { ClosingCTA, Eyebrow, PageHero } from "@/components/labo/Sections";
import { mc, type Lang } from "@/labo/method/i18n";

export default function HowView({ lang }: { lang: Lang }) {
  const c = mc(lang), t = c.t;
  return (
    <>
      <PageHero eyebrow={t.how.eyebrow} title={t.how.title} lede={t.how.lede} />

      <section>
        <div className="wrap">
          <div className="mpanel">
          {c.HOW_LONG.map((s) => (
            <div key={s.n} className="hlrow">
              <span className="n">{s.n}</span>
              <div>
                <h2 className="h3">{s.title}</h2>
                <span className="meta">{s.meta}</span>
              </div>
              <div className="bd">
                <p>{s.body}</p>
                <p>{s.detail}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      <section className="grey">
        <div className="wrap">
          <div className="tight">
            <Eyebrow>{t.how.getK}</Eyebrow>
            <h2 style={{ marginTop: 15 }}>{t.how.getH}</h2>
          </div>
          <div className="mpanel" style={{ marginTop: 38 }}>
            <div className="inclgrid">
              {c.INCLUDED.map((i) => <div key={i}>{i}</div>)}
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA lang={lang} />
    </>
  );
}
