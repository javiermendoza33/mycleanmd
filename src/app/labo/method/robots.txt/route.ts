import { METHOD, LAUNCH_READY, JOURNAL_INDEX } from "@/labo/content";

/**
 * A route handler, not the `robots.ts` metadata convention — see the same
 * note on src/app/labo/robots.txt/route.ts. Served at
 * method.thelabomethod.com/robots.txt via the proxy's hostname rewrite.
 */
export function GET() {
  const sitemap = `Sitemap: https://${METHOD.domain}/sitemap.xml`;
  const body = (LAUNCH_READY
    ? ["User-agent: *", "Allow: /", "Disallow: /api/", "Disallow: /portal/", "Disallow: /provider/", "Disallow: /auth/", "", sitemap]
    // Nov 27 2026: only the Journal (English + Spanish) is open. The longest matching rule wins, so the Allow lines beat
    // "Disallow: /"; /_next/ and the images are allowed so Google can render the articles it is allowed to read.
    : JOURNAL_INDEX
    ? ["User-agent: *", "Allow: /blog", "Allow: /es/blog", "Allow: /_next/", "Allow: /labo/", "Disallow: /", "", sitemap]
    // Not launch-ready yet — same placeholder-pricing / no-attorney-sign-off reasons as the clinic's gated pages.
    : ["User-agent: *", "Disallow: /"]
  ).concat("").join("\n");
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
