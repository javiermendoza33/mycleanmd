"use client";
/* Self-playing hero card for The Labo Method (Nov 23 2026, Javier: "check out flexpa.com, i know this widget style… something we can do for us").
   The Flexpa pattern: a chat-style card with prompt chips, the patient's question, a tool line, a panel of steps that tick
   through, then the result. Three scripted scenarios loop; hover or focus pauses; reduced motion shows the finished state.
   A fictional patient throughout. */
import { useEffect, useRef, useState } from "react";

type Row = { who: string; what: string };
type Scene = { chip: string; q: string; tool: string; args: string; head: string; rows: Row[]; out: string[] };
const SCENES: Scene[] = [
  { chip: "Start GLP-1", q: "Can I start a GLP-1? My last A1c was borderline.", tool: "check_eligibility", args: '{"program":"glp-1"}', head: "Building your plan",
    rows: [{ who: "Metabolic panel", what: "Lab draw near you · received" }, { who: "Clinician review", what: "Board-certified NP · 24 h" }, { who: "Licensed US pharmacy", what: "Semaglutide · ships in 2–3 days" }],
    out: ["A1c 5.9% · fasting glucose 104 → eligible", "Start 0.25 mg weekly, step up over 4 weeks", "Video visit Tue 10:20 AM · dose changes included"] },
  { chip: "Check my hormones", q: "My energy has been low for months. What should we test?", tool: "order_labs", args: '{"panel":"hormone"}', head: "Ordering your labs",
    rows: [{ who: "Hormone panel", what: "Testosterone, estradiol, TSH, CBC, metabolic" }, { who: "Draw site", what: "12 locations near you · no appointment" }, { who: "Results", what: "2–3 days · reviewed within 24 h" }],
    out: ["Your plan is written from your numbers, not a quiz", "Video visit booked Thu 4:40 PM", "Messaging with your clinician, included"] },
  { chip: "Refill my prescription", q: "I'm down to my last dose. Can you refill it?", tool: "refill", args: '{"med":"semaglutide 0.5 mg"}', head: "Checking your refill",
    rows: [{ who: "Progress", what: "−11 lb in 8 weeks · no side effects logged" }, { who: "Clinician approval", what: "Same dose · 14 min" }, { who: "Pharmacy", what: "Ships Tuesday · tracking by text" }],
    out: ["Refill approved, no visit needed", "Next step-up reviewed at week 12", "Cancel any month, no hidden fees"] },
];
const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const BEATS: [number, number][] = [[1, 600], [2, 1100], [3, 900], [4, 800], [5, 800], [6, 700], [7, 500]];   // step, then how long it holds

export function MethodDemo() {
  const [scene, setScene] = useState(0);
  const [take, setTake] = useState(0);        // bump to replay the same scene
  const [step, setStep] = useState(0);        // 0 idle · 1 question · 2 tool line · 3–5 rows appear · 6 rows ticked · 7 result
  const [done, setDone] = useState(false);
  const paused = useRef(false);
  const run = useRef(0);
  const s = SCENES[scene];

  useEffect(() => {
    if (reduced()) { setStep(7); setDone(true); return; }
    const id = ++run.current;
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
    (async () => {
      setStep(0); setDone(false); await sleep(400);
      for (const [st, wait] of BEATS) { if (run.current !== id) return; setStep(st); await sleep(wait); }
      setDone(true); await sleep(3800);
      while (run.current === id && (paused.current || document.hidden)) await sleep(300);
      if (run.current === id) setScene(x => (x + 1) % SCENES.length);
    })();
    return () => { if (run.current === id) run.current++; };
  }, [scene, take]);

  const pick = (i: number) => { if (i === scene) setTake(t => t + 1); else setScene(i); };
  return (
    <div className="mdemo" onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }} onFocus={() => { paused.current = true; }} onBlur={() => { paused.current = false; }} aria-label="A demo of The Labo Method with a fictional patient">
      <div className="mdhead"><span className="dots" aria-hidden><i /><i /><i /></span><b>Your clinician</b><span className="live"><i />Labs connected</span></div>
      <div className="mdchips" role="tablist" aria-label="Example requests">{SCENES.map((x, i) => <button key={x.chip} type="button" role="tab" aria-selected={i === scene} className={i === scene ? "on" : ""} onClick={() => pick(i)}>{x.chip}</button>)}</div>
      <div className="mdbody" aria-live="polite">
        <p className={`mdq ${step >= 1 ? "in" : ""}`}>{s.q}</p>
        <p className={`mdtool ${step >= 2 ? "in" : ""}`}><span className="ok">✓</span> The Labo Method <span className="arr">›</span> <code>{s.tool}</code> <code className="args">{s.args}</code></p>
        <div className={`mdpanel ${step >= 3 ? "in" : ""}`}>
          <div className="mdph"><span>The Labo Method · {s.head}</span>{step < 6 ? <i className="spin" aria-hidden /> : <span className="ok">✓</span>}</div>
          {s.rows.map((r, i) => <div key={r.who} className={`mdrow ${step >= 3 + i ? "in" : ""} ${step >= 4 + i ? "tick" : ""}`}><i className="pt" /><b>{r.who}</b><span>{r.what}</span><span className="chk" aria-hidden>✓</span></div>)}
        </div>
        <ul className={`mdout ${step >= 7 ? "in" : ""}`}>{s.out.map(o => <li key={o}>{o}</li>)}</ul>
      </div>
      <div className="mdfoot"><span>A demo with a fictional patient, sources and results.</span><button type="button" onClick={() => pick(scene)}>{done ? "↻ Replay" : "Playing…"}</button></div>
    </div>
  );
}
