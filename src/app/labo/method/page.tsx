import Link from "next/link";
import { PROGRAMS, AVAILABILITY, METHOD, PRACTICE, HOW_SHORT, INCLUDED, CLINICIAN, FAQ, HEALTHIE, EXTRA_PRICING, PRICING_FOOTNOTE } from "@/labo/content";
import { posts } from "@/labo/method/posts";
import { MethodDemo } from "@/components/labo/method/MethodDemo";
import Gate from "./Gate";
import PlanPicker from "./PlanPicker";

/**
 * The Labo Method home — rebuilt Nov 22 2026 on joinmochi.com's page pattern (Javier: "revamp totally to look more
 * like this"): hero with two offer cards and a media card · blue "how it works" band · program cards with
 * "as low as" prices · plan picker with a what-you-pay table · the clinician · the eligibility gate · numbered FAQ ·
 * journal · closing CTA. Every number comes from content.ts (the same unconfirmed placeholders flagged there —
 * still noindex until LAUNCH_READY). No testimonials, ratings or member counts: we have none to show honestly.
 */
const JOURNAL_TEASER = [
  "glp-1-weight-loss-what-the-evidence-shows",
  "peptide-therapy-what-we-know-and-dont",
  "testosterone-therapy-for-men-what-to-know",
  "hormone-therapy-for-women-the-new-evidence",
].map((slug) => posts.find((p) => p.slug === slug)!);

const lowest = Math.min(...PROGRAMS.map((p) => Number(p.price.replace(/[^0-9.]/g, ""))));
const glp = PROGRAMS[0];
const consult = EXTRA_PRICING[0];

