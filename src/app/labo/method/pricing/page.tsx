import { ClosingCTA, PageHero } from "@/components/labo/Sections";
import { PROGRAMS, EXTRA_PRICING, PRICING_FOOTNOTE, HEALTHIE, GATE_ROBOTS } from "@/labo/content";

export const metadata = {
  title: "Pricing",
  description: "One monthly fee. Medication, visits and messaging included. GLP-1 $299, peptides $249, testosterone $199, hormone therapy for women $199.",
  alternates: { canonical: "/pricing" },
  ...GATE_ROBOTS,
};

export default function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="One monthly fee. Cancel any month."
        lede="No membership on top of the program, no per-message charge, and no lock-in. Labs are billed separately and can often go through your insurance."
      />
      <section style={{ paddingBlock: 0 }}>
        <div className="wrap"><div className="band" style={{ marginTop: 44 }}><img src="/labo/img/about/clinic.jpg" alt="A small group talking and laughing together" /></div></div>
      </section>

      <section className="grey">
        <div className="wrap">
          <div className="tiles">
            {PROGRAMS.map((p) => (
              <article className="tile" key={p.slug}>
                <h2 className="h3">{p.name}</h2>
                <span className="price">{p.priceMeta}</span>
                <p>{p.pricingNote}</p>
                <ul className="tl">
                  {p.pricingBullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <div style={{ marginTop: "auto", paddingTop: 16 }}>
                  <a className="btn btn-ghost btn-sm" href={HEALTHIE.program(p.slug)}>Choose this program</a>
                </div>
              </article>
            ))}
          </div>

          {/* the homepage's lab-row component, reused without the track — the signature move */}
          <div className="labwrap" style={{ marginTop: 20 }}>
            <div className="labhead">
              <h2 className="h4">Beyond the monthly fee</h2>
              <span className="kicker">Self-pay · superbills on request</span>
            </div>
            {EXTRA_PRICING.map((e) => (
              <div className="mk" style={{ gridTemplateColumns: "1fr auto" }} key={e.name}>
                <div className="nm">{e.name}<em>{e.note}</em></div>
                <div className="val">{e.price}</div>
              </div>
            ))}
          </div>

          <p className="note">{PRICING_FOOTNOTE}</p>
        </div>
      </section>

      <ClosingCTA />
    </>
  );
}
