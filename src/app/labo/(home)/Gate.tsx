"use client";

import { useState } from "react";
import { HEALTHIE, PRACTICE } from "@/labo/content";

/**
 * The eligibility gate — the hero's primary interactive element and the whole
 * point of the redesign (handoff §2). Two questions, answered immediately:
 * CA or WA → "Yes, I can treat you" + the panel they would start on + three
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
type Residency = "CA" | "WA" | "OTHER";
type Reason = "" | "glp1" | "pep" | "trt" | "hrt" | "unsure";

const COPY: Record<Exclude<Reason, "">, { label: string; panel: string }> = {
  glp1:   { label: "GLP-1 Weight Management",  panel: "metabolic panel with HbA1c, fasting insulin and lipids" },
  pep:    { label: "Peptide Therapy",           panel: "baseline panel with IGF-1 and inflammatory markers" },
  trt:    { label: "Testosterone for Men",      panel: "full endocrine work-up with hematocrit and PSA" },
  hrt:    { label: "Hormone Therapy for Women", panel: "hormone panel with estradiol, FSH and progesterone" },
  unsure: { label: "a starting consult",        panel: "broad baseline panel" },
};

const STATES: { code: Residency; label: string }[] = [
  { code: "CA", label: "California" },
  { code: "WA", label: "Washington" },
  { code: "OTHER", label: "Elsewhere" },
];

const ELIGIBLE_STEPS = [
  "Ten-minute intake in the secure portal",
  "Lab order sent, drawn near you in 2 to 5 days",
  "Video visit once results land, protocol agreed together",
];
const WAITLIST_STEPS = [
  "Join the waitlist for your state",
  "You hear from me only if licensure changes",
];

export default function Gate() {
  const [residency, setResidency] = useState<Residency | null>(null);
  const [reason, setReason] = useState<Reason>("");

  const eligible = residency === "CA" || residency === "WA";
  const p = reason ? COPY[reason] : null;

  return (
    <div className="gate">
      <div className="gh">
        <h3>See if I can treat you</h3>
        <p>Two questions, about five seconds.</p>
      </div>
      <div className="gb">
        <div className="field">
          <label id="lbl-state">Where do you live?</label>
          <div className="seg" role="group" aria-labelledby="lbl-state">
            {STATES.map((s) => (
              <button key={s.code} type="button" aria-pressed={residency === s.code}
                      onClick={() => setResidency(s.code)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="prog">What brought you here?</label>
          <select id="prog" value={reason} onChange={(e) => setReason(e.target.value as Reason)}>
            <option value="">Choose a starting point</option>
            <option value="glp1">Weight that will not move</option>
            <option value="pep">Recovery, sleep and performance</option>
            <option value="trt">Low energy or low testosterone</option>
            <option value="hrt">Perimenopause or menopause</option>
            <option value="unsure">I am not sure yet</option>
          </select>
        </div>
      </div>

      {residency && (
        <div className={`res ${eligible ? "ok" : "warn"}`} id="gate-result" role="status">
          {eligible ? (
            <>
              <h4>Yes — I can treat you.</h4>
              <p>
                {p
                  ? `You would start on ${p.label}. Your first panel would be a ${p.panel}, drawn at a lab near you.`
                  : "Pick a starting point above and I will tell you which panel you would begin with."}
              </p>
              <ol className="mini">
                {ELIGIBLE_STEPS.map((t, i) => (
                  <li key={t}><span className="n">{i + 1}</span><span>{t}</span></li>
                ))}
              </ol>
              <div>
                <a className="btn btn-primary" href={HEALTHIE.intake} target="_blank" rel="noopener noreferrer">
                  Start my intake
                </a>
              </div>
            </>
          ) : (
            <>
              <h4>Not yet — and I would rather tell you now.</h4>
              <p>
                Telehealth rules require you to be physically located in a state where your clinician is licensed.
                I hold licenses in California and Washington only. Leave your email and I will tell you if that changes.
              </p>
              <ol className="mini">
                {WAITLIST_STEPS.map((t, i) => (
                  <li key={t}><span className="n">{i + 1}</span><span>{t}</span></li>
                ))}
              </ol>
              <div>
                {/* A mailto the visitor sends themselves: nothing is collected or stored by this site (§8). */}
                <a className="btn btn-primary"
                   href={`mailto:${PRACTICE.email}?subject=${encodeURIComponent("Waitlist for my state")}`}>
                  Join the waitlist
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
