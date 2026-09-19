import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { PRACTICE, AVAILABILITY, LAUNCH_READY } from "@/labo/content";
import "./labo.css";

/**
 * The Labo Method lives under /labo/* in the file tree but is served at the
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
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});
const DESCRIPTION =
  `Telehealth hormone, peptide and metabolic care directed by a board-certified nurse practitioner. GLP-1 weight management, peptide therapy, testosterone and hormone therapy for residents of ${AVAILABILITY}.`;

export const metadata: Metadata = {
  metadataBase: new URL(`https://${PRACTICE.domain}`),
  title: {
    template: `%s | ${PRACTICE.name}`,
    default: `${PRACTICE.name} — Hormone & Longevity Medicine`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  // Blocking items in content.ts must clear before this is indexed.
  robots: LAUNCH_READY ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: PRACTICE.name,
    locale: "en_US",
    title: `${PRACTICE.name} — Hormone & Longevity Medicine`,
    description: DESCRIPTION,
  },
};

/** MedicalBusiness structured data — handoff open item #9. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: PRACTICE.name,
  url: `https://${PRACTICE.domain}`,
  email: PRACTICE.email,
  description: DESCRIPTION,
  medicalSpecialty: "Endocrinology",
  areaServed: [
    { "@type": "State", name: "California" },
    { "@type": "State", name: "Washington" },
  ],
  availableService: [
    { "@type": "MedicalTherapy", name: "GLP-1 Weight Management" },
    { "@type": "MedicalTherapy", name: "Peptide Therapy" },
    { "@type": "MedicalTherapy", name: "Testosterone Replacement Therapy" },
    { "@type": "MedicalTherapy", name: "Menopausal Hormone Therapy" },
  ],
  employee: {
    "@type": "Person",
    name: PRACTICE.provider,
    jobTitle: "Family Nurse Practitioner",
  },
};

export default function LaboLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-labo className={`${inter.variable} ${plexMono.variable}`}>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </div>
  );
}
