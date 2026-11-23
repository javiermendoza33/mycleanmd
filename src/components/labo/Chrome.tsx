"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, TELE_LINK, PROGRAMS, PRACTICE, HEALTHIE, TREATMENTS, FOOTER_DISCLAIMER, METHOD } from "@/labo/content";
import { services } from "@/labo/clinic/services";
import { CLINIC_SITE } from "@/labo/clinic/site";
import MobileNav from "@/components/labo/MobileNav";
import { TelePill, TeleBand } from "@/components/labo/TeleCallout";
import MegaNav from "@/components/labo/MegaNav";
import BagLink from "@/components/labo/shop/BagLink";
import SearchButton from "@/components/labo/search/SearchButton";
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
    <a className="skip" href="#main">Skip to content</a>
    <div className="promo" role="region" aria-label="Promotion"><div className="wrap"><span>{SHOP.promo}</span></div></div>
    <header className="site">
      <div className="wrap bar">
        <Link className="brand" href="/" aria-label={`${PRACTICE.name} — home`}>{PRACTICE.name}</Link>
        {/* Nov 21 2026: the purple "Telehealth ›" beside the wordmark became the weight-loss & peptides pill
            (TeleCallout.tsx); the plain Telehealth link moved into the menu (TELE_LINK) and the band below the
            header carries the call-out on phones and tablets. */}
        <TelePill />
        <MegaNav />
        <SearchButton />
        <BagLink />
        <Link className="btn btn-primary btn-sm" href="/booking">Book now</Link>
        <MobileNav />
      </div>
    </header>
    <TeleBand />
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
            <h2 className="fh">Explore</h2>
            <ul>
              <li><Link href="/">Home</Link></li>
              {NAV.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
              <li><Link href="/booking">Book now</Link></li>
              <li><Link href="/shop">Shop skincare</Link></li>
              <li><a href={s.shopUrl} {...ext}>skinbetter store ↗</a></li>
            </ul>
          </div>
          <div>
            <h2 className="fh">Treatments</h2>
            <ul>
              {services.map((t) => <li key={t.slug}><Link href={t.comingSoon ? "/services" : t.href ?? `/services/${t.slug}`}>{t.name}</Link></li>)}
              {TREATMENTS.filter((t) => t.group === "laser").map((t) => <li key={t.slug}><Link href={`/treatments#${t.slug}`}>{t.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="fh">{METHOD.name} ↗</h2>
            <ul>
              {PROGRAMS.map((p) => <li key={p.slug}><a href={`https://${METHOD.domain}/programs/${p.slug}`}>{p.name}</a></li>)}
              <li><a href={`https://${METHOD.domain}/how-it-works`}>How it works</a></li>
              <li><a href={`https://${METHOD.domain}/pricing`}>Pricing</a></li>
              <li><a href={`https://${METHOD.domain}/faq`}>FAQ</a></li>
              <li><a href={HEALTHIE.login} {...ext}>Patient login</a></li>
            </ul>
          </div>
          <div>
            <h2 className="fh">Visit us</h2>
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
          <p>© {new Date().getFullYear()} {PRACTICE.name}. All rights reserved. · <Link href="/privacy-policy">Privacy policy</Link> · <Link href="/accessibility">Accessibility</Link> · <a href={`https://${METHOD.domain}/legal`}>Legal</a> · <Link href="/sms">SMS terms</Link></p>
          <p>{FOOTER_DISCLAIMER}</p>
        </div>
      </div>
    </footer>
  );
}
