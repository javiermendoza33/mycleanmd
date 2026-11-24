import { METHOD } from "@/labo/content";

/** The Labo Method's SMS program (Nov 23 2026). The exact disclosure shown beside the UNCHECKED consent box on
 *  thelabomethod.com/sms and in the sign-up flow — echoed verbatim into every consent record. */
export const METHOD_SMS = {
  program: `${METHOD.name} care texts`,
  what: "Video-visit confirmations and reminders, a note when your clinician has replied in your portal, when a lab order or result is ready to view, when a shipment is on its way, and refill reminders.",
  frequency: "About 2–6 messages a month, more in the week of a visit or a shipment. Frequency varies.",
  never: "Texts never contain medical details — no results, diagnoses, medication names or dosing. They tell you something is waiting in your portal, which is private and encrypted.",
} as const;

export const METHOD_CONSENT_TEXT =
  `Yes, text me. I agree to receive recurring automated text messages from ${METHOD.name} at the mobile number provided: ` +
  `visit confirmations and reminders, alerts that a clinician reply, lab result or shipment update is waiting in my portal, ` +
  `and refill reminders — about 2–6 messages a month, more around a visit or shipment. Consent is not a condition of any purchase ` +
  `or treatment. Message and data rates may apply. Reply STOP to cancel, HELP for help. See our Privacy Policy and SMS Terms.`;
