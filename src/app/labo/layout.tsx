import type { Metadata } from "next";
import { PRACTICE, AVAILABILITY, LAUNCH_READY } from "@/labo/content";
import "./labo.css";

/**
 * The Labo Method lives under /labo/* in the file tree but is served at the
 * ROOT of thelabomethod.com — src/proxy.ts rewrites by hostname, so this app
 * can host two brands without either one's URLs carrying a prefix.
 *
 * Two visual systems share this segment on purpose (Sep 18 2026):
 *   (home)  — the redesigned homepage from the "Labo White Room" prototype:
 *             Inter + IBM Plex Mono, single light theme, Ember accent, its own
 *             header/footer. Scoped by [data-labo-home] in (home)/home.css.
 *   (site)  — every inner page (programs, pricing, about, FAQ, contact, legal)
 *             still on the earlier token system, scoped by [data-labo] and
 *             wrapped in the shared Header/Footer. The handoff's build order
 *             ports those onto the new system next; until then each group owns
 *             its chrome so neither palette leaks into the other.
 *
 * This file keeps only what both share: metadata, robots, structured data.
 */
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
    <>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
