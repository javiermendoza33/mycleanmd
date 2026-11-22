import { METHOD } from "@/labo/content";

/**
 * The telehealth call-out (Nov 21 2026, Javier: "lets move [the Telehealth link] somewhere else in the menu and put
 * like 'interested in Weight Loss and Peptides? click here' … and find a way to do that for mobile as well in a very
 * premium looking way").
 *
 * Two renderings of one link to method.thelabomethod.com, both in Method's purple (hard-coded — the clinic's
 * --accent is clay):
 *   • <TelePill />  — sits beside the wordmark in the header bar on wide screens (hidden under 1180px, where the
 *                     bar has no room for it); a tinted capsule with a soft pulse dot.
 *   • <TeleBand />  — the phone/tablet version: a slim gradient band directly under the header (hidden ≥1180px).
 * The plain "Telehealth" menu entry lives in TELE_LINK (content.ts): desktop nav, phone sheet, footer column.
 */
const HREF = `https://${METHOD.domain}`;

export function TelePill() {
  return (
    <a className="teleco" href={HREF} aria-label="Interested in weight loss and peptides? Open The Labo Method telehealth">
      <i aria-hidden="true" />
      <span>Weight loss &amp; peptides?</span>
      <b>Click here ›</b>
    </a>
  );
}

export function TeleBand() {
  return (
    <a className="teleband" href={HREF} aria-label="Interested in weight loss and peptides? Open The Labo Method telehealth">
      <span className="wrap">
        <span className="t">Interested in weight loss &amp; peptides?</span>
        <b>Click here ›</b>
      </span>
    </a>
  );
}
