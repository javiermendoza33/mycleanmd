import Link from "next/link";
import { careInstructions } from "@/labo/clinic/patient-care";
import { getService } from "@/labo/clinic/services";
import { Acc, BookCta, Rich } from "@/components/labo/Clinic";
import { PageHero } from "@/components/labo/Sections";

export const metadata = {
  title: "Pre & post-treatment instructions",
  description: "Pre- and post-treatment instructions from The Labo Clinic for Botox and Dysport, dermal fillers, Sculptra, microneedling, PRP, PDO threads, chemical peels and more.",
  alternates: { canonical: "/patient-care" },
};

export default function PatientCarePage() {
  return (
    <>
      <PageHero
        eyebrow="Patient care"
        title="Pre- and post-treatment instructions"
        lede="Getting the best results starts before your visit and continues after you leave. Review the guidance for your treatment below, and reach out with any questions."
      />
      <section style={{ paddingBlock: 0 }}>
        <div className="wrap"><div className="band" style={{ marginTop: 28 }}><img src="/labo/img/misc/patient-care.jpg" alt="A patient relaxing during a skin treatment" /></div></div>
      </section>
      <section style={{ paddingTop: 36 }}>
        <div className="wrap tight">
          {careInstructions.map((care, i) => {
            const service = care.serviceSlug ? getService(care.serviceSlug) : undefined;
            return (
              <Acc key={care.treatment} title={care.treatment} open={i === 0}>
                <div><span className="kicker">Pre-treatment</span><Rich blocks={care.pre.map((b) => `- ${b}`)} /></div>
                <div><span className="kicker">Post-care</span><Rich blocks={care.post.map((b) => `- ${b}`)} /></div>
                {care.notes && care.notes.length > 0 && <div className="notebox"><Rich blocks={care.notes} /></div>}
                {service && !service.comingSoon && <Link className="more" href={service.href ?? `/services/${service.slug}`}>About {service.name}</Link>}
              </Acc>
            );
          })}
        </div>
      </section>
      <BookCta />
    </>
  );
}
