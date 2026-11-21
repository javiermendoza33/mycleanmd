import { services } from "./services";
import { products } from "./products";
import { TREATMENTS } from "@/labo/content";

/**
 * Site search (Nov 21 2026, Javier: "add a search field… in case someone wants to look for a
 * particular product or service") — a single flat index over the three things worth finding:
 * the 11 clinic services, the 5 laser treatments (the only TREATMENTS not already a service —
 * botox/fillers/sculptra/microneedling/laser itself are all in `services` too), and the shop
 * catalog. No blog/testimonials/etc. — scoped to exactly what Javier asked for.
 */
export type SearchHit = {
  kind: "service" | "treatment" | "product";
  title: string;
  subtitle?: string;
  blurb: string;
  href: string;
  keywords: string;
};

const norm = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" ").toLowerCase();

export const SEARCH_INDEX: SearchHit[] = [
  ...services
    .filter((s) => !s.comingSoon)
    .map((s): SearchHit => ({
      kind: "service",
      title: s.name,
      subtitle: s.brand,
      blurb: s.tagline,
      href: s.href ?? `/services/${s.slug}`,
      keywords: norm(s.name, s.brand, s.tagline, s.cardDescription),
    })),
  ...TREATMENTS.filter((t) => t.group === "laser").map(
    (t): SearchHit => ({
      kind: "treatment",
      title: t.name,
      subtitle: "Laser",
      blurb: t.short,
      href: `/treatments#${t.slug}`,
      keywords: norm(t.name, t.short, ...t.treats),
    }),
  ),
  ...products.map(
    (p): SearchHit => ({
      kind: "product",
      title: p.name,
      subtitle: p.line,
      blurb: p.tagline,
      href: `/shop/${p.slug}`,
      keywords: norm(p.name, p.line, p.lineShort, p.type, p.tagline, p.blurb, ...p.concerns),
    }),
  ),
];

export function searchSite(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return SEARCH_INDEX.filter((h) => h.keywords.includes(q)).slice(0, 20);
}

export const KIND_LABEL: Record<SearchHit["kind"], string> = {
  service: "Service",
  treatment: "Laser treatment",
  product: "Shop",
};
