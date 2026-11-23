"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { METHOD, METHOD_NAV, PROGRAMS, HEALTHIE, PRACTICE, FOOTER_DISCLAIMER, AVAILABILITY } from "@/labo/content";
import { Logo } from "@/components/labo/Logo";

/**
 * Header and footer for The Labo Method (thelabomethod.com) — rebuilt Nov 22 2026 on the joinmochi.com pattern
 * (Javier: "revamp totally to look more like this"): a one-line promo, a floating white pill header (wordmark,
 * nav, Sign in, Get started), a phone sheet, and a dark footer that ends in the wordmark. Styles in method.css.
 * Separate brand from The Labo Clinic — nothing here touches [data-clinic].
 */
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function MethodHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const on = (href: string) => pathname === href || pathname.startsWith(href + "/");
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="mpromo" role="region" aria-label="Notice">Licensed for {AVAILABILITY} residents · one monthly fee, cancel any month · <Link href="/pricing">See pricing →</Link></div>
      <header className="mhead">
        <div className="pill">
          <Link className="brand" href="/" aria-label={`${METHOD.name} — home`}><Logo variant="method" name={METHOD.name} /></Link>
          <nav className="mlinks" aria-label="Primary">
            {METHOD_NAV.map((l) => <Link key={l.href} href={l.href} className={on(l.href) ? "on" : undefined}>{l.label}</Link>)}
          </nav>
          <Link className="signin" href="/signin">Sign in</Link>
          <Link className="btn btn-primary btn-sm" href="/programs">Get started</Link>
          <button type="button" className="mburger" aria-expanded={open} aria-controls="msheet" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>{open ? "×" : "☰"}</button>
        </div>
        <nav id="msheet" className="msheet" aria-label="Menu" hidden={!open}>
          {METHOD_NAV.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          <div className="sep" />
          <Link href="/signin">Sign in</Link>
          <a href={`https://${PRACTICE.domain}`}>{PRACTICE.name} (in person) ↗</a>
          <div className="acts"><Link className="btn btn-primary" href="/programs">Get started</Link></div>
        </nav>
      </header>
    </>
  );
}

export function MethodFooter() {
  return (
    <footer className="mfoot">
      <div className="wrap">
        <div className="cols">
          <div><h2>Care designed around your numbers.</h2><p style={{ marginTop: 12, fontSize: ".86rem", color: "#8B98B3" }}>By video, for residents of {AVAILABILITY}.</p></div>
          <div>
            <p className="k">Programs</p>
            <ul>{PROGRAMS.map((p) => <li key={p.slug}><Link href={`/programs/${p.slug}`}>{p.name}</Link></li>)}</ul>
          </div>
          <div>
            <p className="k">Learn</p>
            <ul>
              {METHOD_NAV.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
              <li><Link href="/legal">Legal</Link></li>
            </ul>
          </div>
          <div>
            <p className="k">Patients</p>
            <ul>
              <li><Link href="/signin">Sign in</Link></li>
              <li><Link href={HEALTHIE.book}>Book a consult</Link></li>
              <li><Link href="/programs">Start an intake</Link></li>
              <li><a href={`mailto:${METHOD.email}`}>{METHOD.email}</a></li>
            </ul>
          </div>
          <div>
            <p className="k">In person</p>
            <ul>
              <li><a href={`https://${PRACTICE.domain}`}>{PRACTICE.name} ↗</a></li>
              <li><a href={`https://${PRACTICE.domain}/services`}>Injectables &amp; laser</a></li>
              <li><a href={`https://${PRACTICE.domain}/shop`}>Skincare shop</a></li>
            </ul>
          </div>
        </div>
        <div className="mark" aria-hidden="true">{METHOD.name}</div>
        <div className="legal">
          <p>{FOOTER_DISCLAIMER}</p>
          <div className="row"><span>© {new Date().getFullYear()} {METHOD.name}. All rights reserved.</span><span><Link href="/legal">Legal</Link> · <a href={`https://${PRACTICE.domain}/privacy-policy`}>Privacy policy</a> · <a href={`https://${PRACTICE.domain}/accessibility`}>Accessibility</a></span></div>
        </div>
      </div>
    </footer>
  );
}
