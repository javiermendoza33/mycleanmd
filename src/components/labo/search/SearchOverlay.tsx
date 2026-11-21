"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { KIND_LABEL, searchSite } from "@/labo/clinic/search-index";
import { useSearchOpen } from "./search-state";

/** The search overlay, mounted once per clinic layout (same spot as BagDrawer). A query matches
 *  against each service/treatment/product's name, brand, tagline and a few extra keywords
 *  (see search-index.ts) — plain substring match, which is plenty for ~35 catalog items. */
export default function SearchOverlay() {
  const { open, setOpen } = useSearchOpen();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; clearTimeout(t); };
  }, [open, setOpen]);
  useEffect(() => { if (!open) setQ(""); }, [open]);

  if (!open) return null;
  const hits = searchSite(q);
  return (
    <div className="searchwrap" role="dialog" aria-modal="true" aria-label="Search">
      <div className="searchbg" onClick={() => setOpen(false)} />
      <div className="searchpanel">
        <div className="searchbar">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
            <line x1="12.4" y1="12.4" x2="17" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search services, treatments and products…"
            aria-label="Search services, treatments and products"
          />
          <button type="button" className="x" onClick={() => setOpen(false)} aria-label="Close search">✕</button>
        </div>
        {q.trim() && (
          <ul className="searchresults">
            {hits.length === 0 ? (
              <li className="searchempty">
                <p className="sub">Nothing found for &ldquo;{q}&rdquo;. Try a treatment name like &ldquo;Botox&rdquo; or a product like &ldquo;sunscreen&rdquo;.</p>
              </li>
            ) : (
              hits.map((h) => (
                <li key={h.kind + h.href}>
                  <Link href={h.href} onClick={() => setOpen(false)}>
                    <span className="srkind">{KIND_LABEL[h.kind]}</span>
                    <b>{h.title}</b>
                    {h.subtitle && <span className="srsub">{h.subtitle}</span>}
                    <p>{h.blurb}</p>
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
