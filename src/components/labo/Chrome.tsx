"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, PROGRAMS, PRACTICE, HEALTHIE } from "@/labo/content";

/**
 * Header and footer for The Labo Method inner pages — the White Room system.
 *
 * The prototype's header carries in-page anchors and the homepage keeps that
 * inline (port it, don't reinterpret it); these are the same bar and footer
 * with real routes for the pages that live off the homepage. Like the
 * prototype, the nav simply hides on small screens — the footer is the full
 * site map, which is also how the reference design navigates on mobile.
 */

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Header() {
  const pathname = usePathname();
  return (
    <header className="site">
      <div className="wrap bar">
        <Link className="brand" href="/" aria-label={`${PRACTICE.name} — home`}>
          {PRACTICE.name}
        </Link>
        <nav className="main" aria-label="Primary">
          <Link href="/#programs" className={pathname.startsWith("/programs") ? "on" : undefined}>
            Programs
          </Link>
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "on" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <a className="btn btn-ghost btn-sm" href={HEALTHIE.login} {...ext}>Patient login</a>
      </div>
    </header>
  );
}

/** The homepage prototype's footer, shared by every page. */
export function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="fnav">
          <div>
            <h5>Programs</h5>
            <ul>
              {PROGRAMS.map((p) => (
                <li key={p.slug}><Link href={`/programs/${p.slug}`}>{p.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Practice</h5>
            <ul>
              <li><Link href="/about">About the provider</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/how-it-works">How it works</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><a href={`mailto:${PRACTICE.email}`}>{PRACTICE.email}</a></li>
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul>
              {/* NPP, privacy policy and terms do not exist yet (handoff §10) — /legal carries the disclaimers until they do */}
              <li><Link href="/legal">Notice of Privacy Practices</Link></li>
              <li><Link href="/legal">Privacy policy</Link></li>
              <li><Link href="/legal">Terms of service</Link></li>
              <li><Link href="/legal">Disclaimers &amp; notices</Link></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <p>This website is for general information and is not medical advice. A patient relationship begins only after intake, a completed clinical evaluation and a documented visit. Clinical services are provided by a nurse practitioner licensed in California and Washington; patients must be physically located in one of these states at the time of each visit.</p>
          <p>Some medications prescribed through this practice are compounded by state-licensed pharmacies and are not reviewed or approved by the FDA. Certain peptides are prescribed for uses that are not FDA-approved; evidence quality varies by agent. Testosterone is a Schedule III controlled substance. Individual results vary and no outcome is guaranteed.</p>
          <p>Email and web forms are not secure channels. Do not send clinical information through them. If this is an emergency, call 911.</p>
        </div>
      </div>
    </footer>
  );
}