export default function MethodHome() {
  return (
    <>
      <section className="mhero">
        <div className="wrap">
          <div>
            <span className="tag">Board-certified nurse practitioner · licensed in {AVAILABILITY}</span>
            <h1>Weight loss and hormone care, <em>prescribed online.</em></h1>
            <p className="sub">GLP-1s, peptides, testosterone and menopause care, each one started from your own labs and adjusted by a clinician who is actually watching. Visits by video, medication shipped from a licensed US pharmacy.</p>
            <div className="offers">
              <Link href={`/programs/${glp.slug}`} className="offer lead">
                <span className="flag">Most chosen</span>
                <div><span className="lbl">{glp.name}</span><p>{glp.navBlurb} Visits, messaging and dose changes included.</p></div>
                <div className="amt"><small>per month</small><b>{glp.price}<span>/mo</span></b></div>
              </Link>
              <Link href="/programs" className="offer">
                <div><span className="lbl">Peptides · TRT · hormone therapy</span><p>Three more programs, the same labs-first method. Pick one, or start with a consult.</p></div>
                <div className="amt"><small>from</small><b>${lowest}<span>/mo</span></b></div>
              </Link>
            </div>
            <div className="acts">
              <a className="btn btn-primary" href="#eligible">See if I can treat you</a>
              <Link className="btn btn-ghost" href="/programs">Browse programs</Link>
            </div>
            <ul className="trust"><li>No hidden fees</li><li>Cancel any month</li><li>Licensed US pharmacies</li><li>Labs first, always</li></ul>
          </div>
          {/* Nov 23 2026: the self-playing "Your clinician" card (Flexpa-style) replaces the hero video */}
          <MethodDemo />
        </div>
      </section>

      <section className="mband">
        <div className="wrap">
          <div className="sechead"><span className="kicker">How it works</span><h2>Four steps to your treatment.</h2><p className="sub">Intake takes about ten minutes. Labs get drawn near you. You leave the video visit with a plan you understand.</p></div>
          <div className="steps4">
            {HOW_SHORT.map((s) => <div className="step" key={s.n}><span className="n">{s.n}</span><h3>{s.title}</h3><p>{s.body}</p></div>)}
          </div>
          <p style={{ marginTop: 22 }}><Link className="btn btn-soft" href="/how-it-works">The full walk-through</Link></p>
        </div>
      </section>

      <section id="programs">
        <div className="wrap">
          <div className="rowhead"><div className="sechead"><span className="kicker">Programs</span><h2>Treatment paths <em>built on your labs.</em></h2></div><Link className="more" href="/programs">All programs</Link></div>
          <div className="pcards">
            {PROGRAMS.map((p) => (
              <article className="pcard" key={p.slug}>
                <span className="kicker">Program {p.index}</span>
                <h3>{p.name}</h3>
                <p>{p.cardBlurb}</p>
                <div className="pr"><span>As low as</span><b>{p.price}</b><span>/mo</span></div>
                <Link className="btn btn-primary" href={`/join/${p.slug}`}>Start {p.name.split(" ")[0]}</Link>
                <Link className="more" href={`/programs/${p.slug}`}>Learn more</Link>
              </article>
            ))}
          </div>
          <p className="fineprint">{PRICING_FOOTNOTE} Prescription medication requires a video visit and a written prescription from the clinician; compounded preparations are not FDA-approved or evaluated for safety, effectiveness or quality.</p>
        </div>
      </section>

      <section className="grey" id="pricing">
        <div className="wrap plan">
          <div>
            <span className="kicker">Your plan</span>
            <h2 style={{ marginTop: 12 }}>One monthly fee, <em>nothing hidden.</em></h2>
            <p className="sub" style={{ marginTop: 14 }}>The program fee covers your visits, portal messaging, dose adjustments, refills and shipping. Labs are billed separately and can often go through your insurance.</p>
            <div className="cards2">
              <div><b>Start a program</b><p>Intake, labs, a video visit, then medication to your door. Monthly, cancel any month, with a written taper plan if you stop.</p></div>
              <div><b>Or just a consultation</b><p>{consult.price}, one time. {consult.note}</p></div>
            </div>
            <p style={{ marginTop: 18 }}><Link className="more" href="/pricing">Full pricing</Link></p>
          </div>
          <PlanPicker />
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="clin">
            <div><blockquote>{CLINICIAN.quote}</blockquote><p className="who">{CLINICIAN.body}</p></div>
            <div><span className="kicker">Every program includes</span><ul style={{ marginTop: 14 }}>{INCLUDED.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="grey" id="eligible" style={{ paddingTop: 64 }}>
        <div className="wrap tight"><Gate /></div>
      </section>

      <section>
        <div className="wrap mfaq">
          <div className="sechead"><span className="kicker">FAQ</span><h2>The short <em>answers.</em></h2><p className="sub">Still unsure? Message us through the portal, or email <a href={`mailto:${METHOD.email}`}>{METHOD.email}</a>.</p><p style={{ marginTop: 14 }}><Link className="more" href="/faq">All questions</Link></p></div>
          <ol className="qa">
            {FAQ.slice(0, 5).map((f, i) => (
              <li key={f.q}><details><summary><span className="n">{i + 1}</span>{f.q}<span className="pm" aria-hidden="true">+</span></summary><div className="a">{f.a}</div></details></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grey">
        <div className="wrap">
          <div className="rowhead"><div className="sechead"><span className="kicker">Journal</span><h2>What the evidence <em>actually shows.</em></h2></div><Link className="more" href="/blog">Read all</Link></div>
          <div className="jcards">
            {JOURNAL_TEASER.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="jcard">
                <img src={p.image.src} alt={p.image.alt} loading="lazy" />
                <div className="cb"><h3>{p.title}</h3><p>{p.excerpt}</p><span className="more">Read more</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="close">
        <div className="wrap">
          <h2>Start with <em>your numbers.</em></h2>
          <div className="acts">
            <a className="btn btn-primary" href={HEALTHIE.intake}>Start your intake</a>
            <a className="btn btn-ghost" href={HEALTHIE.book}>Book a {consult.price} consult</a>
          </div>
          <p className="note">Available to residents of {AVAILABILITY}. Intake takes about ten minutes.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="xclinic">
            <div><span className="kicker">Also from {PRACTICE.name}</span><p>Need to be seen in person? Botox, fillers, laser and skin treatments at our Seattle clinic.</p></div>
            <a className="btn btn-ghost" href={`https://${PRACTICE.domain}`}>Visit {PRACTICE.name} ↗</a>
          </div>
        </div>
      </section>
    </>
  );
}
