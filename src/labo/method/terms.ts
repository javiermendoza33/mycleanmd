import type { LegalSection } from "@/labo/clinic/types";
import { METHOD, AVAILABILITY, EXTRA_PRICING } from "@/labo/content";

/** The Labo Method terms of use (Nov 23 2026). The website / account / billing terms; the clinical disclaimers, telehealth
 *  consent, compounded-medication and controlled-substance notices stay on /legal and are referenced here. Attorney review
 *  pending (same status as /legal — see content.ts LAUNCH_READY). */
export const methodTermsUpdated = "November 23, 2026";
const consult = EXTRA_PRICING[0];

export const methodTermsSections: LegalSection[] = [
  {
    paragraphs: [
      `These terms govern your use of ${METHOD.domain}, your account and the programs offered by ${METHOD.name} ("we", "us"). By creating an account or starting a program you agree to them, to our Privacy Policy, and to the disclaimers and telehealth consent at /legal. If you do not agree, do not use the service.`,
    ],
  },
  {
    heading: "1. Who can use the service",
    list: [
      "You must be 18 or older.",
      `You must be a resident of, and physically located in, ${AVAILABILITY} at the time of any video visit. Telehealth rules require the clinician to hold a licence in the state you are in.`,
      "You must give accurate, complete information about yourself and your health, and keep it current. Care decisions depend on it.",
      "You may not use the service for anyone but yourself.",
    ],
    paragraphs: [],
  },
  {
    heading: "2. Not for emergencies",
    paragraphs: ["The service does not provide emergency or urgent care and is not monitored around the clock. If you have a medical emergency, call 911 or go to the nearest emergency department. Portal messages are answered within one business day."],
  },
  {
    heading: "3. The website is not the clinician",
    paragraphs: [
      "Content on this website is general information and is not medical advice. Medical care is provided only by the licensed clinician after a video visit and a review of your labs, under the telehealth consent at /legal. Starting a program does not guarantee that any medication will be prescribed; prescribing is always the clinician's decision. Compounded medications and certain peptides carry the notices described at /legal.",
    ],
  },
  {
    heading: "4. Your account",
    paragraphs: ["Keep your password private and tell us at once if you think your account has been used without your permission. You are responsible for activity under your account. We may suspend an account that is used to abuse staff, obtain medication under false pretences, or break these terms."],
  },
  {
    heading: "5. Programs, fees and billing",
    list: [
      "Program fees are monthly, charged to the card on file, and stated on the pricing page and the program page before you pay. The fee covers visits, portal messaging, dose adjustments, refills and shipping as described for that program.",
      "Lab work is billed separately by the laboratory and can often go through your insurance. Medication availability and compounded pricing vary by pharmacy.",
      `A one-time consultation (${consult.price}) is credited toward your first month if you begin a program.`,
      "You may cancel any month. Cancellation stops future charges; the current month is not refunded. If you stop a hormone or GLP-1 program your clinician gives you a written taper or maintenance plan.",
      "Program fees are self-pay. We do not bill insurance for program fees; superbills are available on request.",
      "Prices may change. We tell you in your portal or by email before a change applies to you.",
    ],
    paragraphs: [],
  },
  {
    heading: "6. Text messages",
    paragraphs: ["Text messages are optional and governed by our SMS terms at /sms. Consent is never a condition of signing up, buying a program or receiving care. Reply STOP to cancel, HELP for help; message and data rates may apply."],
  },
  {
    heading: "7. Acceptable use",
    paragraphs: ["Do not misuse the website: no attempts to access other accounts, interfere with the service, scrape it, or use it for any unlawful purpose. Do not share prescription medication prescribed to you with anyone else."],
  },
  {
    heading: "8. Our content",
    paragraphs: [`The text, design, code and images on ${METHOD.domain} belong to ${METHOD.name} or its licensors. You may use them for your personal, non-commercial use of the service and for nothing else without written permission.`],
  },
  {
    heading: "9. Disclaimers and limits",
    paragraphs: [
      "The website is provided as is. We work to keep it accurate and available but do not promise that it will be error-free or uninterrupted. Nothing in these terms limits the clinician's professional duties to you, or any right you have under law that cannot be limited by contract. To the extent the law allows, our liability for any claim relating to the website or your account (other than claims arising from medical care) is limited to the program fees you paid us in the three months before the claim.",
    ],
  },
  {
    heading: "10. Changes and contact",
    paragraphs: [`When these terms change we update the date at the top of this page and, for material changes, tell you in your portal or by email before they take effect. Questions: ${METHOD.email}.`],
  },
];
