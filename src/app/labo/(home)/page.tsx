import Link from "next/link";
import Gate from "./Gate";
import { Footer } from "@/components/labo/Chrome";
import { HEALTHIE, PRACTICE, PROGRAMS } from "@/labo/content";

/**
 * thelabomethod.com homepage — ported from labo-home-prototype.html (design
 * handoff, 18 Sep 2026). The handoff is explicit: port it, don't reinterpret
 * it. Markup, copy and rhythm follow the prototype section for section; the
 * only edits are wiring — internal links go to the real routes, CTAs go
 * through the HEALTHIE constants (one place to change when the practice's
 * real registration / booking / login URLs arrive).
 *
 * Still placeholder, per the handoff's own table:
 *   · the four photographs (stock, captioned with their shot number for the shoot)
 *   · the example lab panel — FABRICATED values, labelled illustrative; Monika
 *     must correct or remove it before launch
 *   · HEALTHIE.* still point at the bare portal (content.ts open item #2)
 */
const [GLP1, PEP, TRT, HRT] = PROGRAMS.map((p) => `/programs/${p.slug}`);

const STATS = [
  { v: <>100%</>, k: "Telehealth. Labs drawn near you." },
  { v: <>1</>, k: "Clinician, writing every protocol." },
  { v: <>24<span style={{ fontSize: ".45em", fontWeight: 600 }}> HRS</span></>, k: "From results to your protocol." },
  { v: <>0</>, k: "Membership fees or lock-in." },
];

const TILES = [
  { href: GLP1, name: "GLP-1 Weight Management", price: "$299 / month",
    blurb: "Semaglutide or tirzepatide, dosed against your metabolic panel and titrated by a clinician watching your side effects.",
    chips: ["HbA1c", "Fasting insulin", "Lipids", "hs-CRP", "TSH"] },
  { href: PEP, name: "Peptide Therapy", price: "$249 / month",
    blurb: "Recovery, sleep and tissue repair protocols — cycled rather than run indefinitely, and stopped when the repeat panel shows nothing.",
    chips: ["IGF-1", "Hormone panel", "hs-CRP", "CBC", "CMP"] },
  { href: TRT, name: "Testosterone for Men", price: "$199 / month",
    blurb: "A full endocrine work-up first, treatment only where indicated, and the monitoring responsible TRT actually requires.",
    chips: ["Total & free T", "SHBG", "Estradiol", "Hematocrit", "PSA"] },
  { href: HRT, name: "Hormone Therapy for Women", price: "$199 / month",
    blurb: "Perimenopause and menopause care from a clinician who takes the symptoms seriously, with symptom scoring at every review.",
    chips: ["Estradiol", "FSH", "Progesterone", "TSH", "Lipids"] },
];

/** ⚠️ ILLUSTRATIVE. Placed by eye in the prototype to look plausible — not a real patient, not clinically reviewed. */
const PANEL = [
  { name: "Total testosterone", unit: "ng/dL", value: "248", ref: { left: "22%", right: "12%" }, pin: "17%", out: true,  lo: "0",   hi: "1100" },
  { name: "SHBG",               unit: "nmol/L", value: "61", ref: { left: "16%", right: "34%" }, pin: "68%", out: true,  lo: "0",   hi: "90" },
  { name: "Estradiol",          unit: "pg/mL",  value: "34", ref: { left: "14%", right: "38%" }, pin: "48%", out: false, lo: "0",   hi: "70" },
  { name: "HbA1c",              unit: "percent", value: "5.9", unitShown: "%", ref: { left: "10%", right: "52%" }, pin: "56%", out: true, lo: "4.0", hi: "8.0" },
  { name: "Fasting insulin",    unit: "uIU/mL", value: "19", ref: { left: "6%",  right: "60%" }, pin: "63%", out: true,  lo: "0",   hi: "30" },
  { name: "hs-CRP",             unit: "mg/L",   value: "1.1", ref: { left: "2%", right: "70%" }, pin: "22%", out: false, lo: "0",   hi: "5.0" },
];

const STEPS = [
  { when: "About 10 minutes", h: "Intake",      p: "History, medications and what you want to change. Upload labs you already have — if they are recent enough, we use them." },
  { when: "2 to 5 days",      h: "Lab work",    p: "An order for the panel your program needs, drawn near you. Often billable to insurance." },
  { when: "30 to 45 minutes", h: "Video visit", p: "Every relevant marker, not just the flagged ones, and a protocol you can explain back to me." },
  { when: "Ongoing",          h: "Treatment",   p: "Medication ships from a licensed pharmacy. Doses change based on repeat labs and how you are doing." },
];

