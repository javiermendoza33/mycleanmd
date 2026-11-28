import Link from "next/link";
import { PageHero } from "@/components/labo/Sections";
import MethodSmsOptInForm from "@/components/labo/method/MethodSmsOptInForm";
import { METHOD, PRACTICE, AVAILABILITY } from "@/labo/content";
import { METHOD_SMS } from "@/labo/method/sms";

/** SMS program disclosure + opt-in for The Labo Method (Nov 23 2026). Public and indexable: carriers and 10DLC / toll-free
 *  reviewers must be able to open it from the form and the footer. Program facts, consent language, STOP/HELP, privacy, support. */
export const metadata = {
  title: "Text updates — SMS terms & opt-in",
  description: `How ${METHOD.name} uses text messages: what you get, how often, what it costs, how to stop, and how to sign up.`,
  alternates: { canonical: "/sms" },
  robots: { index: true, follow: true },
};

const FACTS: [string, React.ReactNode][] = [
  ["Program", METHOD_SMS.program],
  ["What you'll get", METHOD_SMS.what],
  ["How often", METHOD_SMS.frequency],
  ["Cost", `Message and data rates may apply, charged by your carrier. ${METHOD.name} charges nothing for these messages.`],
  ["Stop or help", <>Reply <b>STOP</b> to cancel at any time, or <b>HELP</b> for help. Questions: <a href={`mailto:${METHOD.email}`}>{METHOD.email}</a>.</>],
];
const TERMS: [string, string, string][] = [
  ["01", "What & how often", `${METHOD_SMS.what} ${METHOD_SMS.frequency} It is never a daily drip.`],
  ["02", "No medical details by text", METHOD_SMS.never],
  ["03", "Cost", `Message and data rates may apply, charged by your carrier. ${METHOD.name} charges nothing for these messages. Carriers are not liable for delayed or undelivered messages.`],
  ["04", "Opting out", "Reply STOP to any message to cancel. You will get one confirmation text and nothing more. Reply HELP or email us for help at any time."],
  ["05", "Optional", "Text consent is never a condition of signing up, buying a program or receiving care. Leave the box unchecked and we will not text you; your portal and email still carry every update."],
];

export default function MethodSmsPage() {
  return (
    <>
      <PageHero eyebrow="Text messaging" title={<>Text updates.</>} lede="Visit reminders, a nudge when your clinician replies, shipment and lab-ready alerts — about 2–6 texts a month, only if you ask for them, never with medical details inside." />
      <section className="smspage">
        <div className="wrap smsgrid">
          <div className="smsfacts">
            {FACTS.map(([k, v]) => <div className="smsfact" key={k}><span className="kicker">{k}</span><div>{v}</div></div>)}
            <p className="note">Texts are for logistics. They are not a secure channel: never send medical questions, photos or records by text — use your portal, which is private and encrypted.</p>
          </div>
          <MethodSmsOptInForm />
        </div>
      </section>
      <section className="mband">
        <div className="wrap">
          <div className="sechead"><span className="kicker">SMS terms</span><h2>What you're agreeing to.</h2></div>
          <div className="steps4 smsterms">{TERMS.map(([n, t, body]) => <div className="step" key={n}><span className="n">{n}</span><h3>{t}</h3><p>{body}</p></div>)}</div>
          <div className="smsrich">
            <h3>How you can opt in</h3>
            <ul><li>Ticking the text box on the form above (it is unchecked until you tick it).</li><li>Ticking the text box during <Link href="/start">Get started</Link>, which shows the same disclosure.</li><li>Replying to a text we send about your visit, after you have opted in.</li></ul>
            <h3>Privacy</h3>
            <p>Your mobile number and your text-message consent are never sold, rented or shared with third parties or affiliates for their marketing or promotional purposes. We share them only with the vendors that deliver our messages, and only to deliver them. Health information is never placed in a text message. The rest of our practices are in the <Link href="/privacy-policy">Privacy Policy</Link> and our <Link href="/legal">notices</Link>.</p>
            <h3>Support</h3>
            <p>Email <a href={`mailto:${METHOD.email}`}>{METHOD.email}</a>. {METHOD.name} serves residents of {AVAILABILITY} online; clinical services are provided by licensed clinicians.</p>
            <p className="note">Last updated November 23, 2026.</p>
          </div>
        </div>
      </section>
    </>
  );
}
