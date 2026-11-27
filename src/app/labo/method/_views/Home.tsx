import Link from "next/link";
import { METHOD, PRACTICE, HEALTHIE, METHOD_OPEN } from "@/labo/content";
import { posts } from "@/labo/method/posts";
import { mc, lh, type Lang } from "@/labo/method/i18n";
import { MethodDemo } from "@/components/labo/method/MethodDemo";
import Gate from "../Gate";
import PlanPicker from "../PlanPicker";

/**
 * The Labo Method home — rebuilt Nov 22 2026 on joinmochi.com's page pattern (Javier: "revamp totally to look more
 * like this"): hero with two offer cards and a media card · blue "how it works" band · program cards with
 * "as low as" prices · plan picker with a what-you-pay table · the clinician · the eligibility gate · numbered FAQ ·
 * journal · closing CTA. Every number comes from content.ts (the same unconfirmed placeholders flagged there —
 * still noindex until LAUNCH_READY). No testimonials, ratings or member counts: we have none to show honestly.
 *
 * Nov 27 2026: one template, two languages — `/` renders it with lang "en", `/es` with "es" (see i18n.ts).
 */
const JOURNAL_TEASER = [
  "glp-1-weight-loss-what-the-evidence-shows",
  "peptide-therapy-what-we-know-and-dont",
  "testosterone-therapy-for-men-what-to-know",
  "hormone-therapy-for-women-the-new-evidence",
].map((slug) => posts.find((p) => p.slug === slug)!);

