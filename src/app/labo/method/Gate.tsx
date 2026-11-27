"use client";

import { useState } from "react";
import { mc, lh, type Lang } from "@/labo/method/i18n";

/**
 * The starting-point check on the Method home. It began as the eligibility gate (handoff §2): two questions —
 * where you live, what brought you here — with an honest decline and a waitlist for anyone outside the licensed
 * states. Nov 27 2026 (Javier: "we will be in 50 states now"): care is offered everywhere, so the state question
 * and the decline are gone; one question now answers "where would I start" with the first panel and three steps.
 *
 * PRIVACY (handoff §8): this component stores NOTHING and submits NOTHING. The answer lives in React state for
 * the life of the page — no URL, no storage, no analytics. Adding a POST here needs a BAA on every hop first.
 */
type Reason = "" | "glp1" | "pep" | "trt" | "hrt" | "unsure";

/** Which program each answer leads to. The words (labels, panels, steps) are in ui.en.ts / ui.es.ts → gate. */
const SLUG: Record<Exclude<Reason, "">, string | undefined> = {
  glp1: "glp-1-weight-management", pep: "peptide-therapy", trt: "testosterone-for-men", hrt: "hormone-therapy-for-women", unsure: undefined,
};

export default function Gate({ lang = "en" }: { lang?: Lang }) {
  const [reason, setReason] = useState<Reason>("");
  const c = mc(lang), g = c.t.gate;
  const slug = reason ? SLUG[reason] : undefined;
  const p = reason ? { label: slug ? c.getProgram(slug)?.name ?? null : null, panel: g.panel[reason], slug } : null;

  return (
    <div className="gate">
      <div className="gh">
        <h3>{g.h}</h3>
        <p>{g.p}</p>
      </div>
      <div className="gb" style={{ gridTemplateColumns: "1fr" }}>
        <div className="field">
          <label htmlFor="prog">{g.what}</label>
          <select id="prog" value={reason} onChange={(e) => setReason(e.target.value as Reason)}>
            <option value="">{g.choose}</option>
            <option value="glp1">{g.opts.glp1}</option>
            <option value="pep">{g.opts.pep}</option>
            <option value="trt">{g.opts.trt}</option>
            <option value="hrt">{g.opts.hrt}</option>
            <option value="unsure">{g.opts.unsure}</option>
          </select>
        </div>
      </div>

      {p && (
        <div className="res ok" id="gate-result" role="status">
          <h4>{g.yes}</h4>
          <p>{g.result(p.label, p.panel)} {g.everywhere(c.AVAILABILITY)}</p>
          <ol className="mini">
            {g.eligibleSteps.map((t, i) => (
              <li key={t}><span className="n">{i + 1}</span><span>{t}</span></li>
            ))}
          </ol>
          <div>
            <a className="btn btn-primary" href={lh(lang, p.slug ? `/join/${p.slug}` : "/programs")}>
              {g.startMy}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
