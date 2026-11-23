"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, TELE_LINK, TREATMENTS, GROUPS, CONCERNS as TX_CONCERNS } from "@/labo/content";
import { services } from "@/labo/clinic/services";
import { CONCERNS, LINES, TYPES, products, bestSellers, money } from "@/labo/clinic/products";

/**
 * Desktop navigation with mega menus (Nov 22 2026, Javier: "need to add sub menu when you click on header" — ALASTIN's
 * Shop Skincare panel as the reference). Two entries open a full-width panel under the header: Treatments and Shop.
 * Click toggles (the trigger is a button with aria-expanded), hover opens after a short pause, Escape / click outside /
 * navigating closes. Everything inside the panel is a plain link, so keyboard users Tab through the columns in order.
 * The other entries stay plain links. Under 880px the whole nav is hidden and MobileNav's sheet takes over, as before.
 */
type Col = { title: string; items: { label: string; href: string; sub?: string }[] };
type Panel = { key: string; cols: Col[]; feature: { href: string; src: string; alt: string; title: string; sub: string } };

const enc = (s: string) => encodeURIComponent(s);
const withProducts = <T extends string>(all: readonly T[], pick: (p: (typeof products)[number]) => T | T[]) =>
  all.filter((t) => products.some((p) => { const v = pick(p); return Array.isArray(v) ? v.includes(t) : v === t; }));

const PANELS: Record<string, Panel> = {
  "/services": {
    key: "treatments",
    cols: [
      { title: "Treatments", items: [{ label: "All treatments", href: "/services" }, ...services.map((s) => ({ label: s.name, href: s.comingSoon ? "/services" : s.href ?? `/services/${s.slug}`, sub: s.comingSoon ? "Coming soon" : undefined }))] },
      { title: GROUPS.laser, items: [{ label: "The laser", href: "/treatments" }, ...TREATMENTS.filter((t) => t.group === "laser").map((t) => ({ label: t.name, href: `/treatments#${t.slug}` }))] },
      { title: "By concern", items: TX_CONCERNS.map((c) => ({ label: c.label, href: `/treatments#${c.slug}` })) },
      { title: "Your visit", items: [{ label: "Find your treatment (quiz)", href: "/treatments#finder" }, { label: "Book a consultation", href: "/booking" }, { label: "Pre & post care", href: "/patient-care" }, { label: "Members", href: "/membership" }, { label: "Weight Loss & Peptides ↗", href: TELE_LINK.href }] },
    ],
    feature: { href: "/services/wrinkle-relaxers", src: "/labo/img/services/wrinkle-relaxers.jpg", alt: "", title: "Wrinkle relaxers", sub: "Botox® & Dysport® — our most-booked visit" },
  },
  "/shop": {
    key: "shop",
    cols: [
      { title: "Shop", items: [{ label: "All products", href: "/shop" }, ...LINES.map((l) => ({ label: l, href: `/shop?line=${enc(l)}` })), { label: "Best sellers", href: "/shop?best=1" }] },
      { title: "Product type", items: withProducts(TYPES, (p) => p.type).map((t) => ({ label: t === "Eye" ? "Eye care" : `${t}s`, href: `/shop?t=${enc(t)}` })) },
      { title: "Skin concern", items: withProducts(CONCERNS, (p) => p.concerns).map((c) => ({ label: c, href: `/shop?c=${enc(c)}` })) },
      { title: "Help choosing", items: [{ label: "Skin quiz", href: "/#quiz" }, { label: "Text us a photo", href: "/contact" }, { label: "How the shop works", href: "/shop#how" }] },
    ],
    feature: (() => { const p = bestSellers.find((x) => x.image) ?? products[0]; return { href: `/shop/${p.slug}`, src: p.image?.src ?? "", alt: "", title: p.name, sub: `${p.line} · ${money(p.price)}` }; })(),
  },
};

export default function MegaNav({ label = "Primary" }: { label?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uid = useId();
  useEffect(() => { setOpen(null); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); (root.current?.querySelector(`[data-mega="${open}"]`) as HTMLElement | null)?.focus(); } };
    const onDown = (e: MouseEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", onKey); document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [open]);
  const hover = (key: string | null) => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(key), key ? 140 : 220); };
  const isOn = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="main" aria-label={label} ref={root} onMouseLeave={() => hover(null)}>
      {NAV.map((l) => {
        const panel = PANELS[l.href];
        if (!panel) return <Link key={l.href} href={l.href} className={isOn(l.href) ? "on" : undefined}>{l.label}</Link>;
        const id = `${uid}-${panel.key}`; const on = open === l.href;
        return (
          <div key={l.href} className={`megaitem${on ? " open" : ""}`} onMouseEnter={() => hover(l.href)}>
            <button type="button" className={`megabtn${isOn(l.href) ? " on" : ""}`} data-mega={l.href} aria-expanded={on} aria-controls={id} onClick={() => setOpen(on ? null : l.href)}>
              {l.label}<span className="chev" aria-hidden="true">›</span>
            </button>
            <div id={id} className="mega" hidden={!on} onMouseEnter={() => hover(l.href)}>
              <div className="wrap megagrid">
                {panel.cols.map((c) => (
                  <div key={c.title} className="megacol">
                    <h2 className="kicker">{c.title}</h2>
                    <ul>{c.items.map((it) => <li key={it.href + it.label}>{it.href.startsWith("http") ? <a href={it.href}>{it.label}</a> : <Link href={it.href}>{it.label}</Link>}{it.sub && <small>{it.sub}</small>}</li>)}</ul>
                  </div>
                ))}
                <Link href={panel.feature.href} className="megafeat">
                  {panel.feature.src ? <img src={panel.feature.src} alt={panel.feature.alt} loading="lazy" /> : <span className="megaph" aria-hidden="true" />}
                  <b>{panel.feature.title}</b><small>{panel.feature.sub}</small>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
      <a className="telelink" href={TELE_LINK.href}>{TELE_LINK.label}</a>
    </nav>
  );
}
