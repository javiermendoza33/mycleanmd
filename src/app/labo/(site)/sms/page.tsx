import Link from "next/link";
import { PageHero } from "@/components/labo/Sections";
import SmsOptInForm from "@/components/labo/SmsOptInForm";
import { PRACTICE } from "@/labo/content";
import { CLINIC_SITE as s } from "@/labo/clinic/site";

/** SMS program disclosure + opt-in (Nov 18 2026). Public and indexable: carriers and 10DLC/toll-free reviewers must be able
 *  to open it from the form and from the footer. Program facts, consent language, STOP/HELP, privacy statement, support. */
export const metadata = {
  title: "Text updates — SMS terms & opt-in",
  description: `How ${PRACTICE.name} uses text messages: what you get, how often, what it costs, how to stop, and how to sign up.`,
  alternates: { canonical: "/sms" },
};

const FACTS: [string, React.ReactNode][] = [
  ["Program", `${PRACTICE.name} appointment & care texts`],
  ["What you’ll get", "Appointment confirmations and reminders, pre- and post-treatment care instructions, replies when you text us to book, and occasional news about treatments and offers."],
  ["How often", "About 1–4 messages a month; a few more around an appointment (confirmation, reminder, aftercare). Frequency varies."],
  ["Cost", `Message and data rates may apply, charged by your carrier. ${PRACTICE.name} charges nothing for these messages.`],
  ["Stop or help", <>Reply <b>STOP</b> to cancel at any time, or <b>HELP</b> for help. Questions: <a href={`mailto:${PRACTICE.email}`}>{PRACTICE.email}</a> · <a href={s.tel}>{s.phoneDisplay}</a></>],
];

const TERMS: [string, string, string][] = [
  ["01", "What & how often", "Appointment confirmations, reminders and aftercare instructions, replies to your booking texts, and occasional treatment news. About 1–4 messages a month, more around an appointment. It is never a daily drip."],
  ["02", "Cost", `Message and data rates may apply, charged by your carrier. ${PRACTICE.name} charges nothing for these messages. Carriers are not liable for delayed or undelivered messages.`],
  ["03", "Opting out", "Reply STOP to any message to cancel. You will get one confirmation text and nothing more. Reply HELP, email us, or call the clinic for help at any time."],
  ["04", "Optional", "Text consent is never a condition of booking, buying or receiving treatment. Leave the box unchecked and we will not text you; you can still book by phone or online."],
];

export default function SmsPage() {
  return (
    <>
      <PageHero eyebrow="Text messaging" title={<>Text updates.</>}
        lede="Appointment reminders, aftercare instructions and replies to your booking texts — about 1–4 texts a month, only if you ask for them." />

      <section style={{ paddingTop: 48 }}>
        <div className="wrap ct">
          <div className="kvtiles">
            {FACTS.map(([k, v]) => (
              <div className="kvtile" key={k}>
                <span className="kicker">{k}</span>
                <div style={{ marginTop: 8, fontSize: "1.02rem", lineHeight: 1.45 }}>{v}</div>
              </div>
            ))}
            <p className="note">Texts are for scheduling and general care instructions. They are not a secure channel: never send medical questions, photos or records by text — use the patient portal or call us.</p>
          </div>
          <SmsOptInForm />
        </div>
      </section>

      <section className="grey">
        <div className="wrap">
          <span className="kicker">SMS terms</span>
          <h2 style={{ marginTop: 14 }}>What you’re agreeing to.</h2>
          <div className="cards" style={{ marginTop: 34 }}>
            {TERMS.map(([n, t, body]) => (
              <div className="tile" key={n}>
                <span className="kicker">{n}</span>
                <h3>{t}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <div className="rich" style={{ marginTop: 44, maxWidth: 760 }}>
            <h3>How you can opt in</h3>
            <ul style={{ marginTop: 10 }}>
              <li>Ticking the text box on the form above (it is unchecked until you tick it).</li>
              <li>Texting the clinic first at {s.phoneDisplay}, or replying to a text we send about your appointment.</li>
              <li>Checking the text-message box on the intake form at the clinic.</li>
            </ul>
            <h3 style={{ marginTop: 28 }}>Privacy</h3>
            <p>
              Your mobile number and your text-message consent are never sold, rented or shared with third parties or affiliates for their
              marketing or promotional purposes. We share them only with the vendors that deliver our messages, and only to deliver them.
              The rest of our practices are in the <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
            <h3 style={{ marginTop: 28 }}>Support</h3>
            <p>
              Email <a href={`mailto:${PRACTICE.email}`}>{PRACTICE.email}</a> · call or text <a href={s.tel}>{s.phoneDisplay}</a> ·
              {" "}{s.hours.map((h) => `${h.days} ${h.time}`).join(" · ")} · {s.locations[0].address1}, {s.locations[0].address2}.
            </p>
            <p className="note">Last updated November 18, 2026.</p>
          </div>
        </div>
      </section>
    </>
  );
}
