"use client";

import { useState } from "react";
import { useBag } from "./bag";

export default function AddToBag({ slug, big, label = "Add to bag" }: { slug: string; big?: boolean; label?: string }) {
  const { add } = useBag();
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={`addbar${big ? " big" : ""}${done ? " done" : ""}`} onClick={() => { add(slug); setDone(true); setTimeout(() => setDone(false), 1400); }}>
      {done ? "Added ✓" : label}
    </button>
  );
}
