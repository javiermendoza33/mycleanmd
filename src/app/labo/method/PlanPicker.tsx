"use client";

import { useState } from "react";
import Link from "next/link";
import { PROGRAMS, EXTRA_PRICING, HEALTHIE } from "@/labo/content";

/**
 * The plan picker on the Method home (Nov 22 2026, after Mochi's "Pay with insurance, or pay yourself" box):
 * pick a program → its monthly price, the note, and a what-you-pay table built from the same content the
 * /pricing page uses (EXTRA_PRICING). Nothing here is new pricing; it is the catalog's numbers, rearranged.
 */
const SHORT: Record<string, string> = { "glp-1-weight-management": "GLP-1", "peptide-therapy": "Peptides", "testosterone-for-men": "TRT", "hormone-therapy-for-women": "HRT" };

export default function PlanPicker() {
  const [i, setI] = useState(0);
  const p = PROGRAMS[i];
  const consult = EXTRA_PRICING[0]; const labs = EXTRA_PRICING[1];
  return (
    <div className="planbox">
      <div className="pseg" role="group" aria-label="Choose a program">
        {PROGRAMS.map((x, n) => <button key={x.slug} type="button" aria-pressed={n === i} onClick={() => setI(n)}>{SHORT[x.slug] ?? x.name}</button>)}
      </div>
      <div className="pprice" aria-live="polite">
        <div className="row"><strong style={{ fontSize: ".95rem" }}>{p.name}</strong><span>Cancel any month</span></div>
        <b>{p.price}<small>/mo</small></b>
        <p>{p.priceNote}</p>
      </div>
      <p className="paylbl">What you pay</p>
      <table className="paytable">
        <tbody>
          <tr><th>Program fee<small>Visits, messaging, dose changes, refills</small></th><td>{p.priceMeta}</td></tr>
          <tr><th>{consult.name}<small>{consult.note}</small></th><td>{consult.price}</td></tr>
          <tr><th>{labs.name}<small>Often billable to insurance</small></th><td>{labs.price}</td></tr>
          <tr><th>Follow-ups, messages, refills, shipping</th><td>Included</td></tr>
        </tbody>
      </table>
      <ul className="chips"><li>No hidden fees</li><li>Cancel any month</li><li>Written protocol you keep</li></ul>
      <Link className="btn btn-primary" href={`/join/${p.slug}`}>Start {SHORT[p.slug] ?? p.name}</Link>
      <p className="pnote">Or <a href={HEALTHIE.book}>book a {consult.price} consult</a> first — it is credited toward your first month. Program fees are self-pay; medication availability and compounded pricing vary by pharmacy.</p>
    </div>
  );
}
