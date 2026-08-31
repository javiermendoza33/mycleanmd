import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import { Header, Footer } from "@/components/labo/Chrome";
import { PRACTICE, AVAILABILITY, LAUNCH_READY } from "@/labo/content";
import "./labo.css";

/**
 * The Labo Method lives under /labo/* in the file tree but is served at the
 * ROOT of thelabomethod.com — src/proxy.ts rewrites by hostname, so this app
 * can host two brands without either one's URLs carrying a prefix.
 *
 * Fonts are the two the handoff specifies. `data-labo` scopes every rule in
 * labo.css so the gated MyCleanMD portal's dark palette never leaks in here,
 * and nothing here leaks into it.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-newsreader",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-public-sans",
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
    <div data-labo className={`${newsreader.variable} ${publicSans.variable}`}>
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
