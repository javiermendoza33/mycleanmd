import type { Metadata } from "next";
import LaboAnalytics from "@/components/labo/Analytics";
import { Inter, IBM_Plex_Mono, Outfit } from "next/font/google";
import { PRACTICE, AVAILABILITY, LAUNCH_READY, CLINIC_INDEX } from "@/labo/content";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { services } from "@/labo/clinic/services";
import "./labo.css";

/**
 * The Labo Clinic lives under /labo/* in the file tree but is served at the
 * ROOT of thelabomethod.com — src/proxy.ts rewrites by hostname, so this app
 * can host two brands without either one's URLs carrying a prefix.
 *
 * The whole segment is on the "Labo White Room" system (Sep 18 2026 handoff):
 * Inter + IBM Plex Mono, single light theme, Ember accent, scoped [data-labo]
 * in labo.css. The two route groups differ only in chrome — (home) carries the
 * prototype's own header/footer inline, (site) wraps the inner pages in the
 * shared Header/Footer. Inter stands in for SF Pro; Plex Mono carries every
 * number, unit and eyebrow. "The white room only works as a white room" —
 * do not add a dark mode.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],   // Nov 19 2026: 800 for the storefront display headings
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
// Nov 19 2026 (Javier: "lets try this font as well" — facileskin.com's type is Syne; then "something similar but not so
// wide" → Outfit, the same geometric warmth at normal width). The clinic pages ([data-clinic]) set it in labo.css; the
// portals stay on Inter.
const clinicFont = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-clinic",
  display: "swap",
});
const TITLE = `Medical Spa in Seattle, WA — Botox, Fillers, Laser, Sculptra`;
const DESCRIPTION =
  `The Labo Clinic is a medical spa in Seattle (South Lake Union), WA, led by Mónika Jáuregui, DNP, CANS, FNP-C: Botox and Dysport, dermal fillers, Sculptra, microneedling, PRP and exosomes, PDO threads, chemical peels, IV therapy, medical weight loss and laser on the Candela GentleMax Pro Plus.`;

export const metadata: Metadata = {
  metadataBase: new URL(`https://${PRACTICE.domain}`),
  title: {
    template: `%s | ${PRACTICE.name}`,
    default: `${TITLE} | ${PRACTICE.name}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // Nov 18 2026: the clinic pages are indexable (CLINIC_INDEX); the gated telehealth pages set their own noindex.
  robots: CLINIC_INDEX || LAUNCH_READY ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: PRACTICE.name,
    locale: "en_US",
    title: `${TITLE} | ${PRACTICE.name}`,
    description: DESCRIPTION,
    images: [{ url: "/labo/img/misc/cta-bg.jpg", width: 2000, height: 1334, alt: "The Labo Clinic, Seattle" }],
  },
  twitter: { card: "summary_large_image" },
};

/** MedicalBusiness structured data for the clinic — location, phone, hours, services, the clinician. */
const hours = { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "18:00" };
const place = (loc: (typeof CLINIC_SITE.locations)[number]) => ({
  "@type": "MedicalBusiness",
  name: `${PRACTICE.name} — ${loc.name}`,
  address: { "@type": "PostalAddress", streetAddress: loc.address1, addressLocality: loc.cityLabel, addressRegion: "WA", postalCode: loc.address2.match(/\d{5}/)?.[0], addressCountry: "US" },
  telephone: `+1-${CLINIC_SITE.phoneNumber}`,
  hasMap: loc.mapUrl,
  openingHoursSpecification: hours,
});
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": `https://${PRACTICE.domain}/#clinic`,
  name: PRACTICE.name,
  url: `https://${PRACTICE.domain}`,
  email: PRACTICE.email,
  telephone: `+1-${CLINIC_SITE.phoneNumber}`,
  description: DESCRIPTION,
  image: `https://${PRACTICE.domain}/labo/img/misc/cta-bg.jpg`,
  priceRange: "$$",
  address: place(CLINIC_SITE.locations[0]).address,
  openingHoursSpecification: hours,
  sameAs: [CLINIC_SITE.instagram],
  areaServed: [{ "@type": "City", name: "Seattle" }, { "@type": "State", name: "Washington" }],
  location: CLINIC_SITE.locations.map(place),
  availableService: services.map((x) => ({ "@type": "MedicalProcedure", name: x.name, url: `https://${PRACTICE.domain}${x.href ?? `/services/${x.slug}`}` })),
  founder: { "@type": "Person", name: "Mónika Jáuregui, DNP, CANS, FNP-C", jobTitle: "Family Nurse Practitioner, Certified Aesthetic Nurse Specialist", url: `https://${PRACTICE.domain}/about` },
};

export default function LaboLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-labo className={`${inter.variable} ${plexMono.variable} ${clinicFont.variable}`}>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
      <LaboAnalytics />
    </div>
  );
}
