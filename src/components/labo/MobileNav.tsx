"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { NAV, TELE_LINK } from "@/labo/content";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { openBag } from "@/components/labo/shop/bag";
import { openSearch } from "@/components/labo/search/search-state";

/** Phone menu (Nov 18 2026, Javier: "is this mobile friendly"). The main nav hides under 880px; this
 *  button opens a sheet with the same links plus the phone line. Hidden on desktop by CSS. */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [top, setTop] = useState(64);   // Nov 19 2026: the promo bar sits above the header, so the sheet starts under the header's real bottom edge
  // The sheet is position:fixed, but header.site has a backdrop-filter, which makes the header its containing
  // block — so it is portalled out to the [data-labo] root (still inside the styling scope).
  useEffect(() => { setHost(((document.querySelector("[data-clinic]") ?? document.querySelector("[data-labo]")) as HTMLElement | null) ?? document.body); }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);
  return (
    <>
      <button type="button" className="mnav-btn" aria-expanded={open} aria-controls="mnav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => { const h = document.querySelector("header.site"); if (h) setTop(Math.round(h.getBoundingClientRect().bottom)); setOpen((o) => !o); }}>
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>
      {open && host && createPortal(
        <nav id="mnav" className="mnav" aria-label="Menu" style={{ top }}>
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          {NAV.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
          <a className="telelink" href={TELE_LINK.href}>{TELE_LINK.label} <small>weight loss &amp; peptides, by video</small></a>
          <button type="button" className="mbag" onClick={() => { setOpen(false); openSearch(); }}>Search</button>
          <button type="button" className="mbag" onClick={() => { setOpen(false); openBag(); }}>Your bag</button>
          <Link className="btn btn-primary" href="/booking" onClick={() => setOpen(false)}>Book now</Link>
          <p className="note">Text or call <a href={CLINIC_SITE.tel}>{CLINIC_SITE.phoneDisplay}</a></p>
        </nav>,
        host,
      )}
    </>
  );
}
