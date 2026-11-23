"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Accessibility widget (Nov 22 2026, Javier: "why don't I see this little guy" — the floating universal-access button).
 * Our own, not a third-party overlay: a fixed button bottom-left opens a small dialog with display preferences that are
 * applied as data attributes on <html> (labo.css reacts to them) and remembered in localStorage. Nothing here replaces
 * the real WCAG work on the pages; it's the visitor's own knobs — text size, contrast, link underlines, a plainer font,
 * paused motion — plus a link to the statement.
 */
const KEY = "labo-a11y";
type Prefs = { text: 0 | 1 | 2; contrast: boolean; links: boolean; font: boolean; motion: boolean };
const DEF: Prefs = { text: 0, contrast: false, links: false, font: false, motion: false };

/** Runs before hydration so the saved preferences apply on first paint (no flash). Keep in sync with apply(). */
const BOOT = `try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(KEY)})||"{}"),h=document.documentElement;if(p.text)h.setAttribute("data-a11y-text",String(p.text));["contrast","links","font","motion"].forEach(function(k){if(p[k])h.setAttribute("data-a11y-"+k,"1")})}catch(e){}`;

function apply(p: Prefs) {
  const h = document.documentElement;
  if (p.text) h.setAttribute("data-a11y-text", String(p.text)); else h.removeAttribute("data-a11y-text");
  (["contrast", "links", "font", "motion"] as const).forEach((k) => { if (p[k]) h.setAttribute(`data-a11y-${k}`, "1"); else h.removeAttribute(`data-a11y-${k}`); });
  try { if (JSON.stringify(p) === JSON.stringify(DEF)) localStorage.removeItem(KEY); else localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

export default function A11yWidget() {
  const [open, setOpen] = useState(false);
  const [p, setP] = useState<Prefs>(DEF);
  const btn = useRef<HTMLButtonElement>(null); const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(KEY) || "{}"); setP({ ...DEF, ...s }); } catch {} }, []);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    const onDown = (e: MouseEvent) => { if (!panel.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey); document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [open]);
  const cur = useRef(p); cur.current = p;
  // Build from a ref, not the render closure, so two quick changes (or a scripted pair) never overwrite each other.
  const set = (n: Partial<Prefs>) => { const next = { ...cur.current, ...n }; cur.current = next; setP(next); apply(next); };
  const active = p.text > 0 || p.contrast || p.links || p.font || p.motion;
  // A plain function, not a nested component: a component type created per render would remount on every click and
  // drop keyboard focus from the toggle that was just pressed.
  const toggle = (k: "contrast" | "links" | "font" | "motion", label: string, hint: string) => (
    <button key={k} type="button" className="a11y-opt" aria-pressed={p[k]} onClick={() => set({ [k]: !p[k] } as Partial<Prefs>)}>
      <span className="a11y-sw" aria-hidden="true" /><span><b>{label}</b><small>{hint}</small></span>
    </button>
  );
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      <button ref={btn} type="button" className={`a11y-btn${active ? " active" : ""}`} aria-expanded={open} aria-controls="a11y-panel" aria-label="Accessibility options" title="Accessibility options" onClick={() => setOpen((v) => !v)}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10.5" />
          <circle cx="12" cy="7" r="1.4" fill="currentColor" stroke="none" />
          <path d="M6.5 9.6c3.6.9 7.4.9 11 0M12 10.2v4.2m0 0-2.4 5.2M12 14.4l2.4 5.2" />
        </svg>
      </button>
      <div id="a11y-panel" ref={panel} className="a11y-panel" role="dialog" aria-label="Accessibility options" hidden={!open}>
        <div className="a11y-head"><b>Accessibility</b><button type="button" className="x" aria-label="Close" onClick={() => { setOpen(false); btn.current?.focus(); }}>×</button></div>
        <div className="a11y-row" role="group" aria-label="Text size">
          <span><b>Text size</b><small>{p.text === 0 ? "Normal" : p.text === 1 ? "Larger" : "Largest"}</small></span>
          <span className="a11y-step">
            <button type="button" aria-label="Smaller text" disabled={p.text === 0} onClick={() => set({ text: (p.text - 1) as Prefs["text"] })}>A−</button>
            <button type="button" aria-label="Larger text" disabled={p.text === 2} onClick={() => set({ text: (p.text + 1) as Prefs["text"] })}>A+</button>
          </span>
        </div>
        {toggle("contrast", "High contrast", "Darker text, stronger lines")}
        {toggle("links", "Underline links", "Every link gets an underline")}
        {toggle("font", "Plain font", "A simpler typeface with wider spacing")}
        {toggle("motion", "Pause motion", "Stops the moving ticker and animations")}
        <div className="a11y-foot">
          <button type="button" className="linkbtn" disabled={!active} onClick={() => set(DEF)}>Reset</button>
          <Link href="/accessibility" onClick={() => setOpen(false)}>Our accessibility statement</Link>
        </div>
      </div>
    </>
  );
}
