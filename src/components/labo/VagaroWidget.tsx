"use client";

import { preconnect } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";
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
/**
 * Nov 19 2026 — Booking Widget Events (docs.vagaro.com/public/docs/introduction-widget-events): the embedded widget
 * posts `{ eventName, timestamp, data }` to the parent with window.postMessage. We listen for the ones that matter:
 * WidgetLoaded (drop our overlay the moment Vagaro's app is up), FormResponseSubmitted (her intake/consent form was
 * answered inside the widget) and BookingCompleted — which is where the embed used to hang on "Welcome, <name>": the
 * customer dashboard never loads inside a frame. Now our own confirmation takes over. Vagaro's public API has no
 * create-appointment call (only outbound webhooks + these events), so the widget stays the booking engine.
 */
type WidgetEvent = { eventName?: string; timestamp?: number; data?: Record<string, unknown> };

export function VagaroWidget() {
  preconnect("https://www.vagaro.com", { crossOrigin: "anonymous" });
  const [loaded, setLoaded] = useState(false);
  const [booked, setBooked] = useState(false);
  const [formDone, setFormDone] = useState(false);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== "https://www.vagaro.com") return;
      const m = e.data as WidgetEvent;
      if (!m || typeof m.eventName !== "string") return;
      const n = m.eventName.toLowerCase();
      if (process.env.NODE_ENV !== "production" || window.location.search.includes("vagaro=debug")) console.debug("[vagaro widget]", m.eventName, m.data);
      if (n.includes("loaded")) setLoaded(true);
      else if (n.includes("formresponsesubmitted")) setFormDone(true);
      else if (n.includes("bookingcompleted")) { setBooked(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);
  if (booked) {
    return (
      <div className="booked">
        <span className="kicker">You&rsquo;re booked</span>
        <h2>See you soon.</h2>
        <p className="sub">Your confirmation is on its way to your email, with a reminder 24 hours before your visit.{formDone ? " Your intake form is saved with the appointment." : ""}</p>
        <ul className="checks grid">
          <li>Arrive 10 minutes early — free 30-minute parking in the courtyard at 910 Lenora.</li>
          <li>Skip retinol, exfoliants and alcohol the night before injectables or laser.</li>
          <li>Questions before then? Text {CLINIC_SITE.phoneDisplay}.</li>
        </ul>
        <div className="acts">
          <Link className="btn btn-primary" href="/patient-care">Pre-visit instructions</Link>
          <Link className="btn btn-ghost" href="/shop">Shop skincare</Link>
          <a className="more" href={CLINIC_SITE.vagaroUrl} target="_blank" rel="noopener noreferrer">Manage on Vagaro ↗</a>
          <button type="button" className="more linkbtn" onClick={() => { setBooked(false); setFormDone(false); setLoaded(false); setKey((k) => k + 1); }}>Book another</button>
        </div>
      </div>
    );
  }
  return (
    <div className="vagaro-shell">
      {!loaded && (
        <div className="vagaro-loading" aria-hidden="true">
          <span className="vagaro-spin" />
          <p>Loading your scheduler…</p>
        </div>
      )}
      <iframe
        key={key}
        className="embed book"
        style={{ opacity: loaded ? 1 : 0 }}
        loading="eager"
        src={CLINIC_SITE.vagaroEmbedUrl}
        title={`Book an appointment — ${PRACTICE.name} online scheduler`}
        onLoad={() => setLoaded(true)}
      />
      {/* Nov 19 2026 (Javier's test booking): the booking itself completes and the confirmation email arrives, but the
          widget's post-booking "Welcome, <name>" view then spins forever inside the frame — Vagaro's customer dashboard
          doesn't load embedded. Nothing is lost; say so, and give the way out. */}
      <p className="vagaro-foot">
        Booked? Your confirmation is in your email. Scheduler stuck or want to manage an appointment?{" "}
        <a href={CLINIC_SITE.vagaroUrl} target="_blank" rel="noopener noreferrer">Open it on Vagaro ↗</a>
      </p>
    </div>
  );
}
