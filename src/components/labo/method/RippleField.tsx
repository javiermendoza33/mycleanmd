"use client";
/* Slow ripples — the moving background behind the Method's hero (Nov 27 2026). Javier first chose peptide chains from the
   colour-directions PDF, then: "lets try Slow ripples instead, i dont like the peptide chains". A few fixed points around the
   edges of the hero each send out a soft ring every few seconds; the ring widens and fades, like a slow pulse. One canvas, drawn
   in the accent colour at low strength so the text stays the loudest thing in the hero. The points sit away from the headline
   column on purpose.
   Quiet by design: it does not run for prefers-reduced-motion (one still frame instead), while the hero is off screen, while
   the tab is hidden, or after the visitor presses Pause (remembered in localStorage "labo-bg"). */
import { useEffect, useRef, useState } from "react";
import { mc, type Lang } from "@/labo/method/i18n";

/** Where the ripples start, as fractions of the hero's width and height, with each one's size and timing offset. */
const SOURCES = [
  { x: 0.04, y: 0.30, r: 210, phase: 0.0 },
  { x: 0.47, y: 0.06, r: 170, phase: 0.45 },
  { x: 0.96, y: 0.22, r: 230, phase: 0.2 },
  { x: 0.52, y: 0.97, r: 190, phase: 0.7 },
  { x: 0.985, y: 0.86, r: 250, phase: 0.55 },
  { x: 0.20, y: 1.0, r: 180, phase: 0.85 },
];
const PERIOD = 10;   // seconds for one ring to travel from the point to its full size
const RINGS = 3;     // rings in flight per point

export function RippleField({ lang = "en" }: { lang?: Lang }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const kick = useRef<() => void>(() => {});
  const t = mc(lang).t.bg;

  useEffect(() => {
    const el = canvas.current; if (!el) return;
    const ctx = el.getContext("2d"); if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rgb = getComputedStyle(el).getPropertyValue("--accent-rgb").trim() || "31,107,74";
    let w = 0, h = 0, raf = 0, last = 0, clock = 3.3, visible = true;

    const size = () => {
      const r = el.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const small = w < 700, scale = small ? 0.62 : 1;
      SOURCES.forEach((s, i) => {
        if (small && i % 2) return;   // phones: every other point, smaller rings
        const cx = s.x * w, cy = s.y * h;
        for (let k = 0; k < RINGS; k++) {
          const p = (((clock / PERIOD + s.phase + k / RINGS) % 1) + 1) % 1;   // 0 at the point → 1 at full size
          const alpha = 0.3 * Math.pow(1 - p, 1.5) * Math.min(1, p * 8);       // fades out as it widens, eases in at birth
          if (alpha < 0.004) continue;
          ctx.strokeStyle = `rgba(${rgb},${alpha.toFixed(3)})`; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.arc(cx, cy, 6 + p * s.r * scale, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.fillStyle = `rgba(${rgb},0.4)`; ctx.beginPath(); ctx.arc(cx, cy, 3.2, 0, Math.PI * 2); ctx.fill();
      });
    };
    const frame = (now: number) => {
      raf = 0;
      if (pausedRef.current || !visible || document.hidden) { last = 0; return; }
      clock += last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      draw(); raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !reduced) raf = requestAnimationFrame(frame); };
    kick.current = start;

    size(); draw();
    let off = false; try { off = localStorage.getItem("labo-bg") === "off"; } catch {}
    if (off) { pausedRef.current = true; requestAnimationFrame(() => setPaused(true)); }
    start();
    const ro = new ResizeObserver(() => { size(); draw(); }); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }); io.observe(el);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  const toggle = () => {
    const next = !pausedRef.current; pausedRef.current = next; setPaused(next);
    try { localStorage.setItem("labo-bg", next ? "off" : "on"); } catch {}
    if (!next) kick.current();
  };
  return (
    <>
      <canvas ref={canvas} className="pfield" aria-hidden="true" />
      <button type="button" className="pfield-toggle" aria-pressed={paused} onClick={toggle}><span aria-hidden="true">{paused ? "▶" : "❚❚"}</span>{paused ? t.play : t.pause}</button>
    </>
  );
}
