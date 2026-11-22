"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DOWNTIMES, EXPERIENCES, GOALS, SAFETIES, SUBS, TX, recommendTreatment, type Downtime, type Experience, type Goal, type Safety, type Sub } from "@/labo/clinic/treatment-quiz";

/** The in-clinic treatment finder (Nov 21 2026) — five steps from the blueprint, answered client-side; the completed
 *  quiz is logged anonymously to /api/labo/quiz (kind "treatment") for /clinic/quiz. Mounted in QuizTabs on the home
 *  page and on /treatments. */
export default function TreatmentQuiz() {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [sub, setSub] = useState<Sub | null>(null);
  const [downtime, setDowntime] = useState<Downtime | null>(null);
  const [safety, setSafety] = useState<Safety[]>([]);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [step, setStep] = useState(0);
  const done = step === 5 && goal && sub && downtime && experience;
  const result = done ? recommendTreatment({ goal, sub, downtime, safety, experience }) : null;
  const reset = () => { setGoal(null); setSub(null); setDowntime(null); setSafety([]); setExperience(null); setStep(0); };

  const saved = useRef(false);
  useEffect(() => {
    if (!result || saved.current) return; saved.current = true;
    fetch("/api/labo/quiz", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind: "treatment", answers: { goal, sub, downtime, safety, experience }, picks: result.picks }), keepalive: true }).catch(() => {});
  }, [result, goal, sub, downtime, safety, experience]);
  useEffect(() => { if (step === 0) saved.current = false; }, [step]);

  const Options = <K extends string>({ items, value, onPick }: { items: { key: K; label: string }[]; value: K | null; onPick: (k: K) => void }) => (
    <div className="chips tiles quizopts" role="radiogroup">
      {items.map((o) => <button key={o.key} type="button" role="radio" aria-checked={value === o.key} className={`cchip${value === o.key ? " own" : ""}`} onClick={() => onPick(o.key)}>{o.label}</button>)}
    </div>
  );
  const toggleSafety = (k: Safety) => setSafety((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  const canNext = [!!goal, !!sub, !!downtime, true, !!experience][step];
  const labels = ["What would you most like to address first?", goal === "aging" ? "Where do you notice it most?" : goal === "pigment" ? "How would you describe the discoloration?" : goal === "texture" ? "What's the texture issue?" : "What kind of refresh are you after?", "How much downtime fits your schedule?", "Does any of this apply? (choose any, or none)", "Where are you starting from?"];

  return (
    <div className="quiz">
      {!result ? (
        <>
          <div className="qhead">
            <span className="mono qmeta">Question {step + 1} of 5</span>
            {step > 0 && <button type="button" className="more cont" onClick={() => setStep(step - 1)}>‹ Back</button>}
          </div>
          <h3>{labels[step]}</h3>
          {step === 0 && <Options items={GOALS} value={goal} onPick={(g) => { setGoal(g); setSub(null); }} />}
          {step === 1 && goal && <Options items={SUBS[goal]} value={sub} onPick={setSub} />}
          {step === 2 && <Options items={DOWNTIMES} value={downtime} onPick={setDowntime} />}
          {step === 3 && (
            <div className="chips tiles quizopts" role="group">
              {SAFETIES.map((o) => <button key={o.key} type="button" role="checkbox" aria-checked={safety.includes(o.key)} className={`cchip${safety.includes(o.key) ? " own" : ""}`} onClick={() => toggleSafety(o.key)}>{o.label}</button>)}
              <button type="button" role="checkbox" aria-checked={safety.length === 0} className={`cchip${safety.length === 0 ? " own" : ""}`} onClick={() => setSafety([])}>None of these</button>
            </div>
          )}
          {step === 4 && <Options items={EXPERIENCES} value={experience} onPick={setExperience} />}
          <div className="qnav">
            <button type="button" className="btn btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>{step === 4 ? "See my treatment" : "Next"}</button>
            <span className="note" style={{ margin: 0 }}>Your answers are kept anonymously — no name or email. This points you to a treatment; the plan itself is written at your consultation.</span>
          </div>
        </>
      ) : (
        <>
          <div className="qhead">
            <div><span className="mono qmeta">Your match · {SUBS[goal!].find((s) => s.key === sub)!.label.toLowerCase()} · {DOWNTIMES.find((d) => d.key === downtime)!.label.split(" — ")[0].toLowerCase()} downtime</span><h3 style={{ marginTop: 6 }}>{result.picks.length > 1 ? "Two that work together." : "Start here."}</h3></div>
            <button type="button" className="more cont" onClick={reset}>Start over</button>
          </div>
          {result.banners.map((b) => <p key={b} className="qbanner">{b}</p>)}
          <ul className="txrecs">
            {result.picks.map((k) => { const t = TX[k]; return <li key={k}><div><b>{t.name}</b><span className="mono">{t.from}</span></div><Link className="more" href={t.href}>Learn more</Link></li>; })}
          </ul>
          <p className="sub" style={{ marginTop: 16, fontSize: "1rem" }}>{result.plan}</p>
          <div className="qnav">
            <Link className="btn btn-primary" href="/booking">Book a consultation</Link>
            <Link className="btn btn-ghost" href="/contact">Ask us first</Link>
            {result.routineHandoff && <span className="note" style={{ margin: 0 }}>For the at-home side, the <b>Skincare routine</b> tab builds it from the shop.</span>}
          </div>
        </>
      )}
    </div>
  );
}
