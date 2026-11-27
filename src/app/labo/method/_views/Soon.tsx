import Link from "next/link";
import { METHOD } from "@/labo/content";
import { mc, lh, type Lang } from "@/labo/method/i18n";

/** /signin (Nov 22 2026, Javier: "remove signin page or put coming soon page"): the patient portal for The Labo
 *  Method isn't open yet, so Sign in lands here instead of the bare Healthie placeholder. Swap this page for the real
 *  portal link (HEALTHIE.login in content.ts) when the practice supplies it. */
export function SignInView({ lang }: { lang: Lang }) {
  const c = mc(lang), s = c.t.signin;
  return (
    <section className="soon">
      <div className="wrap tight">
        <span className="tag">{s.tag}</span>
        <h1>{s.h1[0]}<em>{s.h1[1]}</em></h1>
        <p className="sub">{s.sub}</p>
        <div className="acts">
          <Link className="btn btn-primary" href={lh(lang, "/programs")}>{s.start}</Link>
          <Link className="btn btn-ghost" href={lh(lang, "/how-it-works")}>{s.how}</Link>
        </div>
        <p className="note">{s.note1}<a href={`mailto:${METHOD.email}`}>{METHOD.email}</a>{s.note2(c.AVAILABILITY)}</p>
      </div>
    </section>
  );
}

/** /book (Nov 22 2026): consult booking lands here until the practice picks its EMR / scheduling vendor
 *  (HEALTHIE.book in content.ts). Same pattern as /signin. */
export function BookView({ lang }: { lang: Lang }) {
  const c = mc(lang), b = c.t.book;
  const consult = c.EXTRA_PRICING[0];
  return (
    <section className="soon">
      <div className="wrap tight">
        <span className="tag">{b.tag}</span>
        <h1>{b.h1[0]}<em>{b.h1[1]}</em></h1>
        <p className="sub">{b.sub(consult.price, consult.note)}</p>
        <div className="acts">
          <a className="btn btn-primary" href={`mailto:${METHOD.email}?subject=${encodeURIComponent(b.subject)}`}>{b.email}</a>
          <Link className="btn btn-ghost" href={lh(lang, "/programs")}>{b.see}</Link>
        </div>
        <p className="note">{b.note(c.AVAILABILITY)}</p>
      </div>
    </section>
  );
}
