import type { ReactNode } from "react";
import { AVAILABILITY, HEALTHIE } from "@/labo/content";

/** Eyebrow with the 26px brass rule the handoff puts before every one. */
export function Eyebrow({ children, brass }: { children: ReactNode; brass?: boolean }) {
  return (
    <span className={`eyebrow-row ${brass ? "eyebrow-brass" : "eyebrow"}`}>{children}</span>
  );
}

/** Standard page header: eyebrow, H1, lead, closing rule. */
export function PageHead({
  eyebrow, title, lede, wide,
}: { eyebrow: string; title: string; lede?: string; wide?: boolean }) {
  return (
    <header className="phead">
      <div className={`wrap ${wide ? "" : ""}`}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="h1">{title}</h1>
        {lede && <p className="lead">{lede}</p>}
      </div>
    </header>
  );
}

/**
 * Closing CTA. Every conversion path is an external Healthie link — the note
 * under the buttons names the states served, so it is generated from the same
 * AVAILABILITY constant as the footer and the legal page rather than typed.
 */
export function ClosingCTA({
  title = "Start with your numbers.",
  lede = "Intake takes about ten minutes. Labs get drawn near you. We talk once results are in, and you leave the visit with a plan you understand.",
}: { title?: string; lede?: string }) {
  return (
    <section className="band-pine">
      <div className="cta-in">
        <div>
          <h2 className="cta-h">{title}</h2>
          <p className="cta-lede">{lede}</p>
        </div>
        <div className="cta-btns">
          <a className="btn btn-brass btn-lg btn-block" href={HEALTHIE.intake}
             target="_blank" rel="noopener noreferrer">Start your intake</a>
          <a className="btn btn-ghost btn-lg btn-block" href={HEALTHIE.book}
             target="_blank" rel="noopener noreferrer">Book a consult</a>
          <p className="cta-note">Available to residents of {AVAILABILITY}.</p>
        </div>
      </div>
    </section>
  );
}

/**
 * The hero's decorative wave art: oversized ellipses clipped so only their top
 * edge shows. Every value is from the handoff. Pure CSS on purpose — the design
 * has no icons and no SVG, and that restraint is the whole look.
 */
const BOTTOM_ARCS: [string, string, number, string][] = [
  ["-14%", "128%", 96, "rgba(18,49,42,.09)"],
  ["-16%", "132%", 128, "rgba(185,139,76,.26)"],
  ["-12%", "124%", 162, "rgba(18,49,42,.07)"],
  ["-18%", "136%", 200, "rgba(185,139,76,.16)"],
  ["-13%", "126%", 242, "rgba(18,49,42,.06)"],
  ["-17%", "134%", 288, "rgba(185,139,76,.11)"],
];
const CREST_ARCS: [string, string, number, string][] = [
  ["-10%", "120%", 40, "rgba(18,49,42,.07)"],
  ["-14%", "128%", 88, "rgba(185,139,76,.18)"],
  ["-8%", "116%", 142, "rgba(18,49,42,.05)"],
];

export function WaveArt() {
  return (
    <>
      <div className="waves" aria-hidden="true">
        {BOTTOM_ARCS.map(([left, width, top, color], i) => (
          <span key={i} className="arc"
                style={{ left, width, top, borderTop: `1px solid ${color}` }} />
        ))}
      </div>
      <div className="waves-crest" aria-hidden="true">
        {CREST_ARCS.map(([left, width, top, color], i) => (
          <span key={i} className="arc"
                style={{ left, width, top, borderTop: `1px solid ${color}` }} />
        ))}
      </div>
    </>
  );
}

/** Photo in the offset brass frame used on the homepage and About. */
export function Framed({ src, alt, pos }: { src: string; alt: string; pos: string }) {
  return (
    <div className="frame">
      <span className="frame-offset" aria-hidden="true" />
      <div className="frame-img">
        <img src={src} alt={alt} style={{ objectPosition: pos }} />
      </div>
    </div>
  );
}
