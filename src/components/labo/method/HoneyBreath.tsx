"use client";
/* Spot breathing on the honeycomb (Nov 27 2026, Javier: "could you do a bit of spot breathing on the honeycomb?").
   The Method's page background is a static honeycomb (method.css). This lays a sparse scatter of single cells over it, each
   one sitting exactly on a cell of the pattern and slowly fading in and out on its own rhythm — a few cells "breathing" here and
   there, never the whole grid. Each spot is one small element animated on opacity only, so the browser does it on the
   compositor; nothing runs for prefers-reduced-motion (the CSS hides the layer).
   The numbers below MUST match the tile in method.css: cell radius 17px → tile 29.44 × 51px. */
import { useEffect, useRef, useState } from "react";

const R = 17, W = R * Math.sqrt(3), H = 3 * R;          // cell radius, tile width, tile height
type Spot = { x: number; y: number; d: number; w: number; o: number };

function scatter(width: number, height: number): Spot[] {
  const count = Math.min(170, Math.round((width * height) / 52000));
  const cols = Math.ceil(width / W), rows = Math.ceil(height / H), seen = new Set<string>(), out: Spot[] = [];
  for (let i = 0; i < count * 3 && out.length < count; i++) {
    const offset = Math.random() < 0.5, k = Math.floor(Math.random() * cols), m = Math.floor(Math.random() * rows), key = `${offset}:${k}:${m}`;
    if (seen.has(key)) continue; seen.add(key);
    const cx = offset ? k * W : W / 2 + k * W, cy = offset ? 2.5 * R + m * H : R + m * H;   // the two interleaved rows of cell centres
    out.push({ x: cx - W / 2, y: cy - R, d: 6 + Math.random() * 7, w: -Math.random() * 13, o: 0.04 + Math.random() * 0.06 });   // peak strength 4–10%: "lightly" (the first pass, 7–18%, was too present)
  }
  return out;
}

export function HoneyBreath() {
  const el = useRef<HTMLDivElement>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  useEffect(() => {
    const node = el.current; if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0, timer = 0;
    const lay = () => { const r = node.getBoundingClientRect(); if (Math.abs(r.height - last) < 400 && last) return; last = r.height; setSpots(scatter(r.width, r.height)); };
    const ro = new ResizeObserver(() => { clearTimeout(timer); timer = window.setTimeout(lay, 250); });   // the page grows as it loads; re-scatter once it settles
    ro.observe(node);
    return () => { ro.disconnect(); clearTimeout(timer); };
  }, []);
  return (
    <div ref={el} className="hbreath" aria-hidden="true">
      {spots.map((s, i) => <i key={i} style={{ left: s.x, top: s.y, ["--d" as string]: `${s.d.toFixed(1)}s`, ["--w" as string]: `${s.w.toFixed(1)}s`, ["--o" as string]: s.o.toFixed(2) }} />)}
    </div>
  );
}
