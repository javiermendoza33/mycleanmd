import Link from "next/link";
import { METHOD, AVAILABILITY, EXTRA_PRICING } from "@/labo/content";

export const metadata = {
  title: "Book a consult",
  description: `Online consult booking for ${METHOD.name} is coming soon.`,
  alternates: { canonical: "/book" },
  robots: { index: false, follow: true },
};

/** /book (Nov 22 2026): consult booking lands here until the practice picks its EMR / scheduling vendor
 *  (HEALTHIE.book in content.ts). Same pattern as /signin. */
export default function BookSoon() {
  const consult = EXTRA_PRICING[0];
  return (
    <section className="soon">
      <div className="wrap tight">
        <span className="tag">Consultations</span>
        <h1>Online booking is <em>coming soon.</em></h1>
        <p className="sub">The {consult.price} consultation — a video visit to go through your history, your goals and which labs to draw — will be bookable here. {consult.note}</p>
        <div className="acts">
          <a className="btn btn-primary" href={`mailto:${METHOD.email}?subject=${encodeURIComponent("Consultation request")}`}>Email to request a consult</a>
          <Link className="btn btn-ghost" href="/programs">See the programs</Link>
        </div>
        <p className="note">Tell us your state, what brought you here, and a good time to reach you. Available to residents of {AVAILABILITY}.</p>
      </div>
    </section>
  );
}