export default function HomeView({ lang }: { lang: Lang }) {
  const c = mc(lang), t = c.t, h = t.home;
  const L = (p: string) => lh(lang, p);
  const lowest = Math.min(...c.PROGRAMS.map((p) => Number(p.price.replace(/[^0-9.]/g, ""))));
  const glp = c.PROGRAMS[0];
  const consult = c.EXTRA_PRICING[0];
  return (
    <>
      <section className="mhero">
        <div className="wrap">
          <div>
            <span className="tag">{METHOD_OPEN ? h.tag(c.AVAILABILITY) : t.soon.tag(c.AVAILABILITY)}</span>
            <h1>{h.h1[0]}<em>{h.h1[1]}</em></h1>
            <p className="sub">{h.sub}</p>
            <div className="offers">
              <Link href={L(`/programs/${glp.slug}`)} className="offer lead">
                <span className="flag">{h.mostChosen}</span>
                <div><span className="lbl">{glp.name}</span><p>{glp.navBlurb}{h.glpExtra}</p></div>
                <div className="amt">{h.perMonth && <small>{h.perMonth}</small>}<b>{glp.price}<span>{t.mo}</span></b></div>
              </Link>
              <Link href={L("/programs")} className="offer">
                <div><span className="lbl">{h.offer2}</span><p>{h.offer2P}</p></div>
                <div className="amt"><small>{h.from}</small><b>${lowest}<span>{t.mo}</span></b></div>
              </Link>
            </div>
            <div className="acts">
              <a className="btn btn-primary" href="#eligible">{h.cta1}</a>
              <Link className="btn btn-ghost" href={L("/programs")}>{h.cta2}</Link>
            </div>
            <ul className="trust">{h.trust.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          {/* Nov 23 2026: the self-playing "Your clinician" card (Flexpa-style) replaces the hero video */}
          <MethodDemo lang={lang} />
        </div>
      </section>

      <section className="mband">
        <div className="wrap">
          <div className="sechead"><span className="kicker">{h.howK}</span><h2>{h.howH}</h2><p className="sub">{h.howSub}</p></div>
          <div className="steps4">
            {c.HOW_SHORT.map((s) => <div className="step" key={s.n}><span className="n">{s.n}</span><h3>{s.title}</h3><p>{s.body}</p></div>)}
          </div>
          <p style={{ marginTop: 22 }}><Link className="btn btn-soft" href={L("/how-it-works")}>{h.howBtn}</Link></p>
        </div>
      </section>

      <section id="programs">
        <div className="wrap">
          <div className="rowhead"><div className="sechead"><span className="kicker">{h.progK}</span><h2>{h.progH[0]}<em>{h.progH[1]}</em></h2></div><Link className="more" href={L("/programs")}>{h.allPrograms}</Link></div>
          <div className="pcards">
            {c.PROGRAMS.map((p) => (
              <article className="pcard" key={p.slug}>
                <span className="kicker">{t.programN(p.index)}</span>
                <h3>{p.name}</h3>
                <p>{p.cardBlurb}</p>
                <div className="pr"><span>{h.asLow}</span><b>{p.price}</b><span>{t.mo}</span></div>
                <Link className="btn btn-primary" href={L(`/join/${p.slug}`)}>{h.start(p)}</Link>
                <Link className="more" href={L(`/programs/${p.slug}`)}>{t.learnMore}</Link>
              </article>
            ))}
          </div>
          <p className="fineprint">{c.PRICING_FOOTNOTE}{h.fine}</p>
        </div>
      </section>

      <section className="grey" id="pricing">
        <div className="wrap plan">
          <div>
            <span className="kicker">{h.planK}</span>
            <h2 style={{ marginTop: 12 }}>{h.planH[0]}<em>{h.planH[1]}</em></h2>
            <p className="sub" style={{ marginTop: 14 }}>{h.planSub}</p>
            <div className="cards2">
              <div><b>{h.card1B}</b><p>{h.card1P}</p></div>
              <div><b>{h.card2B}</b><p>{h.card2P(consult.price, consult.note)}</p></div>
            </div>
            <p style={{ marginTop: 18 }}><Link className="more" href={L("/pricing")}>{h.fullPricing}</Link></p>
          </div>
          <PlanPicker lang={lang} />
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="clin">
            <div><blockquote>{c.CLINICIAN.quote}</blockquote><p className="who">{c.CLINICIAN.body}</p></div>
            <div><span className="kicker">{h.inclK}</span><ul style={{ marginTop: 14 }}>{c.INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="grey" id="eligible" style={{ paddingTop: 64 }}>
        <div className="wrap tight"><Gate lang={lang} /></div>
      </section>

      <section>
        <div className="wrap mfaq">
          <div className="sechead"><span className="kicker">{h.faqK}</span><h2>{h.faqH[0]}<em>{h.faqH[1]}</em></h2><p className="sub">{h.faqSub}<a href={`mailto:${METHOD.email}`}>{METHOD.email}</a>.</p><p style={{ marginTop: 14 }}><Link className="more" href={L("/faq")}>{h.allQ}</Link></p></div>
          <ol className="qa">
            {c.FAQ.slice(0, 5).map((f, i) => (
              <li key={f.q}><details><summary><span className="n">{i + 1}</span>{f.q}<span className="pm" aria-hidden="true">+</span></summary><div className="a">{f.a}</div></details></li>
            ))}
          </ol>
        </div>
      </section>

      {h.journal && (
        <section className="grey">
          <div className="wrap">
            <div className="rowhead"><div className="sechead"><span className="kicker">{h.journalK}</span><h2>{h.journalH[0]}<em>{h.journalH[1]}</em></h2></div><Link className="more" href="/blog">{h.readAll}</Link></div>
            <div className="jcards">
              {JOURNAL_TEASER.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="jcard">
                  <img src={p.image.src} alt={p.image.alt} loading="lazy" />
                  <div className="cb"><h3>{p.title}</h3><p>{p.excerpt}</p><span className="more">{h.readMore}</span></div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={h.journal ? "close" : "close grey"}>
        <div className="wrap">
          <h2>{h.closeH[0]}<em>{h.closeH[1]}</em></h2>
          <div className="acts">
            <a className="btn btn-primary" href={L(HEALTHIE.intake)}>{t.startIntake}</a>
            <a className="btn btn-ghost" href={L(HEALTHIE.book)}>{t.bookConsult(consult.price)}</a>
          </div>
          <p className="note">{h.closeNote(c.AVAILABILITY)}</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="xclinic">
            <div><span className="kicker">{h.xK(PRACTICE.name)}</span><p>{h.xP}</p></div>
            <a className="btn btn-ghost" href={`https://${PRACTICE.domain}`}>{h.xBtn(PRACTICE.name)}</a>
          </div>
        </div>
      </section>
    </>
  );
}
