import Link from "next/link";
import { PageHero } from "@/components/labo/Sections";
import { METHOD } from "@/labo/content";

export const metadata = {
  title: "Accessibility",
  description: `How ${METHOD.name} keeps its website usable for everyone, and how to tell us when something isn't.`,
  alternates: { canonical: "/accessibility" },
};

const UPDATED = "November 23, 2026";

/** /accessibility on thelabomethod.com (Nov 23 2026) — the Method's own statement, same commitments as the clinic's. */
export default function MethodAccessibility() {
  return (
    <>
      <PageHero eyebrow="Our commitment" title="Accessibility" lede={`We want every patient to be able to read, sign up and manage their care here. Last reviewed ${UPDATED}.`} />
      <section style={{ paddingTop: 24 }}>
        <div className="wrap legalpage rich">
          <h2>What we build to</h2>
          <p>{METHOD.name} aims for the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA across {METHOD.domain}, including the sign-up flow and the patient portal. We test with automated tools and by hand, with a keyboard only and with a screen reader, and we fix what we find.</p>
          <h2>What that means on this site</h2>
          <ul>
            <li>A &ldquo;Skip to content&rdquo; link at the top of every page, and a visible focus outline on every link, button and field.</li>
            <li>Text and background colours meet the 4.5:1 contrast minimum, including small print and captions.</li>
            <li>One clear heading order per page, landmarks for the header, navigation, content and footer, and labelled menus, forms and dialogs.</li>
            <li>Every form field has a visible label. Nothing is pre-ticked, and errors are written out in words.</li>
            <li>Images carry text alternatives; decorative images are hidden from assistive technology.</li>
            <li>Animation pauses on hover or focus and is switched off when your device asks for reduced motion.</li>
            <li>The site works at 200% zoom and on phones, with touch targets at least 24 pixels.</li>
          </ul>
          <h2>Parts we don&rsquo;t fully control</h2>
          <p>Video visits, lab ordering and prescriptions run inside our clinical platform, which has its own accessibility commitments. If any part of it blocks you, email us and we&rsquo;ll arrange your visit another way.</p>
          <h2>Tell us</h2>
          <p>If anything on this site is hard to use, we want to know. Email <a href={`mailto:${METHOD.email}`}>{METHOD.email}</a> with the page and what happened, and we&rsquo;ll get back to you and fix it. You can also write to us from your <Link href="/signin">portal</Link>.</p>
        </div>
      </section>
    </>
  );
}
