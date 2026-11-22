"use client";

import { useState } from "react";
import { useBag } from "./bag";
import { PARTNER_NAME } from "@/labo/clinic/products";

/** The product's buy control. Three states: partner item with its unique link → outbound button to the partner
 *  store (new tab, no discount copy near it per MAP rules); partner item without a link yet, or `soon` → disabled;
 *  otherwise the bag. */
export default function AddToBag({ slug, big, label = "Add to bag", soon, partner, buyUrl }: { slug: string; big?: boolean; label?: string; soon?: boolean; partner?: string; buyUrl?: string }) {
  const { add } = useBag();
  const [done, setDone] = useState(false);
  const cls = `addbar${big ? " big" : ""}`;
  if (partner && PARTNER_NAME[partner]) {
    const brand = PARTNER_NAME[partner];
    if (buyUrl) return <a className={`${cls} ext`} href={buyUrl} target="_blank" rel="noopener noreferrer">Shop at {brand} ↗</a>;
    return <button type="button" className={`${cls} soon`} disabled aria-disabled="true" title={`Our ${brand} partner store link is on its way`}>Available soon at {brand}</button>;
  }
  if (soon) return <button type="button" className={`${cls} soon`} disabled aria-disabled="true" title="Coming soon">Coming soon</button>;
  return (
    <button type="button" className={`${cls}${done ? " done" : ""}`} onClick={() => { add(slug); setDone(true); setTimeout(() => setDone(false), 1400); }}>
      {done ? "Added ✓" : label}
    </button>
  );
}
