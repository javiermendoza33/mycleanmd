"use client";

import { useState } from "react";
import Link from "next/link";
import { HEALTHIE } from "@/labo/content";
import { mc, lh, type Lang } from "@/labo/method/i18n";

/**
 * The plan picker on the Method home (Nov 22 2026, after Mochi's "Pay with insurance, or pay yourself" box):
 * pick a program → its monthly price, the note, and a what-you-pay table built from the same content the
 * /pricing page uses (EXTRA_PRICING). Nothing here is new pricing; it is the catalog's numbers, rearranged.
 */
export default function PlanPicker({ lang = "en" }: { lang?: Lang }) {
  const [i, setI] = useState(0);
  const c = mc(lang), t = c.t, pl = t.plan, SHORT = t.short, PROGRAMS = c.PROGRAMS;
  const p = PROGRAMS[i];
  const consult = c.EXTRA_PRICING[0]; const labs = c.EXTRA_PRICING[1];
  return (
    <div className="planbox">
      <div className="pseg" role="group" aria-label={pl.aria}>
        {PROGRAMS.map((x, n) => <button key={x.slug} type="button" aria-pressed={n === i} onClick={() => setI(n)}>{SHORT[x.slug] ?? x.name}</button>)}
      </div>
      <div className="pprice" aria-live="polite">
        <div className="row"><strong style={{ fontSize: ".95rem" }}>{p.name}</strong><span>{pl.cancel}</span></div>
        <b>{p.price}<small>{t.mo}</small></b>
        <p>{p.priceNote}</p>
      </div>
      <p className="paylbl">{pl.whatYouPay}</p>
      <table className="paytable">
        <tbody>
          <tr><th>{t.programFee}<small>{pl.feeSmall}</small></th><td>{p.priceMeta}</td></tr>
          <tr><th>{consult.name}<small>{consult.note}</small></th><td>{consult.price}</td></tr>
          <tr><th>{labs.name}<small>{pl.labsSmall}</small></th><td>{labs.price}</td></tr>
          <tr><th>{pl.followRow}</th><td>{pl.included}</td></tr>
        </tbody>
      </table>
      <ul className="chips">{pl.chips.map((x) => <li key={x}>{x}</li>)}</ul>
      <Link className="btn btn-primary" href={lh(lang, `/join/${p.slug}`)}>{pl.start(SHORT[p.slug] ?? p.name, p.slug)}</Link>
      <p className="pnote">{pl.noteOr}<a href={lh(lang, HEALTHIE.book)}>{pl.noteLink(consult.price)}</a>{pl.noteRest}</p>
    </div>
  );
}
