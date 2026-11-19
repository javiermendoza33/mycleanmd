"use client";

import { preconnect } from "react-dom";
import { useState } from "react";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { PRACTICE } from "@/labo/content";

/**
 * The clinic's Vagaro scheduler. Nov 18 2026: this used to build a `srcDoc` iframe that
 * injected Vagaro's own `<script src="…WidgetEmbeddedLoader…">` loader — a cross-origin
 * SCRIPT fetch, which Chrome's Opaque Response Blocking refused on the live site in a real
 * browser (net::ERR_BLOCKED_BY_ORB; the page showed "Powered by Vagaro" and nothing else).
 * CLINIC_SITE.vagaroEmbedUrl is the page that loader script would have iframed anyway —
 * pointing straight at it is a normal cross-origin NAVIGATION, not a subresource fetch, so
 * ORB doesn't apply, and that page allows framing (no X-Frame-Options, frame-ancestors *).
 * See the comment on vagaroEmbedUrl in labo/clinic/site.ts for how to re-derive it.
 *
 * Nov 18 2026: Javier found it slow — measured it with a full network trace (DNS/connect/SSL
 * were already near-zero once preconnect below was added; Vagaro's own server took ~1s just
 * to answer, and the page it returns then pulls in two dozen more third-party origins —
 * Google Maps, Stripe, Apple Pay, Google Pay, Firebase, reCAPTCHA, and THREE separate font
 * services. That's their full consumer marketplace app, not a slim widget, and none of it is
 * ours to speed up. preconnect is the one real lever on our side (opens the connection as
 * soon as this renders, instead of only once the browser parses the iframe's src). The other
 * thing we DO control: not leaving a blank white box for however long that takes — this shows
 * a branded loading state until the iframe's own document finishes loading.
 */
export function VagaroWidget() {
  preconnect("https://www.vagaro.com", { crossOrigin: "anonymous" });
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="vagaro-shell">
      {!loaded && (
        <div className="vagaro-loading" aria-hidden="true">
          <span className="vagaro-spin" />
          <p>Loading your scheduler…</p>
        </div>
      )}
      <iframe
        className="embed book"
        style={{ opacity: loaded ? 1 : 0 }}
        loading="eager"
        src={CLINIC_SITE.vagaroEmbedUrl}
        title={`Book an appointment — ${PRACTICE.name} online scheduler`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
