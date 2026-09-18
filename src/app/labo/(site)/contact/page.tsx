import { Eyebrow } from "@/components/labo/Sections";
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
    ["Patient portal", <a key="p" href={HEALTHIE.login} target="_blank" rel="noopener noreferrer"
       style={{ borderBottom: "1px solid var(--brass)" }}>{PRACTICE.portal}</a>],
    ["Email", <a key="e" href={`mailto:${PRACTICE.email}`}
       style={{ borderBottom: "1px solid var(--brass)" }}>{PRACTICE.email}</a>],
    ...(PRACTICE.phone ? [["Phone", PRACTICE.phone] as [string, React.ReactNode]] : []),
    ["Hours", PRACTICE.hours],
  ];

  return (
    <section className="wrap" style={{ paddingBlock: 88 }}>
      <div className="ct">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="h1" style={{ fontSize: "clamp(34px,4.6vw,56px)", marginTop: 24 }}>
            Reach the practice
          </h1>
          <p className="lead" style={{ maxWidth: 460, marginTop: 24 }}>{CONTACT.lede}</p>
          <div style={{ marginTop: 34 }}>
            {rows.map(([label, value]) => (
              <div key={label} className="ct-row">
                <span className="ct-label">{label}</span>
                <span className="ct-val">{value}</span>
              </div>
            ))}
            <div className="rule" />
          </div>
          <p className="fine" style={{ marginTop: 24 }}>{CONTACT.note}</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