const PRICES = [
  { name: "GLP-1 Weight Management",   note: "semaglutide or tirzepatide included",                         value: "$299", unit: " / mo" },
  { name: "Peptide Therapy",           note: "oversight and pharmacy coordination; peptide cost varies",     value: "$249", unit: " / mo" },
  { name: "Testosterone for Men",      note: "medication, supplies and monitoring labs reviewed",            value: "$199", unit: " / mo" },
  { name: "Hormone Therapy for Women", note: "estrogen, progesterone, low-dose testosterone as indicated",   value: "$199", unit: " / mo" },
  { name: "Initial consultation",      note: "credited toward your first month",                             value: "$149", unit: " once" },
  { name: "Lab panels",                note: "many patients use insurance or a recent draw",                 value: "$99–249", unit: "" },
];

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function LaboHome() {
  return (
    <>
      <header className="site">
        <div className="wrap bar">
          <a className="brand" href="#top">The Labo Method</a>
          <nav className="main" aria-label="Sections">
            <a href="#programs">Programs</a>
            <a href="#panel">What we measure</a>
            <a href="#clinician">Clinician</a>
            <a href="#process">How it works</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <a className="btn btn-ghost btn-sm" href={HEALTHIE.login} {...ext}>Patient login</a>
        </div>
      </header>

      <main id="top">
        {/* ── HERO + the eligibility gate ─────────────────────────────── */}
        <section className="hero">
          <div className="wrap">
            <span className="kicker">Licensed in California and Washington</span>
            <h1>Start with your numbers.</h1>
            <p className="sub">Hormone, metabolic and peptide care directed by one board-certified nurse practitioner. Full panel first. Protocol second.</p>
            <div className="acts">
              <a className="more" href="#panel">See what gets measured</a>
              <a className="more" href="#pricing">View pricing</a>
            </div>
            <figure className="band">
              <img src="/labo/shot-01.jpg" width={1760} height={754} alt="A clinician at her desk, considering something on screen" />
              <figcaption>Placeholder · shot 01, The read</figcaption>
            </figure>
            <Gate />
          </div>
        </section>

        {/* ── STATS ───────────────────────────────────────────────────── */}
        <section className="grey">
          <div className="wrap stats">
            {STATS.map((s) => (
              <div className="stat" key={s.k}><span className="v">{s.v}</span><span className="k">{s.k}</span></div>
            ))}
          </div>
        </section>

        {/* ── PROGRAMS ────────────────────────────────────────────────── */}
        <section id="programs">
          <div className="wrap">
            <div className="tight" style={{ marginBottom: 46 }}>
              <span className="kicker">Four programs</span>
              <h2 style={{ marginTop: 15 }}>Every one begins with a panel.</h2>
              <p className="sub" style={{ marginTop: 17 }}>What changes is which markers get ordered and what the protocol is built to move. Nothing is prescribed off a form.</p>
            </div>
            <div className="tiles">
              {TILES.map((t) => (
                <article className="tile" key={t.name}>
                  <h3>{t.name}</h3>
                  <span className="price">{t.price}</span>
                  <p>{t.blurb}</p>
                  <ul className="chips">{t.chips.map((c) => <li key={c}>{c}</li>)}</ul>
                  <Link className="more" href={t.href}>Learn more</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT WE MEASURE — the reference-interval row ────────────── */}
        <section id="panel" className="grey">
          <div className="wrap">
            <div className="headrow">
              <div>
                <span className="kicker">What we measure</span>
                <h2 style={{ marginTop: 15 }}>You see your panel the way I see it.</h2>
                <p className="sub" style={{ marginTop: 17 }}>Not a red flag on two markers. Every relevant value, where it sits, and what I think is driving it.</p>
              </div>
              <figure className="sq">
                <img src="/labo/shot-02.jpg" width={640} height={640} alt="Hands annotating a printed document at a desk" />
                <figcaption>Shot 03</figcaption>
              </figure>
            </div>
            <div className="labwrap">
              <div className="labhead">
                <h4>Example panel — male, 41, fatigue and weight gain</h4>
                <span className="kicker">Illustrative. Not a real patient.</span>
              </div>
              {PANEL.map((m) => (
                <div className="mk" key={m.name}>
                  <div className="nm">{m.name}<em>{m.unit}</em></div>
                  <div className="val">{m.value} <span className="u">{m.unitShown ?? m.unit}</span></div>
                  <div className="track">
                    <div className="rail"></div>
                    <div className="ref" style={{ left: m.ref.left, right: m.ref.right }}></div>
                    <div className={`pin${m.out ? " out" : ""}`} style={{ left: m.pin }}></div>
                    <div className="ends"><span>{m.lo}</span><span>{m.hi}</span></div>
                  </div>
                </div>
              ))}
              <div className="labfoot">
                <span><i className="sw" style={{ background: "var(--ok)", opacity: 0.3 }}></i> Reference interval</span>
                <span><i className="sw" style={{ background: "var(--ink)", height: 10, width: 3 }}></i> In range</span>
                <span><i className="sw" style={{ background: "var(--accent)", height: 10, width: 3 }}></i> Outside range</span>
              </div>
            </div>
            <p className="note">Reference intervals vary by laboratory and assay. A value inside the interval is not automatically normal for you.</p>
          </div>
        </section>

        {/* ── CLINICIAN ───────────────────────────────────────────────── */}
        <section id="clinician">
          <div className="wrap clin">
            <figure className="portrait">
              <img src="/labo/shot-03.jpg" width={720} height={900} alt="Portrait of the clinician" />
              <figcaption>Placeholder · shot 02</figcaption>
            </figure>
            <div>
              <span className="kicker">Your clinician</span>
              <blockquote>I was tired of watching people get handed a prescription without anyone looking at their labs, their history, or their life.</blockquote>
              <p className="sub">Every protocol here is written by me, reviewed by me, and adjusted by me as your numbers change. No rotating panel. No chatbot.</p>
              <ul className="creds">
                <li><b>Clinician</b><span>{PRACTICE.provider}</span></li>
                <li><b>Licensure</b><span>California and Washington</span></li>
                <li><b>Certification</b><span>Board-certified nurse practitioner</span></li>
                <li><b>Response time</b><span>Portal messages answered within one business day</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── PROCESS ─────────────────────────────────────────────────── */}
        <section id="process" className="grey">
          <div className="wrap">
            <div className="tight" style={{ marginBottom: 42 }}>
              <span className="kicker">How it works</span>
              <h2 style={{ marginTop: 15 }}>Four steps, in this order, every time.</h2>
            </div>
            <div className="steps">
              {STEPS.map((s) => (
                <div className="step" key={s.h}><span className="when">{s.when}</span><h4>{s.h}</h4><p>{s.p}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW I PRACTICE ──────────────────────────────────────────── */}
        <section>
          <div className="wrap">
            <figure className="breakband" style={{ marginBottom: 52 }}>
              <img src="/labo/shot-04.jpg" width={1200} height={800} alt="A working desk in daylight, an open book and a pen set down" />
              <figcaption>Placeholder · shot 05, The room</figcaption>
            </figure>
            <div className="tight" style={{ marginBottom: 46 }}>
              <span className="kicker">How I practice</span>
              <h2 style={{ marginTop: 15 }}>Three commitments that decide what gets prescribed.</h2>
            </div>
            <div className="three">
              <div><h3>Labs before prescriptions</h3><p>If I do not have numbers, I do not have a plan, and neither do you.</p></div>
              <div><h3>One clinician</h3><p>You see me. Your history stays in one head and one chart.</p></div>
              <div><h3>Stop what is not working</h3><p>No measurable change by the follow-up panel and we change it or discontinue it.</p></div>
            </div>
          </div>
        </section>

        {/* ── PRICING — the lab row reused without the track ──────────── */}
        <section id="pricing" className="grey">
          <div className="wrap">
            <div className="tight" style={{ marginBottom: 42 }}>
              <span className="kicker">Pricing</span>
              <h2 style={{ marginTop: 15 }}>One monthly fee. Cancel any month.</h2>
              <p className="sub" style={{ marginTop: 17 }}>Medication, visits and messaging included. Labs billed separately and often billable to your insurance.</p>
            </div>
            <div className="labwrap">
              <div className="labhead"><h4>What you pay</h4><span className="kicker">Self-pay · superbills on request</span></div>
              {PRICES.map((r) => (
                <div className="mk" style={{ gridTemplateColumns: "1fr auto" }} key={r.name}>
                  <div className="nm">{r.name}<em>{r.note}</em></div>
                  <div className="val">{r.value}{r.unit && <span className="u">{r.unit}</span>}</div>
                </div>
              ))}
              <div className="labfoot"><span>Not charged: follow-up visits, dose adjustments, portal messages, refill requests, shipping.</span></div>
            </div>
          </div>
        </section>

        {/* ── CLOSE ───────────────────────────────────────────────────── */}
        <section className="close">
          <div className="wrap">
            <h2>Start with your numbers.</h2>
            <p className="sub" style={{ margin: "20px auto 0", maxWidth: "44ch" }}>Intake takes about ten minutes. Labs get drawn near you. You leave the visit with a plan you understand.</p>
            <div className="acts">
              <a className="btn btn-primary" href={HEALTHIE.intake} {...ext}>Start your intake</a>
              <a className="btn btn-ghost" href={HEALTHIE.book} {...ext}>Book a $149 consult</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
