import type { MetadataRoute } from "next";
import { PROGRAMS, METHOD, LAUNCH_READY } from "@/labo/content";
import { posts } from "@/labo/method/posts";

/**
 * Served at method.thelabomethod.com/sitemap.xml — see the same note on
 * src/app/labo/sitemap.ts. URLs are written WITHOUT the /labo/method prefix
 * for the same reason: the proxy rewrites this host's root to /labo/method.
 */
const BASE = `https://${METHOD.domain}`;
const AT = new Date("2026-11-19");

export default function sitemap(): MetadataRoute.Sitemap {
  if (!LAUNCH_READY) return [];
  const paths = [
    { p: "", priority: 1.0 },
    { p: "/programs", priority: 0.9 },
    ...PROGRAMS.map((x) => ({ p: `/programs/${x.slug}`, priority: 0.7 })),
    { p: "/pricing", priority: 0.7 },
    { p: "/how-it-works", priority: 0.6 },
    { p: "/blog", priority: 0.6 },
    ...posts.map((x) => ({ p: `/blog/${x.slug}`, priority: 0.5 })),
    { p: "/faq", priority: 0.5 },
    { p: "/legal", priority: 0.2 },
    { p: "/terms", priority: 0.2 },
    { p: "/privacy-policy", priority: 0.2 },
    { p: "/sms", priority: 0.3 },
    { p: "/accessibility", priority: 0.2 },
  ];
  // Nov 27 2026: the pages that exist in Spanish are listed under /es too (the hreflang pair is in each page's metadata).
  const ES = ["", "/programs", ...PROGRAMS.map((x) => `/programs/${x.slug}`), "/pricing", "/how-it-works", "/faq"];
  const es = paths.filter(({ p }) => ES.includes(p)).map(({ p, priority }) => ({ p: `/es${p}`, priority: Math.max(0.3, priority - 0.1) }));
  return [...paths, ...es].map(({ p, priority }) => ({ url: `${BASE}${p}`, lastModified: AT, changeFrequency: "monthly" as const, priority }));
}
