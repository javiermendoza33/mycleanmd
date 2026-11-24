import type { LegalSection } from "@/labo/clinic/types";
import { METHOD, AVAILABILITY } from "@/labo/content";

/** The Labo Method privacy policy (Nov 23 2026, Javier: "sms part full compliance … terms privacy etc like the labo clinic").
 *  Website + account policy. Protected health information is governed by the Notice of Privacy Practices handed over in
 *  the clinical platform; this page says so and covers everything the website itself collects. The "Mobile information and
 *  text messages" section carries the carrier-required no-sharing language that 10DLC / toll-free reviewers look for. */
export const methodPrivacyUpdated = "November 23, 2026";

export const methodPrivacySections: LegalSection[] = [
  {
    paragraphs: [
      `${METHOD.name} ("we", "us") provides telehealth hormone, weight and peptide care by video to residents of ${AVAILABILITY}. This policy explains what we collect on ${METHOD.domain} and in your account, how we use it, who we share it with, and the choices you have.`,
      "Your medical record — intake answers reviewed by your clinician, visit notes, prescriptions, lab results and the messages you exchange with your clinician — is protected health information. It is held in our HIPAA-compliant clinical platform under a business associate agreement and governed by the Notice of Privacy Practices you receive when you start care. This page covers the website, your account and the communications around your care.",
    ],
  },
  {
    heading: "1. Information we collect",
    paragraphs: ["We collect only what the service needs:"],
    list: [
      "Account details: name, email address, password (stored hashed), date of birth, and the state you live in, which we must confirm before any visit.",
      "Program and intake answers you give during Get started, which are passed to our clinical platform so your clinician can review them.",
      "Payment details: your card is entered on and stored by Stripe, our payment processor. We keep only the last four digits, the card brand, and the record of what you paid for.",
      "Mobile number and text-message consent, if you choose to give them (see the mobile section below).",
      "Messages you send us by email, through the portal, or through the forms on this site.",
      "Technical data such as IP address, browser type and the pages you open on our marketing pages. We do not run analytics on sign-in, sign-up, intake or portal pages.",
    ],
  },
  {
    heading: "2. How we use it",
    paragraphs: ["We use this information to:"],
    list: [
      "Confirm you are eligible for care in a state where our clinician is licensed.",
      "Create and secure your account and portal.",
      "Pass your intake to the clinician who reviews it and coordinate your visits, prescriptions, labs and shipments.",
      "Bill the program fee and send receipts.",
      "Send the service communications you have asked for: visit confirmations, portal alerts, shipment and lab-ready notices.",
      "Answer your questions and keep records we are legally required to keep.",
      "Improve the website. We never use your health information for advertising.",
    ],
  },
  {
    heading: "3. Who we share it with",
    paragraphs: ["We do not sell your personal information. We share it only with the parties that deliver your care and run the service, and only what each one needs:"],
    list: [
      "The licensed clinician and clinical platform that provide your medical care, under HIPAA and a business associate agreement.",
      "Licensed pharmacies and laboratories that fill a prescription or process a lab order for you.",
      "Stripe, for payment processing; our email and text-message delivery vendors, to deliver the messages you asked for; and our hosting providers.",
      "Your primary care provider, when you ask us to share notes or results.",
      "Authorities, when the law requires it, or to protect the safety of a patient or the public.",
    ],
  },
  {
    heading: "Mobile information and text messages",
    paragraphs: [
      `If you give us your mobile number and tick the text-message box on our website, during Get started, or by replying to a text we send, we may send you video-visit confirmations and reminders, a note when your clinician has replied in your portal, lab-ready and shipment alerts, refill reminders and occasional program news — about 2–6 messages a month, more in the week of a visit or a shipment. Texts never contain medical details. Message and data rates may apply. Reply STOP to any message to cancel or HELP for help. Consent to text messages is never a condition of signing up, buying a program or receiving care.`,
      "No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Your mobile number and your text-message consent are never sold, rented or shared with third parties or affiliates for their marketing. All other categories of information above exclude mobile opt-in data; we share your number only with the vendor that delivers our messages, and only to deliver them. Our full text-message terms are at /sms.",
    ],
  },
  {
    heading: "4. Cookies and analytics",
    paragraphs: [
      "We use a session cookie to keep you signed in and a small number of first-party cookies to remember your preferences. Our marketing pages use Google Analytics to count visits; it is not loaded on sign-in, sign-up, intake or portal pages, and it never receives your name, email or health information. You can block cookies in your browser; signing in requires the session cookie.",
    ],
  },
  {
    heading: "5. Your choices and rights",
    paragraphs: ["You can at any time:"],
    list: [
      "See and correct your account details in your portal, or ask us to by email.",
      "Stop text messages by replying STOP, or change your email preferences by writing to us.",
      "Ask for a copy of the personal information we hold about you, or ask us to delete your account. Medical records are kept for the period required by law and released through the Notice of Privacy Practices process.",
      "California residents have additional rights under the California Consumer Privacy Act, including the right to know, delete and opt out of sale; we do not sell personal information. Washington residents have rights under the My Health My Data Act over consumer health data. Write to us to exercise any of them; we will not treat you differently for doing so.",
    ],
  },
  {
    heading: "6. Security",
    paragraphs: [
      "Data is encrypted in transit and at rest. Access to clinical information is limited to the people treating you and the staff who support them, and is logged. No system is perfectly secure; if a breach affects your information we will tell you as the law requires.",
    ],
  },
  {
    heading: "7. Children",
    paragraphs: [`${METHOD.name} treats adults only. We do not knowingly collect information from anyone under 18, and we will delete it if we learn we have.`],
  },
  {
    heading: "8. Changes",
    paragraphs: ["When this policy changes we update the date at the top of this page. Material changes to how we use your information are announced in your portal or by email before they take effect."],
  },
  {
    heading: "9. Contact",
    paragraphs: [`Questions, requests and complaints: ${METHOD.email}. Do not send medical questions by email; use your portal, which is private and encrypted. If this is an emergency, call 911.`],
  },
];
