"use client";

import { useState } from "react";
import { PRACTICE } from "@/labo/content";
import { mc, lh, type Lang } from "@/labo/method/i18n";

/**
 * The eligibility gate — the hero's primary interactive element and the whole
 * point of the redesign (handoff §2). Two questions, answered immediately:
 * WA → "Yes, I can treat you" + the panel they would start on + three
 * next steps; anywhere else → an honest decline with a waitlist offer, because
 * telehealth requires the patient to be physically in a state where the
 * clinician is licensed.
 *
 * Copy and behaviour ported exactly from the prototype's inline script.
 *
 * PRIVACY (handoff §8): this component stores NOTHING and submits NOTHING. The
 * answers live in React state for the life of the page — no URL, no storage,
 * no analytics. Adding a POST here needs a BAA on every hop first.
 */
type Residency = "WA" | "CA" | "OTHER";   // Nov 6 2026: California restored
type Reason = "" | "glp1" | "pep" | "trt" | "hrt" | "unsure";

/** Which program each answer leads to. The words (labels, panels, steps) are in ui.en.ts / ui.es.ts → gate. */
const SLUG: Record<Exclude<Reason, "">, string | undefined> = {
  glp1: "glp-1-weight-management", pep: "peptide-therapy", trt: "testosterone-for-men", hrt: "hormone-therapy-for-women", unsure: undefined,
};

export default function Gate({ lang = "en" }: { lang?: Lang }) {
  const [residency, setResidency] = useState<Residency | null>(null);
  const [reason, setReason] = useState<Reason>("");
  const c = mc(lang), g = c.t.gate;
  const STATES: { code: Residency; label: string }[] = [
    { code: "WA", label: "Washington" },
    { code: "CA", label: "California" },
    { code: "OTHER", label: g.elsewhere },
  ];

  const eligible = residency === "WA" || residency === "CA";
  const slug = reason ? SLUG[reason] : undefined;
  const p = reason ? { label: slug ? c.getProgram(slug)?.name ?? null : null, panel: g.panel[reason], slug } : null;

  return (
    <div className="gate">
      <div className="gh">
        <h3>{g.h}</h3>
        <p>{g.p}</p>
      </div>
      <div className="gb">
        <div className="field">
          <label id="lbl-state">{g.where}</label>
          <div className="seg" role="group" aria-labelledby="lbl-state" style={{ gridTemplateColumns: `repeat(${STATES.length},1fr)` }}>
            {STATES.map((s) => (
              <button key={s.code} type="button" aria-pressed={residency === s.code}
                      onClick={() => setResidency(s.code)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
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

      {residency && (
        <div className={`res ${eligible ? "ok" : "warn"}`} id="gate-result" role="status">
          {eligible ? (
            <>
              <h4>{g.yes}</h4>
              <p>
                {p ? g.result(p.label, p.panel) : g.pick}
              </p>
              <ol className="mini">
                {g.eligibleSteps.map((t, i) => (
                  <li key={t}><span className="n">{i + 1}</span><span>{t}</span></li>
                ))}
              </ol>
              <div>
                <a className="btn btn-primary" href={lh(lang, p?.slug ? `/join/${p.slug}` : "/programs")}>
                  {g.startMy}
                </a>
              </div>
            </>
          ) : (
            <>
              <h4>{g.no}</h4>
              <p>
                {g.noP}
              </p>
              <ol className="mini">
                {g.waitlistSteps.map((t, i) => (
                  <li key={t}><span className="n">{i + 1}</span><span>{t}</span></li>
                ))}
              </ol>
              <div>
                {/* A mailto the visitor sends themselves: nothing is collected or stored by this site (§8). */}
                <a className="btn btn-primary"
                   href={`mailto:${PRACTICE.email}?subject=${encodeURIComponent(g.waitlistSubject)}`}>
                  {g.joinWaitlist}
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
