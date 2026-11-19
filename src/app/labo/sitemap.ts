import type { MetadataRoute } from "next";
import { PROGRAMS, PRACTICE, LAUNCH_READY, isGated } from "@/labo/content";
import { availableServices } from "@/labo/clinic/services";
import { posts } from "@/labo/clinic/posts";
import { products } from "@/labo/clinic/products";

/**
 * Served at thelabomethod.com/sitemap.xml — the proxy rewrites that host's
 * root to /labo, so this file's route (/labo/sitemap.xml) is reached as
 * /sitemap.xml. URLs are written WITHOUT the /labo prefix for the same reason.
 */
const BASE = `https://${PRACTICE.domain}`;
const AT = new Date("2026-11-19");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { p: "", priority: 1.0 },
    { p: "/services", priority: 1.0 },
    ...availableServices.map((s) => ({ p: `/services/${s.slug}`, priority: 0.9 })),
    { p: "/treatments", priority: 0.9 },
    { p: "/shop", priority: 0.9 },
    ...products.map((x) => ({ p: `/shop/${x.slug}`, priority: 0.7 })),
    { p: "/booking", priority: 0.9 },
    { p: "/about", priority: 0.8 },
    { p: "/patient-care", priority: 0.7 },
    { p: "/testimonials", priority: 0.6 },
    { p: "/blog", priority: 0.6 },
    ...posts.map((x) => ({ p: `/blog/${x.slug}`, priority: 0.5 })),
    { p: "/how-it-works", priority: 0.6 },
    { p: "/pricing", priority: 0.6 },
    ...PROGRAMS.map((x) => ({ p: `/programs/${x.slug}`, priority: 0.6 })),
    { p: "/faq", priority: 0.5 },
    { p: "/contact", priority: 0.6 },
    { p: "/sms", priority: 0.4 },
    { p: "/legal", priority: 0.2 },
  ];
  return paths.filter(({ p }) => LAUNCH_READY || !isGated(p)).map(({ p, priority }) => ({ url: `${BASE}${p}`, lastModified: AT, changeFrequency: "monthly" as const, priority }));
}
