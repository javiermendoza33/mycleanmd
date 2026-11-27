import type { Program } from "@/labo/content";

/**
 * The Labo Method — the words that used to sit inline in the page files, English (Nov 27 2026).
 * Lifted verbatim when the Spanish version was added, so the English pages read exactly as before.
 * `UI` is the shape; ui.es.ts must match it (TypeScript checks every key).
 * A two-part array is a headline: [plain part, the part drawn in the accent colour].
 */
export type GateReason = "glp1" | "pep" | "trt" | "hrt" | "unsure";
export type DemoScene = { chip: string; q: string; tool: string; args: string; head: string; rows: { who: string; what: string }[]; out: string[] };

export const UI_EN = {
  /** Shown on the switch: the name of the OTHER language, in that language. */
  switchLabel: "Español",
  switchShort: "ES",
  switchAria: "Ver este sitio en español",
  ogLocale: "en_US",
  mo: "/mo",
  perMo: " / mo",
  programN: (i: string) => `Program ${i}`,
  programFee: "Program fee",
  getStarted: "Get started",
  learnMore: "Learn more",
  startIntake: "Start your intake",
  bookConsult: (price: string) => `Book a ${price} consult`,
  /** Short program names for buttons and the plan picker. */
  short: { "glp-1-weight-management": "GLP-1", "peptide-therapy": "Peptides", "testosterone-for-men": "TRT", "hormone-therapy-for-women": "HRT" } as Record<string, string>,

  meta: {
    homeTitle: "Telehealth hormone, weight & peptide care",
    homeDesc: (tagline: string, a: string) => `${tagline} Real labs first, a real dose plan, a clinician actually watching. Available in ${a}.`,
    programs: "Programs",
    programsDesc: (a: string) => `Telehealth hormone and metabolic programs for residents of ${a}.`,
    pricing: "Pricing",
    pricingDesc: "One monthly fee. Medication, visits and messaging included. GLP-1 $299, peptides $249, testosterone $199, hormone therapy for women $199.",
    how: "How it works",
    howDesc: "Intake, labs, a video visit, then treatment. Four steps, and none of them are a questionnaire that prescribes itself.",
    faq: "FAQ",
    faqDesc: "Licensure, insurance, using labs you already have, how fast you can start, who prescribes, and how to cancel.",
    signin: "Sign in",
    signinDesc: (n: string) => `Patient sign-in for ${n} is coming soon.`,
    book: "Book a consult",
    bookDesc: (n: string) => `Online consult booking for ${n} is coming soon.`,
    join: (n: string) => `Join · ${n}`,
    notFound: "Not found",
  },

  chrome: {
    skip: "Skip to content",
    notice: "Notice",
    promo: (a: string) => `Available in ${a} · one monthly fee, cancel any month · `,
    promoLink: "See pricing →",
    home: (n: string) => `${n} — home`,
    primary: "Primary",
    signIn: "Sign in",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    language: "Language",
    inPerson: (n: string) => `${n} (in person) ↗`,
    footH: "Care designed around your numbers.",
    footSub: (a: string) => `By video, for residents of ${a}.`,
    programs: "Programs",
    learn: "Learn",
    journal: "",   // English: the Journal is already in the nav
    legal: "Legal & disclaimers",
    terms: "Terms of use",
    privacy: "Privacy policy",
    sms: "SMS terms",
    a11y: "Accessibility",
    patients: "Patients",
    book: "Book a consult",
    startAnIntake: "Start an intake",
    inPersonK: "In person",
    injectables: "Injectables & laser",
    shop: "Skincare shop",
    rights: "All rights reserved.",
    legalShort: "Legal",
    termsShort: "Terms",
    privacyShort: "Privacy",
    smsShort: "SMS terms",
    a11yShort: "Accessibility",
    /** A line under the footer columns for what is not translated yet; empty in English. */
    englishOnly: "",
  },

  home: {
    tag: (a: string) => `Licensed clinicians · care in ${a}`,
    h1: ["Weight loss and hormone care, ", "prescribed online."],
    sub: "GLP-1s, peptides, testosterone and menopause care, each one started from your own labs and adjusted by a clinician who is actually watching. Visits by video, medication shipped from a licensed US pharmacy.",
    mostChosen: "Most chosen",
    glpExtra: " Visits, messaging and dose changes included.",
    perMonth: "per month",
    offer2: "Peptides · TRT · hormone therapy",
    offer2P: "Three more programs, the same labs-first method. Pick one, or start with a consult.",
    from: "from",
    cta1: "See where I would start",
    cta2: "Browse programs",
    trust: ["No hidden fees", "Cancel any month", "Licensed US pharmacies", "Labs first, always"],
    howK: "How it works",
    howH: "Four steps to your treatment.",
    howSub: "Intake takes about ten minutes. Labs get drawn near you. You leave the video visit with a plan you understand.",
    howBtn: "The full walk-through",
    progK: "Programs",
    progH: ["Treatment paths ", "built on your labs."],
    allPrograms: "All programs",
    asLow: "As low as",
    start: (p: Program) => `Start ${p.name.split(" ")[0]}`,
    fine: " Prescription medication requires a video visit and a written prescription from the clinician; compounded preparations are not FDA-approved or evaluated for safety, effectiveness or quality.",
    planK: "Your plan",
    planH: ["One monthly fee, ", "nothing hidden."],
    planSub: "The program fee covers your visits, portal messaging, dose adjustments, refills and shipping. Labs are billed separately and can often go through your insurance.",
    card1B: "Start a program",
    card1P: "Intake, labs, a video visit, then medication to your door. Monthly, cancel any month, with a written taper plan if you stop.",
    card2B: "Or just a consultation",
    card2P: (price: string, note: string) => `${price}, one time. ${note}`,
    fullPricing: "Full pricing",
    inclK: "Every program includes",
    faqK: "FAQ",
    faqH: ["The short ", "answers."],
    faqSub: "Still unsure? Message us through the portal, or email ",
    allQ: "All questions",
    journal: true,
    journalK: "Journal",
    journalH: ["What the evidence ", "actually shows."],
    readAll: "Read all",
    readMore: "Read more",
    closeH: ["Start with ", "your numbers."],
    closeNote: (a: string) => `Available to residents of ${a}. Intake takes about ten minutes.`,
    xK: (n: string) => `Also from ${n}`,
    xP: "Need to be seen in person? Botox, fillers, laser and skin treatments at our Seattle clinic.",
    xBtn: (n: string) => `Visit ${n} ↗`,
  },

  programs: {
    eyebrow: "Telehealth programs",
    h1: "What brings you here?",
    sub: (a: string) => `Every program starts the same way: real labs, a real plan, and a clinician who is actually watching. Available in ${a}.`,
    imgAlt: "A diverse group of women standing close together",
  },

  program: {
    plainK: "Worth saying plainly",
    readFaq: "Read the FAQ",
    readEvidence: "Read the evidence",
    otherK: "Other programs",
    otherH: "Every one begins with a panel.",
  },

  closing: {
    title: "Start with your numbers.",
    lede: "Intake takes about ten minutes. Labs get drawn near you. You leave the visit with a plan you understand.",
    note: (a: string) => `Available to residents of ${a}.`,
  },

  pricing: {
    eyebrow: "Pricing",
    title: "One monthly fee. Cancel any month.",
    lede: "No membership on top of the program, no per-message charge, and no lock-in. Labs are billed separately and can often go through your insurance.",
    imgAlt: "A small group talking and laughing together",
    choose: "Choose this program",
    beyond: "Beyond the monthly fee",
    selfPay: "Self-pay · superbills on request",
  },

  how: {
    eyebrow: "How it works",
    title: "Four steps, and none of them are a questionnaire that prescribes itself.",
    lede: "Every program follows the same path. What changes is the panel we order and the protocol we build from it.",
    getK: "What you get",
    getH: "Included in every program.",
  },

  faq: {
    eyebrow: "Frequently asked",
    title: "Before you start",
    unsureH: "Still unsure whether this fits?",
    unsureP: "Book a consult and ask. There is no obligation to start a program.",
  },

  gate: {
    h: "See where you would start",
    p: "One question, about five seconds.",
    /** Shown with the result. Nov 27 2026: the "where do you live" question went away with the two-state limit. */
    everywhere: (a: string) => `Care is available in ${a}, with a clinician licensed where you live.`,
    what: "What brought you here?",
    choose: "Choose a starting point",
    opts: { glp1: "Weight that will not move", pep: "Recovery, sleep and performance", trt: "Low energy or low testosterone", hrt: "Perimenopause or menopause", unsure: "I am not sure yet" } as Record<GateReason, string>,
    panel: {
      glp1: "metabolic panel with HbA1c, fasting insulin and lipids",
      pep: "baseline panel with IGF-1 and inflammatory markers",
      trt: "full endocrine work-up with hematocrit and PSA",
      hrt: "hormone panel with estradiol, FSH and progesterone",
      unsure: "broad baseline panel",
    } as Record<GateReason, string>,
    /** `program` is the program's name, or null for "not sure yet". */
    result: (program: string | null, panel: string) => `You would start on ${program ?? "a starting consult"}. Your first panel would be a ${panel}, drawn at a lab near you.`,
    yes: "Here is where you would start.",
    eligibleSteps: ["Ten-minute intake in the secure portal", "Lab order sent, drawn near you in 2 to 5 days", "Video visit once results land, protocol agreed together"],
    startMy: "Start my intake",
  },

  plan: {
    aria: "Choose a program",
    cancel: "Cancel any month",
    whatYouPay: "What you pay",
    feeSmall: "Visits, messaging, dose changes, refills",
    labsSmall: "Often billable to insurance",
    followRow: "Follow-ups, messages, refills, shipping",
    included: "Included",
    chips: ["No hidden fees", "Cancel any month", "Written protocol you keep"],
    /** `short` is the button label for the program (t.short); `slug` lets a language phrase it differently. */
    start: (short: string, slug: string) => (slug ? `Start ${short}` : `Start ${short}`),
    noteOr: "Or ",
    noteLink: (price: string) => `book a ${price} consult`,
    noteRest: " first — it is credited toward your first month. Program fees are self-pay; medication availability and compounded pricing vary by pharmacy.",
  },

  demo: {
    aria: "A demo of The Labo Method with a fictional patient",
    clinician: "Your clinician",
    live: "Labs connected",
    examples: "Example requests",
    foot: "A demo with a fictional patient, sources and results.",
    replay: "↻ Replay",
    playing: "Playing…",
    scenes: [
      { chip: "Start GLP-1", q: "Can I start a GLP-1? My last A1c was borderline.", tool: "check_eligibility", args: '{"program":"glp-1"}', head: "Building your plan",
        rows: [{ who: "Metabolic panel", what: "Lab draw near you · received" }, { who: "Clinician review", what: "Board-certified NP · 24 h" }, { who: "Licensed US pharmacy", what: "Semaglutide · ships in 2–3 days" }],
        out: ["A1c 5.9% · fasting glucose 104 → eligible", "Start 0.25 mg weekly, step up over 4 weeks", "Video visit Tue 10:20 AM · dose changes included"] },
      { chip: "Check my hormones", q: "My energy has been low for months. What should we test?", tool: "order_labs", args: '{"panel":"hormone"}', head: "Ordering your labs",
        rows: [{ who: "Hormone panel", what: "Testosterone, estradiol, TSH, CBC, metabolic" }, { who: "Draw site", what: "12 locations near you · no appointment" }, { who: "Results", what: "2–3 days · reviewed within 24 h" }],
        out: ["Your plan is written from your numbers, not a quiz", "Video visit booked Thu 4:40 PM", "Messaging with your clinician, included"] },
      { chip: "Refill my prescription", q: "I'm down to my last dose. Can you refill it?", tool: "refill", args: '{"med":"semaglutide 0.5 mg"}', head: "Checking your refill",
        rows: [{ who: "Progress", what: "−11 lb in 8 weeks · no side effects logged" }, { who: "Clinician approval", what: "Same dose · 14 min" }, { who: "Pharmacy", what: "Ships Tuesday · tracking by text" }],
        out: ["Refill approved, no visit needed", "Next step-up reviewed at week 12", "Cancel any month, no hidden fees"] },
    ] as DemoScene[],
  },

  signin: {
    tag: "Patient portal",
    h1: ["Sign-in is ", "coming soon."],
    sub: "We’re finishing the patient portal — video visits, your written protocol, medications, refill requests and messages, all in one place. New patients can still start today.",
    start: "Start a program",
    how: "How it works",
    note1: "Already a patient? Email ",
    note2: (a: string) => ` and we’ll get back to you. Available to residents of ${a}.`,
  },

  book: {
    tag: "Consultations",
    h1: ["Online booking is ", "coming soon."],
    sub: (price: string, note: string) => `The ${price} consultation — a video visit to go through your history, your goals and which labs to draw — will be bookable here. ${note}`,
    email: "Email to request a consult",
    subject: "Consultation request",
    see: "See the programs",
    note: (a: string) => `Tell us your state, what brought you here, and a good time to reach you. Available to residents of ${a}.`,
  },

  join: {
    checkout: "Continue to secure checkout",
    notConnected: "Checkout isn’t connected yet for this program — Stripe pricing still needs to be set up.",
  },
};

export type UI = typeof UI_EN;
