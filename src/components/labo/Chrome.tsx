"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, PROGRAMS, PRACTICE, HEALTHIE, TREATMENTS, FOOTER_DISCLAIMER, METHOD } from "@/labo/content";
import { services } from "@/labo/clinic/services";
import { CLINIC_SITE } from "@/labo/clinic/site";
import MobileNav from "@/components/labo/MobileNav";
import BagLink from "@/components/labo/shop/BagLink";
import { SHOP } from "@/labo/clinic/products";

/**
 * Header and footer for The Labo Clinic inner pages.
 *
 * Nov 18 2026: the clinic site's navigation (Services · Laser · About · Patient
 * Care · Testimonials · Blog · Contact, Book Now) replaces the telehealth-first
 * bar; the footer is the full site map, which is also how the site navigates on
 * phones (the main nav hides under 880px by design).
 */
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Header() {
  const pathname = usePathname();
  return (
    <>
    <div className="promo"><div className="wrap"><span>{SHOP.promo}</span><span className="sep">·</span><span>Free shipping on skincare orders over ${SHOP.freeShippingOver}</span></div></div>
    <header className="site">
      <div className="wrap bar">
        {/* .brand's own CSS has margin-right:auto (pushes the rest of the row right) — cancelled here
            and moved onto the Telehealth link instead, so Telehealth sits flush next to the wordmark
            (Javier's ask) and still pushes nav/Bag/Book-now to the right edge like every other header. */}
        <Link className="brand" href="/" aria-label={`${PRACTICE.name} — home`} style={{ marginRight: 0 }}>{PRACTICE.name}</Link>
        {/* Javier: "same style font as The Labo Clinic, and maybe make it in purple" — matches .brand's
            own cascade (Outfit, 800, tight tracking) via inline style, keeps .more's underline + "›" for
            the nav affordance, both recoloured to Method's purple (clinic's own --accent stays clay here). */}
        <a className="more" href={`https://${METHOD.domain}`}
           style={{ fontFamily: "var(--font-clinic)", fontWeight: 800, letterSpacing: "-.02em", fontSize: "1.05rem", color: METHOD.accent, textDecorationColor: METHOD.accent, marginRight: "auto" }}>Telehealth</a>
        <nav className="main" aria-label="Primary">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href || pathname.startsWith(l.href + "/") ? "on" : undefined}>{l.label}</Link>
          ))}
        </nav>
        <BagLink />
        <Link className="btn btn-primary btn-sm" href="/booking">Book now</Link>
        <MobileNav />
      </div>
    </header>
    </>
  );
}

export function Footer() {
  const s = CLINIC_SITE;
  return (
    <footer className="site">
      <div className="wrap">
        <div className="fnav fnav4">
          <div>
            <h5>Explore</h5>
            <ul>
              <li><Link href="/">Home</Link></li>
              {NAV.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
              <li><Link href="/booking">Book now</Link></li>
              <li><Link href="/shop">Shop skincare</Link></li>
              <li><a href={s.shopUrl} {...ext}>skinbetter store ↗</a></li>
            </ul>
          </div>
          <div>
            <h5>Treatments</h5>
            <ul>
              {services.map((t) => <li key={t.slug}><Link href={t.comingSoon ? "/services" : t.href ?? `/services/${t.slug}`}>{t.name}</Link></li>)}
              {TREATMENTS.filter((t) => t.group === "laser").map((t) => <li key={t.slug}><Link href={`/treatments#${t.slug}`}>{t.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h5>{METHOD.name} ↗</h5>
            <ul>
              {PROGRAMS.map((p) => <li key={p.slug}><a href={`https://${METHOD.domain}/programs/${p.slug}`}>{p.name}</a></li>)}
              <li><a href={`https://${METHOD.domain}/how-it-works`}>How it works</a></li>
              <li><a href={`https://${METHOD.domain}/pricing`}>Pricing</a></li>
              <li><a href={`https://${METHOD.domain}/faq`}>FAQ</a></li>
              <li><a href={HEALTHIE.login} {...ext}>Patient login</a></li>
            </ul>
          </div>
          <div>
            <h5>Visit us</h5>
            <ul>
              {s.locations.map((loc) => (
                <li key={loc.id}>
                  <a href={loc.mapUrl} {...ext}><b style={{ color: "var(--ink)", fontWeight: 600 }}>{loc.name}</b><br />{loc.address1}<br />{loc.address2}</a>
                  <span style={{ display: "block", marginTop: 3, color: "var(--accent)", fontSize: ".66rem", letterSpacing: ".1em", textTransform: "uppercase" }}>{loc.contactNote}</span>
                </li>
              ))}
              <li><a href={s.tel}>{s.phoneDisplay}</a></li>
              <li><a href={`mailto:${PRACTICE.email}`}>{PRACTICE.email}</a></li>
              {s.hours.map((h) => <li key={h.days}>{h.days}: {h.time}</li>)}
              <li><a href={s.instagram} {...ext}>Instagram ↗</a></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <p>© {new Date().getFullYear()} {PRACTICE.name}. All rights reserved. · <Link href="/privacy-policy">Privacy policy</Link> · <a href={`https://${METHOD.domain}/legal`}>Legal</a> · <Link href="/sms">SMS terms</Link></p>
          <p>{FOOTER_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
