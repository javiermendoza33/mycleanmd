"use client";

import { useCallback, useEffect, useState } from "react";
import { getProduct } from "@/labo/clinic/products";

/** The bag (Nov 19 2026): a localStorage list of {slug, qty}, shared across tabs and components by a window event.
 *  Nothing server-side — the checkout route re-prices every line from the catalog, so the stored list is just intent. */
export type Line = { slug: string; qty: number };
const KEY = "labo-bag", EV = "labo-bag", OPEN = "labo-bag-open";

function read(): Line[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((l) => l && typeof l.slug === "string" && Number(l.qty) > 0 && getProduct(l.slug)).map((l) => ({ slug: l.slug, qty: Math.min(10, Math.floor(Number(l.qty))) })) : [];
  } catch { return []; }
}
function write(lines: Line[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode: the bag lives for the page only */ }
  window.dispatchEvent(new CustomEvent(EV));
}
export const openBag = () => window.dispatchEvent(new CustomEvent(OPEN));

export function useBag() {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const sync = () => setLines(read());
    const show = () => setOpen(true);
    sync();
    if (window.location.hash === "#bag") setOpen(true);   // /shop#bag opens the drawer (links, and the headless preview)
    window.addEventListener(EV, sync); window.addEventListener("storage", sync); window.addEventListener(OPEN, show);
    return () => { window.removeEventListener(EV, sync); window.removeEventListener("storage", sync); window.removeEventListener(OPEN, show); };
  }, []);
  const add = useCallback((slug: string, qty = 1) => {
    const l = read(); const i = l.findIndex((x) => x.slug === slug);
    if (i >= 0) l[i].qty = Math.min(10, l[i].qty + qty); else l.push({ slug, qty });
    write(l); openBag();
  }, []);
  const set = useCallback((slug: string, qty: number) => { write(read().map((x) => (x.slug === slug ? { ...x, qty } : x)).filter((x) => x.qty > 0)); }, []);
  const clear = useCallback(() => write([]), []);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
  return { lines, count, subtotal, add, set, clear, open, setOpen };
}
