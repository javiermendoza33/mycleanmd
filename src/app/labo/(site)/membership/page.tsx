import Link from "next/link";
import { PageHero } from "@/components/labo/Sections";
import { PRACTICE, METHOD } from "@/labo/content";
import { CLINIC_SITE } from "@/labo/clinic/site";

/**
 * /membership (Nov 21 2026, Javier: "tie in website and admin portal — a sign up to be a member feature… build that
 * into the site that links to portal, advertise why people should join").
 *
 * The "membership" IS the patient portal account (/portal): one free Supabase account that opens the portal on
 * thelabomethod.com — visits + Zoom links, the signed plan, medications, refill/product/lab requests, messages — and
 * the same account works for The Labo Method telehealth. Every perk below is something the portal already does; the
 * one soft promise is "members hear first" about offers/events, which the clinic keeps by emailing members.
 * Sign-up = /auth/signup?redirect=/portal (the Labo-styled page); members show up in the admin portal at /clinic/members.
 */
export const metadata = {
  title: "Become a member",
  description: `Join ${PRACTICE.name} for free: your visits, treatment plan and medications in one place, direct messages to the clinic, refills and product requests from your phone, and member offers first.`,
  alternates: { canonical: "/membership" },
};

const JOIN_HREF = "/auth/signup?redirect=%2Fportal";
const SIGNIN_HREF = "/auth/login?redirect=%2Fportal";

const PERKS = [
  { n: "01", t: "Your care, in one place", d: "Every visit, your treatment plan, notes from your provider and your medications — on your phone, any time, not in a drawer." },
  { n: "02", t: "Message the clinic directly", d: "A question between visits, a photo of how your skin is doing, a quick check-in. The team answers from the same portal." },
  { n: "03", t: "Requests without a phone call", d: "Refills, product re-orders and lab forms from your phone. We see them the moment they land." },
  { n: "04", t: "Faster booking", d: "Your details are saved, so booking the next appointment or a video visit takes a minute, not a form." },
  { n: "05", t: "Offers and news first", d: `New patients get ${CLINIC_SITE.promo.replace("New patients receive ", "").replace(/\.$/, "")}. Members hear first about new treatments, events and member-only offers.` },
  { n: "06", t: "One account, clinic and telehealth", d: `The same login works for in-clinic care and for ${METHOD.name} — hormone, weight and peptide care by video.` },
];

const STEPS = [
  { t: "Create your account", d: "Your name, email and a password. Under a minute, no card." },
  { t: "Confirm your email", d: "If we ask, tap the link we send you. That's your only extra step." },
  { t: "Your portal opens", d: "Book, message, request — and see everything from your visits in one place." },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero eyebrow="Members · free to join" title="Your clinic, in your pocket" lede="A free member account opens your private portal: visits, your plan, messages and requests in one place, with member offers first. Takes a minute." />
      <section className="joinhero">
        <div className="wrap">
          <div className="acts">
            <Link className="btn btn-primary rowbtn" href={JOIN_HREF}>Join free ›</Link>
            <Link className="btn btn-ghost" href={SIGNIN_HREF}>Already a member? Sign in</Link>
          </div>
          <p className="note">No fees, no card, no commitment. Your information stays between you and the clinic.</p>
        </div>
      </section>
      <section className="grey" style={{ paddingBlock: 70 }}>
        <div className="wrap">
          <div className="sechead"><span className="kicker">Why join</span><h2>Six reasons members say it&rsquo;s worth the minute</h2></div>
          <div className="perks">
            {PERKS.map((p) => <div key={p.n}><span className="num">{p.n}</span><h3>{p.t}</h3><p>{p.d}</p></div>)}
          </div>
        </div>
      </section>
      <section style={{ paddingBlock: 70 }}>
        <div className="wrap">
          <div className="sechead"><span className="kicker">How it works</span><h2>Three steps, one minute</h2></div>
          <ol className="steps">
            {STEPS.map((s, i) => <li key={s.t}><span className="num">{i + 1}</span><div><h3>{s.t}</h3><p>{s.d}</p></div></li>)}
          </ol>
          <div className="acts" style={{ marginTop: 34 }}>
            <Link className="btn btn-primary rowbtn" href={JOIN_HREF}>Join free ›</Link>
            <Link className="btn btn-ghost" href="/contact">Questions? Contact us</Link>
          </div>
        </div>
      </section>
      <section className="grey" style={{ paddingBlock: 60 }}>
        <div className="wrap values">
          <div><b>Private by design</b><p>Your portal is yours alone — signed in with your email and password, nothing shared, nothing sold.</p></div>
          <div><b>Not a subscription</b><p>Membership is an account, not a plan. You pay for treatments and products as you go, exactly as before.</p></div>
          <div><b>Already a patient?</b><p>Create the account with the email the clinic has for you and your history lines up. <Link href={SIGNIN_HREF}>Sign in</Link> if you already have one.</p></div>
        </div>
      </section>
    </>
  );
}
