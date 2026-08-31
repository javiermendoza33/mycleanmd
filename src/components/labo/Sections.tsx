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
 * edge shows. Pure CSS on purpose — the design has no icons and no SVG, and
 * that restraint is the whole look.
 *
 * The handoff's own values, roughly doubled in strength with a few more lines.
 * Rendered exactly as specified they were invisible on a real screen: the only
 * artwork in the entire design, and you could not see it. These still read as a
 * whisper at arm's length; they just now read as something.
 *
 * The 5th tuple entry is a drift duration. Each arc runs on its own clock —
 * 37–71s, all primes, so the set never visibly repeats — and alternates
 * direction. Transform only, twelve elements, and off under reduced-motion.
 */
type Arc = [left: string, width: string, top: number, color: string, seconds: number];

const BOTTOM_ARCS: Arc[] = [
  ["-14%", "128%", 78, "rgba(18,49,42,.16)", 41],
  ["-16%", "132%", 112, "rgba(185,139,76,.46)", 53],
  ["-12%", "124%", 150, "rgba(18,49,42,.13)", 37],
  ["-18%", "136%", 192, "rgba(185,139,76,.30)", 61],
  ["-13%", "126%", 236, "rgba(18,49,42,.11)", 47],
  ["-17%", "134%", 284, "rgba(185,139,76,.22)", 67],
  ["-15%", "130%", 330, "rgba(18,49,42,.09)", 43],
  ["-19%", "138%", 378, "rgba(185,139,76,.16)", 59],
];
const CREST_ARCS: Arc[] = [
  ["-10%", "120%", 34, "rgba(18,49,42,.13)", 49],
  ["-14%", "128%", 82, "rgba(185,139,76,.34)", 71],
  ["-8%", "116%", 136, "rgba(18,49,42,.10)", 39],
  ["-12%", "124%", 196, "rgba(185,139,76,.20)", 57],
];

function Arcs({ arcs }: { arcs: Arc[] }) {
  return (
    <>
      {arcs.map(([left, width, top, color, seconds], i) => (
        <span key={i} className="arc" style={{
          left, width, top, borderTop: `1px solid ${color}`,
          animationDuration: `${seconds}s`,
          animationDirection: i % 2 ? "alternate-reverse" : "alternate",
        }} />
      ))}
    </>
  );
}

export function WaveArt() {
  return (
    <>
      <div className="waves" aria-hidden="true"><Arcs arcs={BOTTOM_ARCS} /></div>
      <div className="waves-crest" aria-hidden="true"><Arcs arcs={CREST_ARCS} /></div>
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
