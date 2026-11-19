import Link from "next/link";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { VagaroWidget } from "@/components/labo/VagaroWidget";
import { PageHero } from "@/components/labo/Sections";

export const metadata = {
  title: "Book your appointment",
  description: "Book your appointment at The Labo Method in Seattle, WA. Schedule online, or text 877-756-4286.",
  alternates: { canonical: "/booking" },
};

export default function BookingPage() {
  const s = CLINIC_SITE;
  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Book your appointment"
        lede="Schedule online below, or call or text us and we&rsquo;ll find your perfect time."
      />
      <section style={{ paddingTop: 44 }}>
        <div className="wrap">
          <VagaroWidget />
          <p className="note" style={{ textAlign: "center" }}>Prefer a human touch? <a className="more" href={s.tel}>Call</a> or <a className="more" href={s.sms}>text {s.phoneDisplay}</a> and we&rsquo;ll get you scheduled.</p>
        </div>
      </section>
      <section className="grey" style={{ paddingBlock: 70 }}>
        <div className="wrap tight" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "1.8rem" }}>Got questions? Bring them on!</h2>
          <p className="sub" style={{ margin: "16px auto 0", maxWidth: "52ch", fontSize: "1.05rem" }}>Our team is always eager to share our knowledge and expertise with our patients. We want to earn your trust and help you feel 100% comfortable before, during and after your treatments.</p>
          <div className="close"><div className="acts"><Link href="/contact" className="btn btn-primary">Send us a message</Link><a href={s.tel} className="btn btn-ghost">Call {s.phoneDisplay}</a></div></div>
        </div>
      </section>
    </>
  );
}
