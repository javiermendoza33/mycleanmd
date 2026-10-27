"use client";
/**
 * Google Analytics 4 for thelabomethod.com (Oct 26 2026, Javier: "add this to my dashboard of websites").
 * Loads only when NEXT_PUBLIC_LABO_GA_ID (G-XXXXXXX) is set in Vercel, so it is a no-op until the GA4 property exists.
 * Health-privacy line: never runs on telehealth program pages or the contact/intake form (HHS tracking-technology
 * guidance), and sends no ad signals. Page views are sent by hand on each client-side navigation.
 */
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const GA_ID = process.env.NEXT_PUBLIC_LABO_GA_ID;
const BLOCKED = /^\/(programs|contact|start|intake)(\/|$)/;

declare global { interface Window { gtag?: (...a: unknown[]) => void } }

export default function LaboAnalytics() {
  const path = usePathname() || "/";
  const off = !GA_ID || BLOCKED.test(path);
  const first = useRef(true);   // the inline snippet sends the landing page view; this sends the later navigations
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (off || !window.gtag) return;
    window.gtag("event", "page_view", { page_path: path, page_location: location.href, page_title: document.title });
  }, [path, off]);
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="labo-ga" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
        if (!new RegExp(${JSON.stringify(BLOCKED.source)}).test(location.pathname))
          gtag('event', 'page_view', { page_path: location.pathname, page_location: location.href, page_title: document.title });
      `}</Script>
    </>
  );
}
