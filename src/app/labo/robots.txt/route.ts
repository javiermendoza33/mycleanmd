import { PRACTICE, LAUNCH_READY } from "@/labo/content";

/**
 * A route handler, not the `robots.ts` metadata convention — that convention
 * only works at the ROOT of app/, and this site lives at app/labo/ (served at
 * the root of thelabomethod.com via a hostname rewrite in src/proxy.ts).
 * Declaring it as robots.ts here silently produced no route at all.
 */
export function GET() {
  const body = (LAUNCH_READY
    ? ["User-agent: *", "Allow: /", "Disallow: /api/", "",
       `Sitemap: https://${PRACTICE.domain}/sitemap.xml`]
    // Pre-launch: placeholder pricing and unreviewed legal copy must not be
    // indexed. Flip LAUNCH_READY in content.ts to open it up.
    : ["User-agent: *", "Disallow: /"]
  ).concat("").join("\n");
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
