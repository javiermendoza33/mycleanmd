import Link from "next/link";
import { Eyebrow } from "@/components/labo/Sections";
import { mc, lh, type Lang } from "@/labo/method/i18n";

export default function ProgramsView({ lang }: { lang: Lang }) {
  const c = mc(lang), t = c.t;
  return (
    <>
      <header className="pageh">
        <div className="wrap tight">
          <Eyebrow>{t.programs.eyebrow}</Eyebrow>
          <h1 style={{ marginTop: 15 }}>{t.programs.h1}</h1>
          <p className="sub" style={{ marginTop: 17 }}>{t.programs.sub(c.AVAILABILITY)}</p>
        </div>
      </header>
      <section style={{ paddingBlock: 0 }}>
        <div className="wrap"><div className="band" style={{ marginTop: 44 }}><img src="/labo/img/misc/testimonials.jpg" alt={t.programs.imgAlt} /></div></div>
      </section>

      <section>
        <div className="wrap">
          <div className="tiles">
            {c.PROGRAMS.map((p) => (
              <article className="tile" key={p.slug}>
                <span className="kicker">{t.programN(p.index)}</span>
                <h2 className="h3">{p.name}</h2>
                <p>{p.cardBlurb}</p>
                <p className="mono" style={{ marginTop: 12, fontWeight: 600 }}>{p.priceMeta}</p>
                <div style={{ display: "flex", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
                  <Link className="btn btn-primary" href={lh(lang, `/join/${p.slug}`)}>{t.getStarted}</Link>
                  <Link className="more" href={lh(lang, `/programs/${p.slug}`)}>{t.learnMore}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
