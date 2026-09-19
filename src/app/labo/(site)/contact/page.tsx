import { PageHero } from "@/components/labo/Sections";
import ContactForm from "@/components/labo/ContactForm";
import { PRACTICE, CONTACT, HEALTHIE } from "@/labo/content";

export const metadata = {
  title: "Contact",
  description: "Reach The Labo Method — patient portal, email, and hours. Telehealth hormone and metabolic care.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  // The phone row is omitted rather than rendered as a [bracket]: the practice
  // line does not exist yet and the provider's mobile is deliberately unlisted.
  const rows: [string, React.ReactNode][] = [
    ["Patient portal", <a key="p" className="more" href={HEALTHIE.login} target="_blank"
       rel="noopener noreferrer">{PRACTICE.portal}</a>],
    ["Email", <a key="e" className="more" href={`mailto:${PRACTICE.email}`}>{PRACTICE.email}</a>],
    ...(PRACTICE.phone ? [["Phone", PRACTICE.phone] as [string, React.ReactNode]] : []),
    ["Hours", PRACTICE.hours],
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="Reach the practice" lede={CONTACT.lede} />
      <section>
        <div className="wrap ct">
          <div>
            <ul className="defs kv">
              {rows.map(([label, value]) => (
                <li key={label as string}>
                  <span className="dt">{label}</span>
                  <span className="dd">{value}</span>
                </li>
              ))}
            </ul>
            <p className="note">{CONTACT.note}</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
