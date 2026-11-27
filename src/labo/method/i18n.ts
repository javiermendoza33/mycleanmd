import type { Metadata } from "next";
import { PROGRAMS, HOW_SHORT, HOW_LONG, INCLUDED, CLINICIAN, EXTRA_PRICING, PRICING_FOOTNOTE, FAQ, METHOD, METHOD_NAV, FOOTER_DISCLAIMER, AVAILABILITY, type Program } from "@/labo/content";
import { PROGRAMS_ES, HOW_SHORT_ES, HOW_LONG_ES, INCLUDED_ES, CLINICIAN_ES, EXTRA_PRICING_ES, PRICING_FOOTNOTE_ES, FAQ_ES, METHOD_NAV_ES, FOOTER_DISCLAIMER_ES, AVAILABILITY_ES, TAGLINE_ES } from "./content.es";
import { UI_EN, type UI } from "./ui.en";
import { UI_ES } from "./ui.es";

/**
 * The Labo Method in two languages (Nov 27 2026). English lives at the site root, Spanish under /es
 * (thelabomethod.com/es/programs → src/app/labo/method/es/programs). Each page is one template in
 * src/app/labo/method/_views that takes `lang`; the English route and the Spanish route both render it.
 *
 *   const c = mc(lang)        → the content for that language (c.PROGRAMS, c.FAQ, …) and c.t, the interface words
 *   lh(lang, "/pricing")      → the link to use on a page in that language ("/es/pricing" in Spanish)
 *
 * A page with no Spanish version yet (the Journal, sign-up, the portal, the legal pages) is simply left out of
 * ES_ROUTES: `lh` then keeps the English link, and the footer says those parts are English only.
 * To translate one more page: add its view + es/ route, then add its path here.
 */
export type Lang = "en" | "es";
export const LANGS: Lang[] = ["en", "es"];

/** Path prefixes that exist in Spanish. "/programs" covers "/programs/<slug>" too. */
const ES_ROUTES = ["/programs", "/pricing", "/how-it-works", "/faq", "/signin", "/book", "/join"];
const hasEs = (path: string) => path === "/" || (path !== "/join/success" && ES_ROUTES.some((r) => path === r || path.startsWith(r + "/")));

/** The href for `path` on a page shown in `lang`. Anchors, mailto and full URLs pass through untouched. */
export function lh(lang: Lang, path: string): string {
  if (lang === "en" || !path.startsWith("/")) return path;
  const [p, tail = ""] = path.split(/(?=[?#])/, 2);
  if (!hasEs(p)) return path;
  return (p === "/" ? "/es" : `/es${p}`) + tail;
}

/**
 * The visitor-facing path, whichever form Next hands us. A prerendered page reports its internal path
 * (/labo/method/es/pricing) while the browser reports the public one (/es/pricing); both normalise to the
 * same string, so server and client render the same links.
 */
export function publicPath(pathname: string): string {
  const p = pathname.replace(/^\/labo\/method(?=\/|$)/, "") || "/";
  return p.length > 1 ? p.replace(/\/$/, "") : p;
}
export const langOf = (pathname: string): Lang => (/^\/es(\/|$)/.test(publicPath(pathname)) ? "es" : "en");
/** The same path with the /es prefix removed. */
export const basePath = (pathname: string): string => publicPath(pathname).replace(/^\/es(?=\/|$)/, "") || "/";
/** Where the language switch sends you: the same page in the other language, or that language's home. */
export function switchHref(pathname: string): string {
  const base = basePath(pathname);
  if (langOf(pathname) === "es") return base;
  return hasEs(base) ? lh("es", base) : "/es";
}

export interface MethodContent {
  lang: Lang;
  t: UI;
  AVAILABILITY: string;
  tagline: string;
  PROGRAMS: Program[];
  getProgram: (slug: string) => Program | undefined;
  HOW_SHORT: { n: string; title: string; body: string }[];
  HOW_LONG: { n: string; title: string; meta: string; body: string; detail: string }[];
  INCLUDED: string[];
  CLINICIAN: { quote: string; body: string };
  EXTRA_PRICING: { name: string; price: string; note: string }[];
  PRICING_FOOTNOTE: string;
  FAQ: { q: string; a: string }[];
  NAV: readonly { label: string; href: string }[];
  FOOTER_DISCLAIMER: string;
}

const EN: MethodContent = {
  lang: "en", t: UI_EN, AVAILABILITY, tagline: METHOD.tagline, PROGRAMS, getProgram: (s) => PROGRAMS.find((p) => p.slug === s),
  HOW_SHORT, HOW_LONG, INCLUDED, CLINICIAN, EXTRA_PRICING, PRICING_FOOTNOTE, FAQ, NAV: METHOD_NAV, FOOTER_DISCLAIMER,
};
const ES: MethodContent = {
  lang: "es", t: UI_ES, AVAILABILITY: AVAILABILITY_ES, tagline: TAGLINE_ES, PROGRAMS: PROGRAMS_ES, getProgram: (s) => PROGRAMS_ES.find((p) => p.slug === s),
  HOW_SHORT: HOW_SHORT_ES, HOW_LONG: HOW_LONG_ES, INCLUDED: INCLUDED_ES, CLINICIAN: CLINICIAN_ES, EXTRA_PRICING: EXTRA_PRICING_ES,
  PRICING_FOOTNOTE: PRICING_FOOTNOTE_ES, FAQ: FAQ_ES, NAV: METHOD_NAV_ES, FOOTER_DISCLAIMER: FOOTER_DISCLAIMER_ES,
};

export const mc = (lang: Lang): MethodContent => (lang === "es" ? ES : EN);

/**
 * `alternates` for a page that exists in both languages: its own canonical plus the hreflang pair, so Google
 * shows the Spanish page to Spanish searches instead of treating the two as duplicates.
 */
export function alternates(lang: Lang, path: string): NonNullable<Metadata["alternates"]> {
  const en = path, es = path === "/" ? "/es" : `/es${path}`;
  return { canonical: lang === "es" ? es : en, languages: { en, es, "x-default": en } };
}
