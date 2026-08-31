"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, PROGRAMS, PRACTICE, HEALTHIE, FOOTER_BLURB, FOOTER_DISCLAIMER } from "@/labo/content";

/**
 * Header and footer for The Labo Method.
 *
 * The prototype drove everything from one `page` string; the handoff is
 * explicit that this must not carry over — the site's whole job is organic
 * discovery, so these are real links to real routes and the active state comes
 * from usePathname().
 *
 * The handoff also flags the prototype's accessibility gaps as things to fix
 * rather than reproduce: the Programs toggle and the drawer are real <button>s
 * with aria-expanded, both close on Escape and on outside click, and every
 * external CTA carries rel="noopener noreferrer".
 */

function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <span>
      <span className="mark-name" style={onDark ? { color: "var(--bone)" } : undefined}>
        {PRACTICE.name}
      </span>
      <span className="mark-sub">{PRACTICE.subline}</span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [progOpen, setProgOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const onProgram = pathname.startsWith("/programs");

  // Close both panels on navigation — the prototype closed the mega-panel on
  // any nav item; with real routing the pathname change is the signal.
  useEffect(() => { setProgOpen(false); setDrawer(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setProgOpen(false); setDrawer(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // The drawer is fixed and full-height; leaving the page scrollable behind it
  // lets a touch drag scroll the wrong layer.
  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [drawer]);

  return (
    <header className="hdr">
      <div className="hdr-row">
        <Link className="hdr-mark" href="/" aria-label={`${PRACTICE.name} — home`}>
          <Wordmark />
        </Link>

        <nav className="hdr-nav" aria-label="Primary">
          <button
            type="button"
            className={onProgram ? "on on-prog" : undefined}
            aria-expanded={progOpen}
            aria-controls="labo-programs"
            onClick={() => setProgOpen((v) => !v)}
          >
            Programs<span className="caret" aria-hidden="true">▾</span>
          </button>
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "on" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hdr-act">
          <a className="hdr-login" href={HEALTHIE.login} target="_blank" rel="noopener noreferrer">
            Log in
          </a>
          <a className="btn btn-pine hdr-cta" href={HEALTHIE.intake} target="_blank" rel="noopener noreferrer">
            Get started
          </a>
          <button
            type="button"
            className="drawer-btn"
            aria-expanded={drawer}
            aria-controls="labo-drawer"
            onClick={() => setDrawer((v) => !v)}
          >
            {drawer ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {progOpen && (
        <div className="mega" id="labo-programs">
          <div className="mega-grid">
            {PROGRAMS.map((p) => (
              <Link key={p.slug} className="mega-cell" href={`/programs/${p.slug}`}>
                <span className="mega-i">{p.index}</span>
                <span className="mega-t">{p.name}</span>
                <span className="mega-b">{p.navBlurb}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {drawer && (
        <div className="drawer" id="labo-drawer">
          <span className="d-label">Programs</span>
          {PROGRAMS.map((p) => (
            <Link key={p.slug} href={`/programs/${p.slug}`}>{p.name}</Link>
          ))}
          <span className="d-label">Practice</span>
          {NAV.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
          <div className="drawer-cta">
            <a className="btn btn-pine" href={HEALTHIE.intake} target="_blank" rel="noopener noreferrer">
              Get started
            </a>
            <a className="btn btn-outline" href={HEALTHIE.login} target="_blank" rel="noopener noreferrer">
              Log in
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot-cols">
        <div>
          <Wordmark onDark />
          <p className="foot-blurb">{FOOTER_BLURB}</p>
          <a
            className="btn btn-ghost"
            href={HEALTHIE.login}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: 24 }}
          >
            Log in
          </a>
        </div>
        <div>
          <div className="foot-label">Programs</div>
          <ul className="foot-list">
            {PROGRAMS.map((p) => (
              <li key={p.slug}><Link href={`/programs/${p.slug}`}>{p.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="foot-label">Practice</div>
          <ul className="foot-list">
            <li><Link href="/how-it-works">How it works</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/about">About the provider</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="foot-label">Legal</div>
          {/* Handoff open item #12: privacy, terms and telehealth consent are
              separate documents that do not exist yet. Until they do, one
              honest link beats four that all resolve to the same page. */}
          <ul className="foot-list">
            <li><Link href="/legal">Disclaimers &amp; notices</Link></li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <div className="foot-bottom-in">
          <span>© {new Date().getFullYear()} {PRACTICE.name}. {PRACTICE.domain}</span>
          <span>{FOOTER_DISCLAIMER}</span>
        </div>
      </div>
    </footer>
  );
}
