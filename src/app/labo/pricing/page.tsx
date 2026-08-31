import { ClosingCTA, Eyebrow } from "@/components/labo/Sections";
import { PROGRAMS, EXTRA_PRICING, PRICING_FOOTNOTE, HEALTHIE } from "@/labo/content";

export const metadata = {
  title: "Pricing",
  description: "One monthly fee. Medication, visits and messaging included. GLP-1 $299, peptides $249, testosterone $199, hormone therapy for women $199.",
  alternates: { canonical: "/pricing" },
};

export default function Pricing() {
  return (
    <>
      <header className="phead">
        <div className="wrap">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="h1">One monthly fee. Medication, visits and messaging included.</h1>
          <p className="lead">
            No membership on top of the program, no per-message charge, and no lock-in. Labs are
            billed separately and can often go through your insurance.
          </p>
        </div>
      </header>

      <section className="wrap sect-sm">
        <div className="hair pr-grid">
          {PROGRAMS.map((p) => (
            <div key={p.slug} className="pr-cell">
              <div className="pr-top">
                <h2 className="pr-name">{p.name}</h2>
                <span className="pr-amt">
                  {p.price}
                  <span className="pr-per">Per month</span>
                </span>
              </div>
              <div className="pr-div" />
              <ul className="pr-list">
                {p.pricingBullets.map((b) => (
                  <li key={b}><i aria-hidden="true">—</i><span>{b}</span></li>
                ))}
              </ul>
              <a className="btn btn-outline btn-block" href={HEALTHIE.program(p.slug)}
                 target="_blank" rel="noopener noreferrer">Choose this program</a>
            </div>
          ))}
        </div>

        <div className="inset">
          {EXTRA_PRICING.map((e) => (
            <div key={e.name}>
              <span className="eyebrow">{e.name}</span>
              <div className="inset-price">{e.price}</div>
              <p className="body-sm" style={{ margin: 0, fontSize: 14.5 }}>{e.note}</p>
            </div>
          ))}
        </div>

        <p className="fine" style={{ marginTop: 34, maxWidth: 760 }}>{PRICING_FOOTNOTE}</p>
      </section>

      <ClosingCTA />
    </>
  );
}
