"use client";
/* Peptide chains — the moving background behind the Method's hero (Nov 27 2026, Javier: "i like the little animation too in
   background of flexpa so maybe we can incorporate something like that but different" → "Daylight Sage with Peptide Chains").
   Short strings of linked beads drift slowly; when the end of one chain passes near the head of another a faint bond appears
   between them and fades as they part, like amino acids joining. One canvas, a handful of chains, drawn in the accent colour
   at low strength so the text above it stays the loudest thing in the hero.
   Quiet by design: it does not run for prefers-reduced-motion (one still frame instead), while the hero is off screen, while
   the tab is hidden, or after the visitor presses Pause (remembered in localStorage "labo-bg"). */
import { useEffect, useRef, useState } from "react";
import { mc, type Lang } from "@/labo/method/i18n";

type Node = { x: number; y: number };
type Chain = { nodes: Node[]; heading: number; turn: number; speed: number; tone: number };
const SEG = 26;          // distance between beads, px
const BOND = 78;         // two chain ends closer than this show a bond

function makeChains(w: number, h: number): Chain[] {
  const count = w < 700 ? 6 : Math.min(14, Math.round((w * h) / 70000));
  return Array.from({ length: count }, () => {
    const heading = Math.random() * Math.PI * 2, len = 4 + Math.floor(Math.random() * 5);
    const x = Math.random() * w, y = Math.random() * h;
    return {
      nodes: Array.from({ length: len }, (_, i) => ({ x: x - Math.cos(heading) * SEG * i, y: y - Math.sin(heading) * SEG * i })),
      heading, turn: (Math.random() - 0.5) * 0.3, speed: 7 + Math.random() * 9, tone: 0.55 + Math.random() * 0.45,
    };
  });
}

export function PeptideField({ lang = "en" }: { lang?: Lang }) {
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
    let w = 0, h = 0, chains: Chain[] = [], raf = 0, last = 0, visible = true;

    const size = () => {
      const r = el.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!chains.length || Math.abs(chains.length - makeChains(w, h).length) > 2) chains = makeChains(w, h);
    };
    const step = (dt: number) => {
      const m = SEG * 9;   // how far past the edge a chain travels before it comes back in on the other side
      for (const c of chains) {
        c.turn += (Math.random() - 0.5) * 0.5 * dt; c.turn = Math.max(-0.35, Math.min(0.35, c.turn));
        c.heading += c.turn * dt;
        const head = c.nodes[0];
        head.x += Math.cos(c.heading) * c.speed * dt; head.y += Math.sin(c.heading) * c.speed * dt;
        let dx = 0, dy = 0;
        if (head.x < -m) dx = w + 2 * m; else if (head.x > w + m) dx = -(w + 2 * m);
        if (head.y < -m) dy = h + 2 * m; else if (head.y > h + m) dy = -(h + 2 * m);
        if (dx || dy) for (const n of c.nodes) { n.x += dx; n.y += dy; }
        for (let i = 1; i < c.nodes.length; i++) {   // each bead follows the one ahead at a fixed distance
          const a = c.nodes[i - 1], b = c.nodes[i], ex = b.x - a.x, ey = b.y - a.y, d = Math.hypot(ex, ey) || 1;
          b.x = a.x + (ex / d) * SEG; b.y = a.y + (ey / d) * SEG;
        }
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (let i = 0; i < chains.length; i++) for (let j = 0; j < chains.length; j++) {   // bonds between a tail and another head
        if (i === j) continue;
        const a = chains[i].nodes[chains[i].nodes.length - 1], b = chains[j].nodes[0], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < BOND) { ctx.strokeStyle = `rgba(${rgb},${(0.34 * (1 - d / BOND)).toFixed(3)})`; ctx.lineWidth = 1.2; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      ctx.setLineDash([]);
      for (const c of chains) {
        ctx.strokeStyle = `rgba(${rgb},${(0.2 * c.tone).toFixed(3)})`; ctx.lineWidth = 1.4;
        ctx.beginPath(); c.nodes.forEach((n, i) => (i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y))); ctx.stroke();
        c.nodes.forEach((n, i) => {
          const key = i % 3 === 0;
          ctx.fillStyle = `rgba(${rgb},${((key ? 0.5 : 0.26) * c.tone).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, key ? 4.4 : 3.1, 0, Math.PI * 2); ctx.fill();
        });
      }
    };
    const frame = (now: number) => {
      raf = 0;
      if (pausedRef.current || !visible || document.hidden) { last = 0; return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      step(dt); draw(); raf = requestAnimationFrame(frame);
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
