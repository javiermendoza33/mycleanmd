import type { Metadata } from "next";
import { MethodHeader, MethodFooter } from "@/components/labo/MethodChrome";
import { METHOD, AVAILABILITY, LAUNCH_READY } from "@/labo/content";

/**
 * The Labo Method — telehealth, split from The Labo Clinic Nov 19 2026.
 * Served at method.thelabomethod.com (src/proxy.ts rewrites by hostname to
 * /labo/method/*). This layout overrides the parent /labo layout's title
 * template, description and metadataBase so pages here are attributed to
 * THIS brand and THIS host, not the clinic — and it deliberately does not
 * add [data-clinic], so these pages keep the base [data-labo] tokens (Apple
 * blue) instead of the clinic's clay storefront look. Fonts, the [data-labo]
 * wrapper and analytics still come from ../layout.tsx, one level up.
 *
 * Still noindex everywhere (LAUNCH_READY false) — the pricing here is the
 * same unconfirmed placeholder flagged in content.ts, and /legal hasn't had
 * attorney sign-off. Flip LAUNCH_READY once Monika/counsel clear those.
 */
const TITLE = "Telehealth hormone, weight & peptide care";
const DESCRIPTION = `${METHOD.tagline} Real labs first, a real dose plan, a clinician actually watching. Licensed for residents of ${AVAILABILITY}.`;

export const metadata: Metadata = {
  metadataBase: new URL(`https://${METHOD.domain}`),
  title: {
    template: `%s | ${METHOD.name}`,
    // `absolute`, not `default`: a layout's own `default` title is still an
    // incomplete TemplateString as far as its ANCESTORS are concerned, so
    // the grandparent /labo layout's own "%s | The Labo Clinic" template was
    // re-applying on top of this one for the /method index route (found via
    // curl: title came back "... | The Labo Method | The Labo Clinic").
    // `absolute` is the documented escape hatch — it terminates templating
    // right here. Deeper pages (e.g. "Pricing") already resolve correctly
    // because a plain string page title is terminal the same way.
    absolute: `${TITLE} | ${METHOD.name}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  robots: LAUNCH_READY ? undefined : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: METHOD.name,
    locale: "en_US",
    title: `${TITLE} | ${METHOD.name}`,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function MethodLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MethodHeader />
      <main>{children}</main>
      <MethodFooter />
    </>
  );
}
