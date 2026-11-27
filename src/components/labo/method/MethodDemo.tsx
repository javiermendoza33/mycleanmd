"use client";
/* Self-playing hero card for The Labo Method (Nov 23 2026, Javier: "check out flexpa.com, i know this widget style… something we can do for us").
   The Flexpa pattern: a chat-style card with prompt chips, the patient's question, a tool line, a panel of steps that tick
   through, then the result. Three scripted scenarios loop; hover or focus pauses; reduced motion shows the finished state.
   A fictional patient throughout. */
import { useEffect, useRef, useState } from "react";

import { mc, type Lang } from "@/labo/method/i18n";

/* Nov 27 2026: the three scripted scenes and the card's labels moved to ui.en.ts / ui.es.ts → demo, so the Spanish home plays it in Spanish. */
const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const BEATS: [number, number][] = [[1, 600], [2, 1100], [3, 900], [4, 800], [5, 800], [6, 700], [7, 500]];   // step, then how long it holds

export function MethodDemo({ lang = "en" }: { lang?: Lang }) {
  const d = mc(lang).t.demo, SCENES = d.scenes;
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
  }, [scene, take, SCENES.length]);

  const pick = (i: number) => { if (i === scene) setTake(t => t + 1); else setScene(i); };
  return (
    <div className="mdemo" onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }} onFocus={() => { paused.current = true; }} onBlur={() => { paused.current = false; }} aria-label={d.aria}>
      <div className="mdhead"><span className="dots" aria-hidden><i /><i /><i /></span><b>{d.clinician}</b><span className="live"><i />{d.live}</span></div>
      <div className="mdchips" role="tablist" aria-label={d.examples}>{SCENES.map((x, i) => <button key={x.chip} type="button" role="tab" aria-selected={i === scene} className={i === scene ? "on" : ""} onClick={() => pick(i)}>{x.chip}</button>)}</div>
      <div className="mdbody" aria-live="polite">
        <p className={`mdq ${step >= 1 ? "in" : ""}`}>{s.q}</p>
        <p className={`mdtool ${step >= 2 ? "in" : ""}`}><span className="ok">✓</span> The Labo Method <span className="arr">›</span> <code>{s.tool}</code> <code className="args">{s.args}</code></p>
        <div className={`mdpanel ${step >= 3 ? "in" : ""}`}>
          <div className="mdph"><span>The Labo Method · {s.head}</span>{step < 6 ? <i className="spin" aria-hidden /> : <span className="ok">✓</span>}</div>
          {s.rows.map((r, i) => <div key={r.who} className={`mdrow ${step >= 3 + i ? "in" : ""} ${step >= 4 + i ? "tick" : ""}`}><i className="pt" /><b>{r.who}</b><span>{r.what}</span><span className="chk" aria-hidden>✓</span></div>)}
        </div>
        <ul className={`mdout ${step >= 7 ? "in" : ""}`}>{s.out.map(o => <li key={o}>{o}</li>)}</ul>
      </div>
      <div className="mdfoot"><span>{d.foot}</span><button type="button" onClick={() => pick(scene)}>{done ? d.replay : d.playing}</button></div>
    </div>
  );
}
