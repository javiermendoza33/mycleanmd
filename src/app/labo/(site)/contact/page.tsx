import { PageHero } from "@/components/labo/Sections";
import ContactForm from "@/components/labo/ContactForm";
import { LocationCard, MapEmbed } from "@/components/labo/Clinic";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { PRACTICE, CONTACT } from "@/labo/content";

export const metadata = {
  title: "Contact",
  description: `Contact The Labo Method in Seattle, WA. Text or phone ${CLINIC_SITE.phoneDisplay}, or email ${PRACTICE.email}. Two locations: South Lake Union and Ruston.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const s = CLINIC_SITE;
  return (
    <>
      <PageHero eyebrow="Contact" title="Have a question? Contact us now!" lede="Our team is always eager to share our knowledge and expertise with our patients. Reach out however you like best." />
      <section style={{ paddingTop: 48 }}>
        <div className="wrap ct">
          <div className="kvtiles">
            <div className="kvtile">
              <span className="kicker">Text or phone</span>
              <a className="big" href={s.tel}>{s.phoneDisplay}</a>
              <div className="acts"><a href={s.sms} className="btn btn-primary">Text us</a><a href={s.tel} className="btn btn-ghost">Call us</a></div>
            </div>
            <div className="kvtile">
              <span className="kicker">Email</span>
              <a className="big" href={`mailto:${PRACTICE.email}`}>{PRACTICE.email}</a>
            </div>
            <div className="kvtile">
              <span className="kicker">Working hours</span>
              <div style={{ marginTop: 8 }}>{s.hours.map((h) => <div className="hoursrow" key={h.days}><span>{h.days}</span><span>{h.time}</span></div>)}</div>
            </div>
            <div className="kvtile">
              <span className="kicker">Follow along</span>
              <a className="big" href={s.instagram} target="_blank" rel="noopener noreferrer">Let&rsquo;s be beauty besties on Instagram ↗</a>
            </div>
            <p className="note">{CONTACT.note}</p>
          </div>
          <ContactForm />
        </div>
      </section>
      <section className="grey">
        <div className="wrap">
          <div className="sechead"><span className="kicker">Our locations</span><h2>Come say hi</h2></div>
          <div className="locs wide">
            {s.locations.map((loc) => (
              <div key={loc.id}>
                <LocationCard location={loc} />
                <p className="note" style={{ marginTop: 0 }}>{loc.note}</p>
                <MapEmbed src={loc.mapEmbed} title={`Map — ${PRACTICE.name} ${loc.name}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
