import type { MetadataRoute } from "next";
import { PROGRAMS, PRACTICE } from "@/labo/content";

/**
 * Served at thelabomethod.com/sitemap.xml — the proxy rewrites that host's
 * root to /labo, so this file's route (/labo/sitemap.xml) is reached as
 * /sitemap.xml. URLs are written WITHOUT the /labo prefix for the same reason.
 */
const BASE = `https://${PRACTICE.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { p: "", priority: 1.0 },
    { p: "/how-it-works", priority: 0.9 },
    { p: "/pricing", priority: 0.9 },
    ...PROGRAMS.map((x) => ({ p: `/programs/${x.slug}`, priority: 0.9 })),
    { p: "/about", priority: 0.7 },
    { p: "/faq", priority: 0.7 },
    { p: "/contact", priority: 0.6 },
    { p: "/legal", priority: 0.2 },
  ];
  return paths.map(({ p, priority }) => ({
    url: `${BASE}${p}`,
    lastModified: new Date("2026-08-30"),
    changeFrequency: "monthly" as const,
    priority,
  }));
}
