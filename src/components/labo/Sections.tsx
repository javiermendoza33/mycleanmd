import type { ReactNode } from "react";
import { HEALTHIE } from "@/labo/content";
import { mc, lh, type Lang } from "@/labo/method/i18n";

/** Mono uppercase eyebrow — the White Room "kicker". */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="kicker">{children}</span>;
}

/** Standard inner-page opening: kicker, H1, optional lead — the homepage's
 *  section-head pattern promoted to a page head. */
export function PageHero({
  eyebrow, title, lede,
}: { eyebrow: string; title: ReactNode; lede?: ReactNode }) {
  return (
    <header className="pageh">
      {/* Nov 21 2026 (Javier: headers "not well balanced... all the left not centered"): was `.wrap.tight`,
          a 700px column centered inside the 1020px site width, so the text started ~160px right of the
          nav's brand and the photo band below. Full .wrap now; the h1/.sub cap their own line length. */}
      <div className="wrap">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        {lede && <p className="sub">{lede}</p>}
      </div>
    </header>
  );
}

/**
 * Closing CTA — the homepage's close section, reused so every page ends the
 * same way. Both buttons go through the HEALTHIE constants; the note is
 * generated from AVAILABILITY like the footer and the legal page.
 */
export function ClosingCTA({ title, lede, lang = "en" }: { title?: string; lede?: string; lang?: Lang }) {
  const c = mc(lang), t = c.t;   // Nov 27 2026: Spanish pages pass lang="es"; the words live in ui.en.ts / ui.es.ts
  title ??= t.closing.title; lede ??= t.closing.lede;
  return (
    <section className="close">
      <div className="wrap">
        <h2>{title}</h2>
        <p className="sub" style={{ margin: "20px auto 0", maxWidth: "44ch" }}>{lede}</p>
        <div className="acts">
          <a className="btn btn-primary" href={lh(lang, HEALTHIE.intake)}>
            {t.startIntake}
          </a>
          <a className="btn btn-ghost" href={lh(lang, HEALTHIE.book)}>
            {t.bookConsult(c.EXTRA_PRICING[0].price)}
          </a>
        </div>
        <p className="note">{t.closing.note(c.AVAILABILITY)}</p>
      </div>
    </section>
  );
}
