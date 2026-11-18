import Link from "next/link";
import { Eyebrow } from "@/components/labo/Sections";
import { BookCta } from "@/components/labo/Clinic";
import { ABOUT, PRACTICE } from "@/labo/content";

export const metadata = {
  title: "About",
  description: "About The Labo Method in Seattle, WA, founded by Mónika Jáuregui, a board-certified nurse practitioner and certified aesthetic nurse specialist, providing effective aesthetic services for skin health and wellness.",
  alternates: { canonical: "/about" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PRACTICE.provider,
  jobTitle: "Family Nurse Practitioner",
  worksFor: { "@type": "MedicalBusiness", name: PRACTICE.name },
  knowsLanguage: ["English", "Spanish"],
};

/** About (Nov 18 2026): the Skin Haven site's About page — the clinic intro, Mónika's own bio and the promise —
 *  with the provider's credentials and practice history kept from the telehealth About beneath them. */
export default function About() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pageh" style={{ paddingBottom: 0 }}>
        <div className="wrap split">
          <div className="prose">
            <Eyebrow>About us</Eyebrow>
            <h1 style={{ marginTop: 15, fontSize: "clamp(2.3rem,5.4vw,3.8rem)", letterSpacing: "-.033em" }}>Welcome to your new haven of beauty &amp; wellness care</h1>
            <p className="sub" style={{ marginTop: 22 }}>We&rsquo;re a woman- and minority-owned and operated clinic offering effective, evidence-based aesthetic treatments to help you achieve excellent skin health and overall better wellness. With our medically innovative services that deliver actual results, you&rsquo;ll find greater confidence and feel more empowered to take on the day.</p>
            <p style={{ marginTop: 18 }}>We specialize in injectables (wrinkle relaxers and fillers), skin rejuvenation treatments, cosmetic serums, IV therapy, laser and more. Treatments are personalized for you, reflecting your unique anatomy and skin and wellness goals.</p>
            <p>Look no further for dedicated and passionate (our founder is Latina, by the way!) providers committed to your well-being. Our team is here to help you look good and feel great. Your journey to enhanced appearance and improved well-being starts here.</p>
          </div>
          <div className="frame"><img src="/labo/img/about/clinic.jpg" alt="Inside the treatment studio" /></div>
        </div>
      </section>

      <section>
        <div className="wrap split narrow">
          <div>
            <div className="frame"><img src="/labo/img/about/founder.webp" alt="Mónika Jáuregui, founder of The Labo Method" /></div>
            <img className="sig" src="/labo/img/about/signature.png" alt="Mónika Jáuregui's signature" />
            <p className="byline">Mónika Jáuregui, DNP, CANS, FNP-C<small>Founder · Certified Aesthetic Nurse Specialist · Board-certified family nurse practitioner</small></p>
          </div>
          <div className="prose">
            <Eyebrow>Meet your new guide &amp; beauty bestie</Eyebrow>
            <h2 style={{ marginTop: 15 }}>¡Hola! Mónika Jáuregui here.</h2>
            <p style={{ marginTop: 22 }}>I&rsquo;m so glad you found us.</p>
            <p>I have over a few years (ahem, 13 years, not to brag! 😉) as a nurse practitioner in a surgical setting and in aesthetic medicine in Los Angeles. I decided to venture out of my hospital role to pursue my true passion, SKIN, and everything associated with it. Considering skin is the largest organ covering our amazing selves, we need to take care of it just like we do with the rest of our bodies. And I believe skincare is a lifestyle.</p>
            <p>As a lifelong learner, I&rsquo;m always trying to learn more about skin, so you&rsquo;ll frequently find me at local and international trainings and conferences where I continue learning. And I pass everything I can along to my patients.</p>
            <p>Plus, I have the privilege of being able to leverage my knowledge and experience from working at renowned skincare clinics in Los Angeles, where I treated everyday people like myself as well as celebrity clientele, to my clinic in Seattle.</p>
            <p>At {PRACTICE.name}, we prioritize helping you look like you on your best day. Our cosmetic clinic is dedicated to attainable beauty, focused on what&rsquo;s already beautiful about you. Whether you&rsquo;re suffering from acne, melasma, fine lines, volume loss, or just a case of the &ldquo;blahs,&rdquo; we have a treatment for you.</p>
            <blockquote className="pull">
              <Eyebrow>Skincare &amp; wellness is a journey — I&rsquo;m on one too</Eyebrow>
              <p>I know what it&rsquo;s like to be uncomfortable with parts of your body. I was diagnosed with melasma.</p>
              <p>Experiencing melasma firsthand pushed me to learn even more than I already did. And I, of course, share all this knowledge with my patients. I want to think my melasma has made me a more compassionate clinician, too.</p>
              <p>Now it&rsquo;s your turn. You deserve the best aesthetic experience to help you feel more confident and radiant daily.</p>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="grey">
        <div className="wrap">
          <div className="tight" style={{ marginBottom: 42 }}>
            <Eyebrow>The record</Eyebrow>
            <h2 style={{ marginTop: 15 }}>Credentials and practice history</h2>
          </div>
          <ul className="creds" style={{ marginTop: 0, marginBottom: 36 }}>
            {ABOUT.credentials.map((c) => <li key={c.label}><b>{c.label}</b><span>{c.value}</span></li>)}
          </ul>
          <ul className="defs">
            {ABOUT.history.map((h) => (
              <li key={h.dates + h.org}><span className="dt">{h.dates}</span><p className="dd"><b>{h.role} — {h.org}</b>{h.desc}</p></li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ textAlign: "center" }}>
        <div className="wrap tight">
          <Eyebrow>Our promise</Eyebrow>
          <h2 style={{ marginTop: 15 }}>Modern treatments. Natural-looking results.</h2>
          <p className="sub" style={{ margin: "18px auto 0", maxWidth: "44ch" }}>At {PRACTICE.name}, you&rsquo;ll receive modern, science-based treatments to help you achieve:</p>
          <ul className="checks"><li>Improved skin health</li><li>Greater confidence</li><li>Overall better wellness</li></ul>
          <p className="sub" style={{ margin: "28px auto 0", maxWidth: "44ch", fontSize: "1.05rem" }}>There are no shortcuts to get you there. It&rsquo;s a journey, and you&rsquo;ll have us as your guides and beauty besties.</p>
          <div className="close"><div className="acts"><Link href="/services" className="btn btn-primary">Explore our treatments</Link></div></div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap"><div className="frame wide"><img src="/labo/img/about/team.jpg" alt="The clinic team" /></div></div>
      </section>

      <BookCta />
    </>
  );
}
