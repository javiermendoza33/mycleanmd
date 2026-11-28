"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { METHOD, HEALTHIE, PRACTICE, METHOD_OPEN } from "@/labo/content";
import { mc, lh, langOf, basePath, switchHref } from "@/labo/method/i18n";
import { Logo } from "@/components/labo/Logo";

/**
 * Header and footer for The Labo Method (thelabomethod.com) — rebuilt Nov 22 2026 on the joinmochi.com pattern
 * (Javier: "revamp totally to look more like this"): a one-line promo, a floating white pill header (wordmark,
 * nav, Sign in, Get started), a phone sheet, and a dark footer that ends in the wordmark. Styles in method.css.
 * Separate brand from The Labo Clinic — nothing here touches [data-clinic].
 *
 * Nov 27 2026 (Javier: "a button that switches in Spanish"): the chrome reads its language from the URL — anything
 * under /es is Spanish — and carries the switch (`LangSwitch`): the same page in the other language when it exists,
 * otherwise that language's home. Pages with no Spanish version yet keep their English links (see i18n.ts).
 */

/** Wraps the whole Method site so assistive tech and the browser know which language the page is in. */
export function MethodScope({ children }: { children: React.ReactNode }) {
  const lang = langOf(usePathname());
  return <div data-method lang={lang}>{children}</div>;
}

/** `current`: show the name of the language being read (the header pill and the phone notice chip, per the Nov 27 2026 review:
 *  on /es the pill reads "Español"); otherwise the link names the language it switches TO (menu row, footer). Either way one
 *  click goes to the other language, and the aria-label says so. */
function LangSwitch({ pathname, className, current = false }: { pathname: string; className: string; current?: boolean }) {
  const lang = langOf(pathname), t = mc(lang).t, other = lang === "es" ? "en" : "es";
  return (
    <Link className={className} href={switchHref(pathname)} hrefLang={other} lang={other} aria-label={t.switchAria}>
      <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" /></svg>
      <span className="full">{current ? t.langName : t.switchLabel}</span><span className="short">{t.switchShort}</span>
    </Link>
  );
}

export function MethodHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const lang = langOf(pathname), c = mc(lang), t = c.t, h = t.chrome;
  const L = (p: string) => lh(lang, p);
  const here = basePath(pathname);
  const on = (href: string) => here === href || here.startsWith(href + "/");
  return (
    <>
      <a className="skip" href="#main">{h.skip}</a>
      <div className="mpromo" role="region" aria-label={h.notice}>{METHOD_OPEN ? <>{h.promo(c.AVAILABILITY)}<Link href={L("/pricing")}>{h.promoLink}</Link></> : <><b className="soonpill">{t.soon.k}</b>{t.soon.promo(c.AVAILABILITY).replace(t.soon.k, "").replace(/^\s+/, "")}<Link href={L("/start")}>{t.soon.promoLink}</Link></>}<LangSwitch pathname={pathname} className="mlang-top" current /></div>
      <header className="mhead">
        <div className="pill">
          <Link className="brand" href={L("/")} aria-label={h.home(METHOD.name)}><Logo variant="method" name={METHOD.name} /></Link>
          <nav className="mlinks" aria-label={h.primary}>
            {c.NAV.map((l) => <Link key={l.href} href={L(l.href)} className={on(l.href) ? "on" : undefined}>{l.label}</Link>)}
          </nav>
          <LangSwitch pathname={pathname} className="mlang" current />
          <Link className="signin" href={L("/signin")}>{h.signIn}</Link>
          <Link className="btn btn-primary btn-sm" href={L("/start")}>{METHOD_OPEN ? t.getStarted : t.soon.cta}</Link>
          <button type="button" className="mburger" aria-expanded={open} aria-controls="msheet" aria-label={open ? h.closeMenu : h.openMenu} onClick={() => setOpen((v) => !v)}>{open ? "×" : "☰"}</button>
        </div>
        <nav id="msheet" className="msheet" aria-label={h.menu} hidden={!open}>
          {c.NAV.map((l) => <Link key={l.href} href={L(l.href)}>{l.label}</Link>)}
          <div className="sep" />
          <Link href={L("/signin")}>{h.signIn}</Link>
          <LangSwitch pathname={pathname} className="mlang-row" />
          <a href={`https://${PRACTICE.domain}`}>{h.inPerson(PRACTICE.name)}</a>
          <div className="acts"><Link className="btn btn-primary" href={L("/start")}>{METHOD_OPEN ? t.getStarted : t.soon.cta}</Link></div>
        </nav>
      </header>
    </>
  );
}

export function MethodFooter() {
  const pathname = usePathname();
  const lang = langOf(pathname), c = mc(lang), t = c.t, h = t.chrome;
  const L = (p: string) => lh(lang, p);
  return (
    <footer className="mfoot">
      <div className="wrap">
        <div className="cols">
          <div><h2>{h.footH}</h2><p style={{ marginTop: 12, fontSize: ".86rem", color: "#8FA396" }}>{h.footSub(c.AVAILABILITY)}</p></div>
          <div>
            <p className="k">{h.programs}</p>
            <ul>{c.PROGRAMS.map((p) => <li key={p.slug}><Link href={L(`/programs/${p.slug}`)}>{p.name}</Link></li>)}</ul>
          </div>
          <div>
            <p className="k">{h.learn}</p>
            <ul>
              {c.NAV.map((l) => <li key={l.href}><Link href={L(l.href)}>{l.label}</Link></li>)}
              {h.journal && <li><Link href="/blog">{h.journal}</Link></li>}
              <li><Link href="/legal">{h.legal}</Link></li>
              <li><Link href="/terms">{h.terms}</Link></li>
              <li><Link href="/privacy-policy">{h.privacy}</Link></li>
              <li><Link href="/sms">{h.sms}</Link></li>
              <li><Link href="/accessibility">{h.a11y}</Link></li>
            </ul>
          </div>
          <div>
            <p className="k">{h.patients}</p>
            <ul>
              <li><Link href={L("/signin")}>{h.signIn}</Link></li>
              <li><Link href={L(HEALTHIE.book)}>{h.book}</Link></li>
              <li><Link href={L("/programs")}>{h.startAnIntake}</Link></li>
              <li><a href={`mailto:${METHOD.email}`}>{METHOD.email}</a></li>
              <li><LangSwitch pathname={pathname} className="mlang-foot" /></li>
            </ul>
          </div>
          <div>
            <p className="k">{h.inPersonK}</p>
            <ul>
              <li><a href={`https://${PRACTICE.domain}`}>{PRACTICE.name} ↗</a></li>
              <li><a href={`https://${PRACTICE.domain}/services`}>{h.injectables}</a></li>
              <li><a href={`https://${PRACTICE.domain}/shop`}>{h.shop}</a></li>
            </ul>
          </div>
        </div>
        <div className="mark" aria-hidden="true">{METHOD.name}</div>
        <div className="legal">
          <p>{c.FOOTER_DISCLAIMER}{h.englishOnly && <> {h.englishOnly}</>}</p>
          <div className="row"><span>© {new Date().getFullYear()} {METHOD.name}. {h.rights}</span><span><Link href="/legal">{h.legalShort}</Link> · <Link href="/terms">{h.termsShort}</Link> · <Link href="/privacy-policy">{h.privacyShort}</Link> · <Link href="/sms">{h.smsShort}</Link> · <Link href="/accessibility">{h.a11yShort}</Link></span></div>
        </div>
      </div>
    </footer>
  );
}
