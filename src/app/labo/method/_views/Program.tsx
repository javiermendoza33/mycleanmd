import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow, ClosingCTA } from "@/components/labo/Sections";
import { HEALTHIE } from "@/labo/content";
import { mc, lh, type Lang } from "@/labo/method/i18n";
import { postByEnSlug } from "@/labo/method/posts";

/** Program slug → its matching journal article, for the cross-link below. */
const EVIDENCE_POST: Record<string, string> = {
  "glp-1-weight-management": "glp-1-weight-loss-what-the-evidence-shows",
  "peptide-therapy": "peptide-therapy-what-we-know-and-dont",
  "testosterone-for-men": "testosterone-therapy-for-men-what-to-know",
  "hormone-therapy-for-women": "hormone-therapy-for-women-the-new-evidence",
};

/** One template, four content objects — exactly as the handoff specifies. Two languages since Nov 27 2026. */
export default function ProgramView({ lang, slug }: { lang: Lang; slug: string }) {
  const c = mc(lang), t = c.t;
  const p = c.getProgram(slug);
  if (!p) notFound();
  const others = c.PROGRAMS.filter((o) => o.slug !== p.slug);
  const evidence = EVIDENCE_POST[p.slug] ? postByEnSlug(lang, EVIDENCE_POST[p.slug]) : undefined;

  return (
    <>
      <header className="pageh">
        <div className="wrap proghead">
          <div>
            <Eyebrow>{t.programN(p.index)}</Eyebrow>
            <h1 style={{ marginTop: 15, fontSize: "clamp(2.3rem,5.4vw,3.8rem)", letterSpacing: "-.033em" }}>
              {p.name}
            </h1>
            <p className="sub" style={{ marginTop: 18 }}>{p.lede}</p>
          </div>
          <aside className="tile pricecard">
            <span className="kicker">{t.programFee}</span>
            <span className="amt mono">{p.price}<span className="u">{t.perMo}</span></span>
            <p style={{ fontSize: ".92rem", color: "var(--muted)" }}>{p.priceNote}</p>
            <a className="btn btn-primary" href={lh(lang, HEALTHIE.program(p.slug))}>{t.startIntake}</a>
          </aside>
        </div>
      </header>

      <section>
        <div className="wrap">
          <div className="clin" style={{ alignItems: "start" }}>
            <div>
              <h2 className="h3">{p.leftHeading}</h2>
              <ul className="tl" style={{ marginTop: 22, gap: 14 }}>
                {p.leftItems.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="h3">{p.rightHeading}</h2>
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
          <Eyebrow>{t.program.plainK}</Eyebrow>
          <h2 style={{ marginTop: 15 }}>{p.noteHeading}</h2>
          <p className="sub" style={{ marginTop: 17 }}>{p.noteBody}</p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 30 }}>
            <a className="btn btn-primary" href={lh(lang, HEALTHIE.book)}>{t.bookConsult(c.EXTRA_PRICING[0].price)}</a>
            <Link className="btn btn-ghost" href={lh(lang, "/faq")}>{t.program.readFaq}</Link>
            {evidence && <Link className="more" href={lh(lang, `/blog/${evidence.slug}`)} style={{ alignSelf: "center" }}>{t.program.readEvidence}</Link>}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="tight" style={{ marginBottom: 42 }}>
            <Eyebrow>{t.program.otherK}</Eyebrow>
            <h2 style={{ marginTop: 15 }}>{t.program.otherH}</h2>
          </div>
          <div className="tiles">
            {others.map((o) => (
              <article className="tile" key={o.slug}>
                <span className="kicker">{t.programN(o.index)}</span>
                <h3>{o.name}</h3>
                <p>{o.navBlurb}</p>
                <Link className="more" href={lh(lang, `/programs/${o.slug}`)}>{t.learnMore}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA lang={lang} />
    </>
  );
}
