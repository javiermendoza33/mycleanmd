import Link from "next/link";
import { PRACTICE } from "@/labo/content";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { PageHero } from "@/components/labo/Sections";

export const metadata = {
  title: "Accessibility",
  description: `How ${PRACTICE.name} keeps its website usable for everyone, and how to tell us when something isn't.`,
  alternates: { canonical: "/accessibility" },
};

const UPDATED = "November 22, 2026";

/** /accessibility (Nov 22 2026): the accessibility statement. Plain-language, names the standard we build to
 *  (WCAG 2.2 AA), what that means on this site, the third-party parts we don't control, and how to reach us. */
export default function AccessibilityPage() {
  const s = CLINIC_SITE;
  return (
    <>
      <PageHero eyebrow="Our commitment" title="Accessibility" lede={`We want every visitor to be able to read, book and shop here. Last reviewed ${UPDATED}.`} />
      <section style={{ paddingTop: 40 }}>
        <div className="wrap legalpage rich">
          <h2>What we build to</h2>
          <p>{PRACTICE.name} aims for the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA across thelaboclinic.com. We test with automated tools and by hand, with a keyboard only and with a screen reader, and we fix what we find.</p>

          <h2>What that means on this site</h2>
          <ul>
            <li>A &ldquo;Skip to content&rdquo; link at the top of every page, and a visible focus outline on every link, button and field.</li>
            <li>Text and background colours meet the 4.5:1 contrast minimum, including small print and captions.</li>
            <li>One clear heading order per page, landmarks for the header, navigation, content and footer, and labelled menus, filters and dialogs.</li>
            <li>Every form field has a visible label. Nothing is pre-ticked, and errors are written out in words.</li>
            <li>Images carry text alternatives; decorative images are hidden from assistive technology.</li>
            <li>Moving content pauses on hover or focus, and animation is switched off when your device asks for reduced motion.</li>
            <li>The site works at 200% zoom and on phones, with touch targets at least 24 pixels.</li>
          </ul>

          <h2>Parts we don&rsquo;t fully control</h2>
          <p>Some features are provided by other companies inside our pages: the online booking calendar, the maps on the contact page, our partners&rsquo; skincare stores and Instagram. We can&rsquo;t change their code. If one of them blocks you, call or text us and we&rsquo;ll book or help you directly.</p>

          <h2>Tell us</h2>
          <p>If anything on this site is hard to use, we want to know. Email <a href={`mailto:${PRACTICE.email}`}>{PRACTICE.email}</a> or call or text <a href={s.tel}>{s.phoneDisplay}</a>. Tell us the page and what happened, and we&rsquo;ll get back to you and fix it. You can also <Link href="/contact">use the contact form</Link>.</p>

          <h2>In the clinic</h2>
          <p>If you need extra time, a quieter room, help with forms or anything else for your visit, mention it when you book and we&rsquo;ll arrange it.</p>
        </div>
      </section>
    </>
  );
}
