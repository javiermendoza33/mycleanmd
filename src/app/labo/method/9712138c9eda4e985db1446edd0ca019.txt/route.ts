import { INDEXNOW_KEY } from "@/labo/content";

/** The IndexNow key file for thelabomethod.com (served at /<key>.txt through the host rewrite). Search engines that take
 *  IndexNow pings (Bing and the engines that share its index) fetch this to confirm the site really sent the ping.
 *  The key is public by design. See scripts/indexnow-method.mjs. */
export function GET() {
  return new Response(INDEXNOW_KEY, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
