import type { ReactNode } from "react";
import { HEALTHIE, AVAILABILITY } from "@/labo/content";

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
      <div className="wrap tight">
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
export function ClosingCTA({
  title = "Start with your numbers.",
  lede = "Intake takes about ten minutes. Labs get drawn near you. You leave the visit with a plan you understand.",
}: { title?: string; lede?: string }) {
  return (
    <section className="close">
      <div className="wrap">
        <h2>{title}</h2>
        <p className="sub" style={{ margin: "20px auto 0", maxWidth: "44ch" }}>{lede}</p>
        <div className="acts">
          <a className="btn btn-primary" href={HEALTHIE.intake} target="_blank" rel="noopener noreferrer">
            Start your intake
          </a>
          <a className="btn btn-ghost" href={HEALTHIE.book} target="_blank" rel="noopener noreferrer">
            Book a $149 consult
          </a>
        </div>
        <p className="note">Available to residents of {AVAILABILITY}.</p>
      </div>
    </section>
  );
}
