"use client";

import { useState } from "react";
import { useBag } from "./bag";

/** The product's buy control. Three states: partner item with its unique link → outbound button to the partner
 *  store (ALASTIN, Nov 21 2026 — new tab, no discount copy near it per their MAP rules); partner item without a
 *  link yet, or `soon` → disabled; otherwise the bag. */
export default function AddToBag({ slug, big, label = "Add to bag", soon, partner, buyUrl }: { slug: string; big?: boolean; label?: string; soon?: boolean; partner?: string; buyUrl?: string }) {
  const { add } = useBag();
  const [done, setDone] = useState(false);
  const cls = `addbar${big ? " big" : ""}`;
  if (partner === "alastin") {
    if (buyUrl) return <a className={`${cls} ext`} href={buyUrl} target="_blank" rel="noopener noreferrer">Shop at ALASTIN Skincare® ↗</a>;
    return <button type="button" className={`${cls} soon`} disabled aria-disabled="true" title="Our ALASTIN partner store link is on its way">Available soon at ALASTIN Skincare®</button>;
  }
  if (soon) return <button type="button" className={`${cls} soon`} disabled aria-disabled="true" title="Coming soon">Coming soon</button>;
  return (
    <button type="button" className={`${cls}${done ? " done" : ""}`} onClick={() => { add(slug); setDone(true); setTimeout(() => setDone(false), 1400); }}>
      {done ? "Added ✓" : label}
    </button>
  );
}
