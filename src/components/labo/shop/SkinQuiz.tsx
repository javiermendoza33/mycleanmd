"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { products, SHOP, type Concern, type Product, type ProductType } from "@/labo/clinic/products";
import { ProductCard } from "./ProductCard";

/**
 * Skin quiz (Nov 21 2026, Javier: "i like this idea of take our quiz… replace this area with a quiz" —
 * the Best sellers row on the home page). Three questions, answered client-side, nothing stored or
 * sent anywhere: this is retail skincare preference, not intake. The result is 2–4 products scored
 * from the catalog's own `concerns`/`type` tags and rendered with the shop's ProductCard, so Add to
 * bag / Coming soon behave exactly as on /shop. Deterministic: same answers, same routine.
 */
type Skin = "balanced" | "oily" | "dry" | "sensitive" | "combo";
type Routine = "two" | "short" | "all";

const Q1: { key: Skin; label: string; concern?: Concern; types: ProductType[] }[] = [
  { key: "balanced", label: "Balanced, but I want more", concern: "Aging", types: ["Serum", "Sunscreen"] },
  { key: "oily", label: "Oily and breakout-prone", concern: "Acne", types: ["Cleanser", "Exfoliant"] },
  { key: "dry", label: "Dry and flaky", concern: "Dryness", types: ["Moisturizer", "Serum"] },
  { key: "sensitive", label: "Sensitive, reactive, easily red", concern: "Sensitive", types: ["Cleanser", "Moisturizer"] },
  { key: "combo", label: "Combination — dry in places, oily in others", types: ["Cleanser", "Serum"] },
];
const Q2: { key: Concern; label: string }[] = [
  { key: "Acne", label: "Breakouts & congestion" },
  { key: "Aging", label: "Lines, firmness & glow" },
  { key: "Dryness", label: "Barrier & hydration" },
  { key: "Sensitive", label: "Redness & reactivity" },
  { key: "Pigment", label: "Dark spots & tone" },
];
const Q3: { key: Routine; label: string }[] = [
  { key: "two", label: "Just the essentials — two products" },
  { key: "short", label: "A short routine — three or four" },
  { key: "all", label: "Show me everything for my skin" },
];
const STEPS: ProductType[] = ["Cleanser", "Serum", "Moisturizer", "Sunscreen"];

function recommend(skin: Skin, concern: Concern, routine: Routine): Product[] {
  const q1 = Q1.find((o) => o.key === skin)!;
  const score = (p: Product) =>
    (p.concerns.includes(concern) ? 3 : 0) +
    (q1.concern && p.concerns.includes(q1.concern) ? 1 : 0) +
    (q1.types.includes(p.type) ? 1 : 0) +
    (p.bestSeller ? 0.5 : 0) -
    (p.soon ? 2 : 0);   // own-line placeholders are "Coming soon" — show them only when nothing buyable fits
  const ranked = [...products].sort((a, b) => score(b) - score(a));
  if (routine === "all") return ranked.filter((p) => p.concerns.includes(concern));
  const want = routine === "two" ? ["Serum", "Sunscreen"] : STEPS;
  const picks: Product[] = [];
  for (const t of want) { const p = ranked.find((x) => x.type === t && !picks.includes(x)); if (p) picks.push(p); }
  return picks;
}

export default function SkinQuiz() {
  const [skin, setSkin] = useState<Skin | null>(null);
  const [concern, setConcern] = useState<Concern | null>(null);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [step, setStep] = useState(0);
  const done = step === 3 && skin && concern && routine;
  const picks = done ? recommend(skin, concern, routine) : [];
  const reset = () => { setSkin(null); setConcern(null); setRoutine(null); setStep(0); };
  // Record the completed quiz once (Javier: "the data should be seen in admin portal as well") — anonymous answers +
  // the recommended slugs, to /clinic/quiz. Fire-and-forget: the result renders whether or not this lands.
  const saved = useRef(false);
  useEffect(() => {
    if (!done || saved.current) return; saved.current = true;
    fetch("/api/labo/quiz", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ skin, concern, routine, picks: picks.map((p) => p.slug) }), keepalive: true }).catch(() => {});
  }, [done, skin, concern, routine, picks]);
  useEffect(() => { if (step === 0) saved.current = false; }, [step]);

  const Options = <K extends string>({ items, value, onPick }: { items: { key: K; label: string }[]; value: K | null; onPick: (k: K) => void }) => (
    <div className="chips tiles quizopts" role="radiogroup">
      {items.map((o) => (
        <button key={o.key} type="button" role="radio" aria-checked={value === o.key} className={`cchip${value === o.key ? " own" : ""}`} onClick={() => onPick(o.key)}>{o.label}</button>
      ))}
    </div>
  );
  const canNext = step === 0 ? !!skin : step === 1 ? !!concern : !!routine;

  return (
    <div className="quiz">
      {!done ? (
        <>
          <div className="qhead">
            <span className="mono qmeta">Question {step + 1} of 3</span>
            {step > 0 && <button type="button" className="more cont" onClick={() => setStep(step - 1)}>‹ Back</button>}
          </div>
          {step === 0 && (<><h3>How does your skin feel today?</h3><Options items={Q1} value={skin} onPick={setSkin} /></>)}
          {step === 1 && (<><h3>What would you most like to change?</h3><Options items={Q2} value={concern} onPick={setConcern} /></>)}
          {step === 2 && (<><h3>How much routine do you actually want?</h3><Options items={Q3} value={routine} onPick={setRoutine} /></>)}
          <div className="qnav">
            <button type="button" className="btn btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>{step === 2 ? "See my routine" : "Next"}</button>
            <span className="note" style={{ margin: 0 }}>Your answers are kept anonymously — no name or email — so we know what Seattle skin is asking for.</span>
          </div>
        </>
      ) : (
        <>
          <div className="qhead">
            <div>
              <span className="mono qmeta">Your routine · {Q1.find((o) => o.key === skin)!.label.toLowerCase()} · {Q2.find((o) => o.key === concern)!.label.toLowerCase()}</span>
              <h3 style={{ marginTop: 6 }}>{picks.length <= 2 ? "Start here." : "A routine that fits."}</h3>
            </div>
            <button type="button" className="more cont" onClick={reset}>Start over</button>
          </div>
          <div className="pgrid" style={{ marginTop: 20 }}>{picks.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
          <div className="qnav">
            <Link className="btn btn-ghost" href={`/shop?c=${concern}`}>Everything for {Q2.find((o) => o.key === concern)!.label.toLowerCase()} ›</Link>
            <span className="note" style={{ margin: 0 }}>{SHOP.shipsTo}.{!SHOP.pricesConfirmed && " Pricing is being finalized — text us for today's price."}</span>
          </div>
        </>
      )}
    </div>
  );
}
