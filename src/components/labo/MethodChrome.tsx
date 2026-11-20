"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { METHOD, METHOD_NAV, PROGRAMS, HEALTHIE, PRACTICE, FOOTER_DISCLAIMER } from "@/labo/content";

/**
 * Header and footer for The Labo Method (telehealth) — a SEPARATE brand from
 * The Labo Clinic, split out Nov 19 2026. Lives on its own subdomain
 * (method.thelabomethod.com) but shares this repo's fonts/analytics via the
 * nearest /labo layout; it does NOT get [data-clinic], so it renders the
 * original Apple-blue "White Room" tokens instead of the clinic's clay
 * storefront look — the simplest honest way to look like a different brand.
 */
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function MethodHeader() {
  const pathname = usePathname();
  return (
    <header className="site">
      <div className="wrap bar">
        <Link className="brand" href="/" aria-label={`${METHOD.name} — home`}>{METHOD.name}</Link>
        <nav className="main" aria-label="Primary">
          {METHOD_NAV.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href || pathname.startsWith(l.href + "/") ? "on" : undefined}>{l.label}</Link>
          ))}
        </nav>
        <a className="more" href={HEALTHIE.login} {...ext} style={{ fontSize: ".8rem" }}>Patient login</a>
        <Link className="btn btn-primary btn-sm" href="/programs">Get started</Link>
      </div>
    </header>
  );
}

export function MethodFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="fnav fnav4">
          <div>
            <h5>Explore</h5>
            <ul>
              <li><Link href="/">Home</Link></li>
              {METHOD_NAV.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
              <li><Link href="/legal">Legal</Link></li>
            </ul>
          </div>
          <div>
            <h5>Programs</h5>
            <ul>
              {PROGRAMS.map((p) => <li key={p.slug}><Link href={`/programs/${p.slug}`}>{p.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h5>Patients</h5>
            <ul>
              <li><a href={HEALTHIE.login} {...ext}>Patient login</a></li>
              <li><a href={HEALTHIE.book} {...ext}>Book a consult</a></li>
              <li><Link href="/programs">Start an intake</Link></li>
            </ul>
          </div>
          <div>
            <h5>Also from us</h5>
            <ul>
              <li><a href={`https://${PRACTICE.domain}`}>{PRACTICE.name} ↗<br /><span style={{ fontSize: ".78rem", color: "var(--muted)" }}>In-person, Seattle</span></a></li>
              <li><a href={`mailto:${METHOD.email}`}>{METHOD.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <p>© {new Date().getFullYear()} {METHOD.name}. All rights reserved. · <Link href="/legal">Legal</Link></p>
          <p>{FOOTER_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
