import { PRACTICE, LAUNCH_READY, CLINIC_INDEX, GATED } from "@/labo/content";

/**
 * A route handler, not the `robots.ts` metadata convention — that convention
 * only works at the ROOT of app/, and this site lives at app/labo/ (served at
 * the root of thelabomethod.com via a hostname rewrite in src/proxy.ts).
 * Declaring it as robots.ts here silently produced no route at all.
 */
export function GET() {
  const sitemap = `Sitemap: https://${PRACTICE.domain}/sitemap.xml`;
  const body = (LAUNCH_READY
    ? ["User-agent: *", "Allow: /", "Disallow: /api/", "Disallow: /portal/", "Disallow: /provider/", "Disallow: /auth/", "", sitemap]
    : CLINIC_INDEX
      // Nov 18 2026: clinic pages open; the gated telehealth/pricing paths stay closed until LAUNCH_READY.
      ? ["User-agent: *", "Allow: /", "Disallow: /api/", "Disallow: /portal/", "Disallow: /provider/", "Disallow: /auth/",
         ...GATED.map((g) => `Disallow: ${g}`), "", sitemap]
      : ["User-agent: *", "Disallow: /"]
  ).concat("").join("\n");
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
