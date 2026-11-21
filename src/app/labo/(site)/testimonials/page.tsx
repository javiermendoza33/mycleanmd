import { testimonials } from "@/labo/clinic/testimonials";
import { BookCta, TestimonialCard } from "@/components/labo/Clinic";
import { PageHero } from "@/components/labo/Sections";

export const metadata = {
  title: "Testimonials",
  description: "What patients say about Mónika Jáuregui and The Labo Clinic in Seattle, WA.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero eyebrow="Testimonials" title="Kind words from happy, refreshed patients" />
      <section style={{ paddingBlock: 0 }}>
        <div className="wrap"><div className="band" style={{ marginTop: 28 }}><img src="/labo/img/misc/testimonials.jpg" alt="Five women of different skin tones standing together" /></div></div>
      </section>
      <section style={{ paddingTop: 36 }}>
        <div className="wrap"><div className="quotes">{testimonials.map((t) => <TestimonialCard key={t.author} t={t} />)}</div></div>
      </section>
      <BookCta />
    </>
  );
}
