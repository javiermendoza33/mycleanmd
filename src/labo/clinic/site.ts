import { PRACTICE } from "@/labo/content";

/**
 * The clinic's contact, hours, locations and booking — carried over from the
 * Skin Haven Cosmetic Clinic site on Nov 18 2026 (Javier: "make TLM like the
 * site was with same content and photos"). The phone line, the two addresses,
 * the Vagaro scheduler and the shop link are the clinic's existing ones; the
 * email is the practice's own. Change any of them here only.
 */
export const CLINIC_SITE = {
  phoneDisplay: "877-756-4286",
  phoneNumber: "877-756-4286",
  tel: "tel:877-756-4286",
  sms: "sms:877-756-4286",
  email: PRACTICE.email,
  instagram: "https://www.instagram.com/skinhavenclinic.com/",
  shopUrl: "https://connect.skinbetter.com/skinhavenclinic",
  promo: "New patients receive $20 off their first aesthetic treatment",
  hours: [
    { days: "Monday – Friday", time: "10:00 am – 6:00 pm" },
    { days: "Saturday – Sunday", time: "By appointment only" },
  ],
  locations: [
    {
      id: "eastlake",
      name: "Eastlake",
      cityLabel: "Seattle",
      address1: "1512 Eastlake Ave E",
      address2: "Seattle, WA 98102",
      mapUrl: "https://maps.google.com/maps?q=1512%20Eastlake%20Ave%20E%2C%20Seattle%2C%20WA%2098102%2C%20USA",
      mapEmbed:
        "https://maps.google.com/maps?q=1512%20Eastlake%20Ave%20E%2C%20Seattle%2C%20WA%2098102%2C%20USA&t=m&z=15&output=embed&iwloc=near",
      // Landmark/parking note cleared Nov 21 2026 — the old copy named Queen Bee Salon &
      // South Lake Union, which no longer applies at this address. Add new details when Monika has them.
      note: "",
      contactNote: "Text or phone",
      bookOnline: true,
    },
  ],
  /**
   * Nov 18 2026: the official Vagaro embed is a `<script src="…WidgetEmbeddedLoader…">`
   * that's meant to build this exact iframe itself — but that script load is cross-origin
   * and gets Chrome's Opaque Response Blocking (net::ERR_BLOCKED_BY_ORB), confirmed on the
   * LIVE site in a real browser, not just headless. Decoded the widget script (it's public,
   * unminified-enough to grep) to find the URL it would have built — `$VagaroWidgetEmbedded`'s
   * `widgetUrl` argument — and point the iframe at that directly instead. It's a normal page
   * navigation (not a subresource fetch), so ORB doesn't apply, and the page itself sends no
   * X-Frame-Options and `frame-ancestors *`, so framing is allowed. See VagaroWidget in
   * components/labo/Clinic.tsx. If Vagaro ever rotates this token, re-derive it the same way:
   * fetch the WidgetEmbeddedLoader script (its URL used to live here) and grep for
   * `$VagaroWidgetEmbedded(` — the second string argument is this URL.
   */
  /** The public Vagaro page (manage appointments, the customer dashboard). Nov 19 2026: the slug is still
   *  thelaboclinic since Javier renamed the business on Nov 19 2026. */
  vagaroUrl: "https://www.vagaro.com/thelaboclinic",
  vagaroEmbedUrl:
    "https://www.vagaro.com/Users/BusinessWidget.aspx?enc=MMLjhIwJMcwFQhXLL7ifVMVDyDF3k7iXwT/nlKC08mdG4Suqm5SXne8KokQvqgxnfxm80hTAivnyTxG2sD94sq8tY/RKikJ4GvQVEzAMAbDi+ASfmynGIAQjCHGX1NSrCTXcaBM0YTAG+gkHE+8WOMqkKBj0YErydeo3dXmpwHV50bMZM4Ptq0X4fyqHX5sWDdclsIE1sz/ufh02aof7QEf5SxCRnLG+YvWv1CAfvv811CaIoM25oU9iXfHgDmwENS/IymptydJTdW8VD4ragSRUYSFTNx4NVIHFWeDhPFAkItlaUN0OrS2TjvIXwSShqnupcYKHwQeDN4V2npHPJyyDiXCWktJ7ngXmGeS56Fi2oXRKRXgwfB4zM25fTY4J6h5fG1Ak1ZWprfYwyRQ3peFlverMHUNP6pLd5V9p0ibM/eUZr8b9XKI7WTRRlQB9",
} as const;

export type ClinicLocation = (typeof CLINIC_SITE.locations)[number];
