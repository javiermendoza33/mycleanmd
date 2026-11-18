import { testimonials } from "@/labo/clinic/testimonials";
import { BookCta, TestimonialCard } from "@/components/labo/Clinic";
import { PageHero } from "@/components/labo/Sections";

export const metadata = {
  title: "Testimonials",
  description: "What patients say about Mónika Jáuregui and The Labo Method in Seattle, WA.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero eyebrow="Testimonials" title="Kind words from happy, refreshed patients" />
      <section style={{ paddingTop: 48 }}>
        <div className="wrap"><div className="quotes">{testimonials.map((t) => <TestimonialCard key={t.author} t={t} />)}</div></div>
      </section>
      <BookCta />
    </>
  );
}
