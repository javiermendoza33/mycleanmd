"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV } from "@/labo/content";
import { CLINIC_SITE } from "@/labo/clinic/site";

/** Phone menu (Nov 18 2026, Javier: "is this mobile friendly"). The main nav hides under 880px; this
 *  button opens a sheet with the same links plus the phone line. Hidden on desktop by CSS. */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);
  return (
    <>
      <button type="button" className="mnav-btn" aria-expanded={open} aria-controls="mnav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">{open ? "✕" : "☰"}</span>
      </button>
      {open && (
        <nav id="mnav" className="mnav" aria-label="Menu">
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          {NAV.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
          <Link className="btn btn-primary" href="/booking" onClick={() => setOpen(false)}>Book now</Link>
          <p className="note">Text or call <a href={CLINIC_SITE.tel}>{CLINIC_SITE.phoneDisplay}</a></p>
        </nav>
      )}
    </>
  );
}
