import { services } from "@/labo/clinic/services";
import { BookCta, ServiceCard } from "@/components/labo/Clinic";
import { PageHero } from "@/components/labo/Sections";

export const metadata = {
  title: "Services · Botox, fillers, Sculptra, microneedling, peels, IV therapy · Seattle",
  description: "The Labo Clinic offers medspa services in Seattle, WA: Botox and Dysport, dermal fillers, Sculptra, microneedling, PRP and exosomes, PDO threads, chemical peels, IV therapy, medical weight loss and laser treatments.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Injectables, skincare & wellness treatments in Seattle"
        lede="Because every one of our clients is different and requires a customized approach, we tailor every treatment to your skin type, lifestyle and desired results."
      />
      <section style={{ paddingBlock: 0 }}>
        <div className="wrap"><div className="band" style={{ marginTop: 28 }}><img src="/labo/img/services/sculptra.jpg" alt="Smiling woman with glowing, healthy skin" /></div></div>
      </section>
      <section style={{ paddingTop: 36 }}>
        <div className="wrap">
          <div className="cards">
            {services.map((s) => <ServiceCard key={s.slug} service={s} headingLevel="h2" />)}
          </div>
        </div>
      </section>
      <BookCta />
    </>
  );
}
