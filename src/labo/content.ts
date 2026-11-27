/**
 * The Labo Method — all site copy, in one place.
 *
 * Lifted verbatim from the design handoff. The handoff is explicit that the
 * prototype's single-page state should NOT be carried over: this site's whole
 * job is organic discovery, so every view is a real route with a real URL and
 * its own metadata. Copy lives here so the routes stay layout.
 *
 * ⚠️ LICENSURE. The handoff flags this as blocking, and it is a compliance
 * surface rather than a copy detail. Its own eight locations disagreed: the
 * homepage stat said "17 states" while the hero eyebrow, CTA note, footer,
 * FAQ and the Legal scope-of-licensure section all said California and
 * Washington only. Every claim about WHERE CARE IS AVAILABLE now says
 * California and Washington — the conservative reading, and the one the
 * legally-bearing sections already used. `credentials` still lists the states
 * on the provider's CV, because licences held and states served are different
 * claims. The "17 states" stat is gone. Confirm the authoritative list with
 * Monika before launch and change AVAILABILITY below, not the strings.
 */

/**
 * ⚠️ ONE SWITCH GUARDS SEARCH INDEXING.
 *
 * The site is LIVE at thelabomethod.com and fully functional, but flagged
 * noindex until the handoff's blocking items are confirmed by Monika:
 *
 *   1. PRICING — $299 / $249 / $199 / $199 / $149 and the $99–$249 lab range
 *      are the handoff's own market-standard placeholders, not confirmed rates.
 *      Publishing prices a practice has not agreed to is the real risk here.
 *   2. LEGAL — /legal and every clinical claim on the program pages are draft
 *      language written to be reviewed. Attorney and malpractice-carrier
 *      sign-off before this is indexed.
 *   3. HEALTHIE — every CTA points at the bare app.gethealthie.com. Real login,
 *      intake and booking URLs go in HEALTHIE below.
 *   4. LICENSURE — see the note on AVAILABILITY.
 *
 * Flip to true and redeploy once those are settled. It is the only change
 * needed: it drives both the robots meta tag and /robots.txt.
 */
export const LAUNCH_READY = false;

/**
 * Nov 18 2026 — SPLIT GATE (Javier: "we do need to work on seo plan with indexing").
 * The clinic pages (home, services, about, contact, booking, patient care, testimonials, blog, privacy) carry
 * copy that has been public on skinhavenclinic.com for years, so they are indexable now. The telehealth
 * programs, pricing, how-it-works, join, legal and FAQ pages — and /treatments with its placeholder laser
 * prices — stay noindex until LAUNCH_READY flips. GATED is the single list that drives the per-page robots
 * meta, /robots.txt and the sitemap.
 */
export const CLINIC_INDEX = true;
// Nov 19 2026: the telehealth paths (programs/pricing/how-it-works/join/legal/faq)
// moved off this host entirely, onto method.thelabomethod.com — see METHOD below
// and src/app/labo/method/*. Only /treatments (the clinic's own laser menu,
// placeholder prices) is still gated on THIS host.
export const GATED = ["/treatments"] as const;
export const isGated = (path: string) => GATED.some((g) => path === g || path.startsWith(g + "/"));
/** Spread into a gated page's metadata: `...GATE_ROBOTS` */
export const GATE_ROBOTS = LAUNCH_READY ? {} : { robots: { index: false, follow: true } };

// Nov 27 2026 (Javier: "we will be in 50 states now… remove [WA and CA] and replace all 50 states"): the Method serves every state
// through clinicians licensed where the patient lives, so the copy no longer speaks as one nurse practitioner licensed in two states.
// History: Nov 6 2026 "California and Washington"; Oct 26 2026 Washington only.
// ⚠️ The sign-up still offers only the states the clinical platform returns (the Cuvo sandbox listed 20 on Nov 24 2026) — confirm
// the live list really is all 50, per program, before this claim is promoted.
export const AVAILABILITY = "all 50 states";

export const PRACTICE = {
  name: "The Labo Clinic",
  subline: "Injectables, Skincare & Wellness",
  footerSubline: "Injectables, Skincare & Wellness",
  domain: "thelaboclinic.com",   // Nov 22 2026: the clinic moved to its own domain; thelabomethod.com = telehealth
  provider: "Monika Jauregui, DNP, NP-C",
  email: "hello@thelabomethod.com",
  // Handoff open item #5: the provider's personal mobile is deliberately not
  // published, and no practice line exists yet. Rendering a [bracket] on a
  // live medical site is worse than omitting the row — Contact skips it.
  phone: null as string | null,
  hours: "Monday to Friday, 9am to 5pm Pacific",
  portal: "app.gethealthie.com",
} as const;

/**
 * Every conversion path lands on Healthie, the white-label platform.
 * Handoff open item #2: these are still the bare placeholder. When the real
 * instance exists, change these four constants and nothing else — no CTA in
 * the codebase hardcodes a URL.
 */
/** Nov 22 2026 (Javier: "we may not use Healthie, we are deciding on the EMR"): until the practice picks its EMR /
 *  patient portal, every portal link stays ON this site — sign-in and consult booking land on "coming soon" pages,
 *  intake sends people to the programs, and a program's own CTA goes to its /join page. Replace these four values
 *  with the chosen vendor's URLs (and put target="_blank" back at the call sites) when the EMR is decided. */
export const HEALTHIE = {
  login: "/signin",
  intake: "/programs",
  book: "/book",
  program: (slug: string) => `/start?program=${slug}`,   // Nov 23 2026: the Cuvo-backed sign-up flow
} as const;

export const NAV = [
  // Nov 18 2026: the clinic site's navigation (Javier: "make TLM like the site was").
  { label: "Treatments", href: "/services" },
  { label: "Shop", href: "/shop" },   // Nov 19 2026: the skincare shop
  { label: "Laser", href: "/treatments" },
  { label: "About", href: "/about" },
  { label: "Patient Care", href: "/patient-care" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "Members", href: "/membership" },   // Nov 21 2026: the free portal account, sold on /membership
  { label: "Contact", href: "/contact" },
] as const;

export interface Program {
  slug: string;
  index: string;
  name: string;
  navBlurb: string;
  cardBlurb: string;
  lede: string;
  price: string;
  priceMeta: string;
  priceNote: string;
  /** Stripe Price ID (subscription, monthly) for /api/labo/checkout. Not set
   *  yet — Javier creates a Stripe account + these 4 Products/Prices, then
   *  fills these in (or moves them to env vars if preferred). Checkout
   *  returns a clear 503 until a real price id replaces the placeholder. */
  stripePriceId: string;
  leftHeading: string;
  leftItems: string[];
  rightHeading: string;
  rightItems: { key: string; value: string }[];
  noteHeading: string;
  noteBody: string;
  pricingBullets: string[];
  pricingNote: string;
}

export const PROGRAMS: Program[] = [
  {
    slug: "glp-1-weight-management",
    index: "01",
    name: "GLP-1 Weight Management",
    navBlurb: "Semaglutide and tirzepatide, dosed against your labs.",
    cardBlurb:
      "Semaglutide or tirzepatide, dosed against your labs and titrated by a clinician who is watching your side effects.",
    lede: "Medically supervised GLP-1 therapy for adults who want the medication handled properly: real labs first, a real dose plan, and someone to call when week four feels rough.",
    price: "$299",
    priceMeta: "$299 / mo",
    priceNote: "Medication, visits and messaging included. Labs billed separately.",
    stripePriceId: "PRICE_ID_NOT_SET",
    leftHeading: "Who this is for",
    leftItems: [
      "Adults with a BMI of 30 or above, or 27 with a related condition",
      "People who have lost weight before and regained it",
      "Anyone already on a GLP-1 who wants closer clinical oversight",
      "Patients who want nutrition and strength guidance alongside medication",
      "Not appropriate during pregnancy, or with a history of medullary thyroid carcinoma or MEN2",
    ],
    rightHeading: "What treatment looks like",
    rightItems: [
      { key: "Labs", value: "A1c, fasting insulin, lipids, CMP, CBC, TSH, and a baseline metabolic panel" },
      { key: "Medication", value: "Compounded or brand semaglutide and tirzepatide, depending on availability and your response" },
      { key: "Titration", value: "Dose increases only when tolerance and results support it, never on a fixed calendar" },
      { key: "Monitoring", value: "Check-in at weeks 2, 6 and 12, then every eight weeks" },
      { key: "Off-ramp", value: "A written maintenance and taper plan before you need it" },
    ],
    noteHeading: "A note on compounded GLP-1s",
    noteBody:
      "Compounded semaglutide and tirzepatide are prepared by state-licensed pharmacies and are not FDA-approved products. I will tell you plainly which form you are receiving, why, and what the tradeoffs are. If brand medication is available and appropriate for you, we will pursue it.",
    pricingBullets: [
      "Semaglutide or tirzepatide included",
      "Titration plan reviewed at every step",
      "Check-ins at weeks 2, 6 and 12",
      "Nutrition and strength guidance",
      "Written maintenance and taper plan",
    ],
    pricingNote: "Semaglutide or tirzepatide, visits and messaging included",
  },
  {
    slug: "peptide-therapy",
    index: "02",
    name: "Peptide Therapy",
    navBlurb: "Recovery, sleep, tissue repair and metabolic support.",
    cardBlurb:
      "Targeted protocols for recovery, sleep quality, tissue repair and metabolic support, built on a baseline panel.",
    lede: "Peptides are useful and they are overhyped in roughly equal measure. This program starts from your labs and your goals, uses only agents I can defend, and stops what is not working.",
    price: "$249",
    priceMeta: "$249 / mo",
    priceNote: "Includes clinician oversight and pharmacy coordination. Peptide cost varies.",
    stripePriceId: "PRICE_ID_NOT_SET",
    leftHeading: "What people come in for",
    leftItems: [
      "Slow recovery from training or injury",
      "Poor sleep quality despite good sleep habits",
      "Body composition that will not move with diet alone",
      "Joint and soft tissue pain after an old injury",
      "General longevity and performance goals with a data-driven approach",
    ],
    rightHeading: "How we work",
    rightItems: [
      { key: "Baseline", value: "IGF-1, full metabolic and hormone panel, inflammatory markers" },
      { key: "Selection", value: "Agents chosen for your goal and history, cycled rather than run indefinitely" },
      { key: "Pharmacy", value: "Sourced only through state-licensed US compounding pharmacies" },
      { key: "Review", value: "Repeat labs at 8 to 12 weeks to confirm effect, not just how you feel" },
      { key: "Stopping", value: "If a protocol is not producing measurable change, we discontinue it" },
    ],
    noteHeading: "What I will not do",
    noteBody:
      "I do not prescribe peptides that have been withdrawn from compounding, that lack any credible human safety data, or that are marketed on claims no one can substantiate. If you have read about something and want my honest read on it, ask me during your consult.",
    pricingBullets: [
      "Protocol built from your baseline panel",
      "Licensed US compounding pharmacies only",
      "Repeat labs at 8 to 12 weeks",
      "Cycled, not run indefinitely",
      "Peptide cost varies by agent",
    ],
    pricingNote: "Protocol design, oversight and pharmacy coordination",
  },
  {
    slug: "testosterone-for-men",
    index: "03",
    name: "Testosterone for Men",
    navBlurb: "Full work-up, treatment when indicated, real monitoring.",
    cardBlurb:
      "Full endocrine work-up, treatment when it is indicated, and the monitoring that responsible TRT actually requires.",
    lede: "Testosterone therapy done correctly is a long-term clinical relationship, not a subscription to a vial. That means confirming the diagnosis, protecting fertility if it matters to you, and watching hematocrit and estradiol on a schedule.",
    price: "$199",
    priceMeta: "$199 / mo",
    priceNote: "Medication, supplies, visits and messaging included. Labs billed separately.",
    stripePriceId: "PRICE_ID_NOT_SET",
    leftHeading: "Symptoms worth investigating",
    leftItems: [
      "Fatigue that sleep does not fix",
      "Loss of morning erections or reduced libido",
      "Strength and muscle mass declining despite training",
      "Low mood, irritability, or loss of drive",
      "Two morning total testosterone draws are required before any treatment decision",
    ],
    rightHeading: "The protocol",
    rightItems: [
      { key: "Work-up", value: "Total and free testosterone, LH, FSH, SHBG, estradiol, prolactin, PSA, CBC, CMP, lipids" },
      { key: "Treatment", value: "Injectable testosterone cypionate or enanthate, or topical where preferred" },
      { key: "Fertility", value: "HCG or alternative approaches discussed before starting if you may want children" },
      { key: "Monitoring", value: "Labs at 6 weeks, 12 weeks, then every 6 months. Hematocrit and PSA every draw" },
      { key: "Adjustment", value: "Dose and frequency changed based on trough levels and symptoms together" },
    ],
    noteHeading: "Controlled substance, handled carefully",
    noteBody:
      "Testosterone is a Schedule III controlled substance. Prescribing requires a documented diagnosis, a video visit, and a state prescription-monitoring check. I cannot prescribe it on a first-visit basis without labs, and I will decline treatment where it is not indicated.",
    pricingBullets: [
      "Medication and injection supplies included",
      "Full endocrine work-up interpreted",
      "Hematocrit and PSA monitored every draw",
      "Fertility preservation discussed upfront",
      "Labs at 6 weeks, 12 weeks, then biannually",
    ],
    pricingNote: "Medication, supplies, monitoring labs reviewed",
  },
  {
    slug: "hormone-therapy-for-women",
    index: "04",
    name: "Hormone Therapy for Women",
    navBlurb: "Perimenopause and menopause care, taken seriously.",
    cardBlurb:
      "Perimenopause and menopause care from someone who will take your symptoms seriously and treat them.",
    lede: "Most women describing hot flashes, broken sleep and brain fog have already been told to wait it out. Modern hormone therapy is safer and better understood than the headlines from twenty years ago, and it is a reasonable option for most patients.",
    price: "$199",
    priceMeta: "$199 / mo",
    priceNote: "Medication, visits and messaging included. Labs billed separately.",
    stripePriceId: "PRICE_ID_NOT_SET",
    leftHeading: "What we treat",
    leftItems: [
      "Hot flashes and night sweats",
      "Sleep disruption and early waking",
      "Mood changes, anxiety and cognitive fog",
      "Vaginal dryness and painful intercourse",
      "Loss of muscle mass, bone density concerns, and low libido",
    ],
    rightHeading: "Treatment approach",
    rightItems: [
      { key: "Assessment", value: "Full history, symptom scoring, FSH, estradiol, thyroid, lipids, CBC, CMP" },
      { key: "Estrogen", value: "Transdermal patch or gel preferred, oral where appropriate" },
      { key: "Progesterone", value: "Micronized oral progesterone for anyone with a uterus" },
      { key: "Testosterone", value: "Low-dose for libido and energy where indicated, discussed openly" },
      { key: "Review", value: "Six-week check-in, then labs and symptom review every six months" },
    ],
    noteHeading: "On risk, honestly",
    noteBody:
      "Hormone therapy has real contraindications and real benefits, and the balance depends on your age, your time since menopause, and your personal and family history. I will walk you through what applies to you specifically rather than quoting population statistics at you.",
    pricingBullets: [
      "Transdermal estradiol and oral progesterone",
      "Low-dose testosterone where indicated",
      "Symptom scoring at every review",
      "Six-week check-in, then biannual labs",
      "Vaginal estrogen included when needed",
    ],
    pricingNote: "Estrogen, progesterone and low-dose testosterone as indicated",
  },
];

export const getProgram = (slug: string) => PROGRAMS.find((p) => p.slug === slug);

export const HERO = {
  eyebrow: `LICENSED IN ${AVAILABILITY.toUpperCase()}`,
  h1: "Hormone and metabolic care, run like a real clinic.",
  lede: "Peptides, GLP-1 therapy and hormone optimization directed by a board-certified nurse practitioner. You get labs, a protocol built for your numbers, and a clinician who answers you personally.",
  // The "17 states" stat was removed — see the licensure note at the top of
  // this file. Replaced with a claim the rest of the site already supports.
  stats: [
    { figure: "100%", caption: "Telehealth. Labs drawn near you, visits from wherever you are." },
    { figure: "One", caption: "Clinician. The same nurse practitioner writes and adjusts every protocol." },
    { figure: "24 hrs", caption: "Typical turnaround from lab results to your protocol." },
  ],
};

export const TRUST_BAR = [
  "Board-certified nurse practitioner",
  "Physician-grade lab panels",
  "US-licensed compounding pharmacies",
  "No membership lock-in",
];

export const HOW_SHORT = [
  { n: "01", title: "Intake", body: "Ten minutes of history, goals and medications through the secure portal." },
  { n: "02", title: "Labs", body: "An order for a panel drawn at a lab near you, or we use a recent one." },
  { n: "03", title: "Video visit", body: "We go through your results together and agree on a plan." },
  { n: "04", title: "Treatment", body: "Medication ships to you. We adjust as your numbers move." },
];

export const HOW_LONG = [
  {
    n: "01", title: "Intake", meta: "ABOUT 10 MINUTES",
    body: "You create an account in the patient portal and complete a medical history: current medications, past treatment, family history, and what you are actually hoping to change.",
    detail: "This is also where you upload any labs you already have. If your panel is recent and complete, we may not need to repeat it.",
  },
  {
    n: "02", title: "Lab work", meta: "2 TO 5 DAYS",
    body: "I write an order for the panel your program requires and you have it drawn at a lab near you, on your schedule.",
    detail: "Labs can frequently be billed to your insurance. If you prefer, you can use your own lab or your primary care provider to complete the draw.",
  },
  {
    n: "03", title: "Video visit", meta: "30 TO 45 MINUTES",
    body: "We review every relevant marker on your panel, not just the flagged ones, and I explain what I think is driving your symptoms.",
    detail: "Then we agree on a protocol together. You will leave the visit knowing what you are taking, why, what to watch for, and when we look again.",
  },
  {
    n: "04", title: "Treatment and follow-up", meta: "ONGOING",
    body: "Medication ships to your door from a licensed pharmacy. Dose changes happen based on repeat labs and how you are actually doing.",
    detail: "Portal messaging is included, unlimited, and answered by me within one business day. Follow-up visits are included in your monthly fee.",
  },
];

export const INCLUDED = [
  "Video visits with your clinician",
  "Unlimited portal messaging",
  "Lab orders and interpretation",
  "Medication shipped from a licensed pharmacy",
  "All dose adjustments and refills",
  "Written protocol you can keep",
  "Notes shared with your PCP on request",
  "Cancel any month",
];

export const CLINICIAN = {
  quote:
    "I built this practice because I was tired of watching people get handed a prescription without anyone looking at their labs, their history, or their life.",
  body: `Care is available in ${AVAILABILITY}. Every protocol is written, reviewed and adjusted by a clinician licensed in your state as your numbers change.`,
};

export const EXTRA_PRICING = [
  { name: "Initial consultation", price: "$149", note: "One-time. Credited toward your first month if you begin a program." },
  { name: "Lab panels", price: "$99 – $249", note: "Depends on the panel. Many patients use insurance or an existing recent draw." },
  { name: "What is not charged", price: "$0", note: "Follow-up visits, dose adjustments, portal messages, refill requests and shipping." },
];

export const PRICING_FOOTNOTE =
  "Prices are for the program described and may change. Compounded medication availability and pricing vary by pharmacy. Nothing here is a quote or a guarantee of treatment.";

export const ABOUT = {
  lede: "Board-certified family nurse practitioner. Fifteen years in nursing, from the intensive care unit to transplant medicine to telehealth.",
  bio: [
    "I began my career in critical care at Cedars-Sinai Medical Center, first on a gastrointestinal medical-surgical telemetry unit and then in the neuroscience and medical-surgical intensive care units. Four years at the bedside in the ICU teaches you to read a patient's numbers carefully and to notice when something is off before it becomes urgent. That habit is the foundation of how I practice now.",
    "As a nurse practitioner I have worked in surgical care at Providence Saint Joseph, where I managed the Bariatric Wellness Center, and as a clinical transplant coordinator on the liver transplant team at Cedars-Sinai, carrying patients through referral, evaluation, waitlist and recovery. Later I practiced in dermatology and aesthetic medicine bicoastally with Kate Somerville Skin Health Experts, where I built and managed clinical protocols and trained incoming injectors, and I established clinical oversight for COVID-19 testing sites with CVS MinuteClinic.",
    "Telehealth has been part of every one of those roles, which is why I am comfortable building a practice around it. I completed my Doctorate in Nursing Practice, hold a Master of Science as a Family Nurse Practitioner, and I see patients in English and Spanish.",
  ],
  /** Licences HELD, from the provider's CV — a different claim from where the
   *  practice accepts patients. See the licensure note at the top of the file. */
  credentials: [
    { label: "Credential", value: "DNP, MSN, PHN, NP-C — Family Nurse Practitioner" },
    { label: "Licensure", value: "Washington, plus 10 additional states" },
    { label: "Doctorate", value: "Doctor of Nursing Practice" },
    { label: "Graduate", value: "MSN, Family Nurse Practitioner" },
    { label: "Board Certification", value: "American Academy of Nurse Practitioners" },
    { label: "Languages", value: "English, Spanish" },
  ],
  practice: [
    { title: "Labs before prescriptions", body: "Nothing is prescribed off a questionnaire. If I do not have numbers, I do not have a plan, and neither do you." },
    { title: "One clinician", body: "You see me. Not a rotating panel, not a chatbot. Your history stays in one head and one chart." },
    { title: "Stop what is not working", body: "If a protocol has not produced measurable change by the follow-up panel, we change it or we discontinue it." },
  ],
  /** Handoff open item #11: captions for slides 2 and 3 were inferred from the
   *  images and are unconfirmed. Kept, since they are descriptive not clinical. */
  slides: [
    { src: "/labo/img/about/founder.webp", pos: "50% 20%", caption: "Mónika Jáuregui, DNP, CANS, FNP-C." },
    { src: "/labo/img/about/founder-2.webp", pos: "50% 25%", caption: "In the clinic." },
    { src: "/labo/img/about/clinic.jpg", pos: "50% 50%", caption: "The treatment studio, where South Lake Union meets Eastlake." },
  ],
};

export const FAQ = [
  { q: "Which states do you serve?", a: `Care is available in ${AVAILABILITY}. Telehealth rules require you to be physically located in a state where your clinician holds a license at the time of your visit, so you are matched with a clinician licensed where you live. If you move or travel, tell us, because it affects who can see you that day.` },
  { q: "Is this covered by insurance?", a: "The program fee is self-pay. Lab work can often be billed to your insurance, and I will write orders that let you use your own lab or your plan. Superbills are available on request if you want to submit for out-of-network reimbursement." },
  { q: "Can I use labs I already have?", a: "Often, yes. If your panel is recent and complete enough, we will use it rather than repeating a draw. Send it through the portal before your first visit and I will tell you what, if anything, is missing." },
  { q: "How fast can I start?", a: "Most patients complete intake, get labs drawn within a few days, and have a protocol within 24 hours of results landing. Controlled substances such as testosterone require a video visit and a prescription-monitoring check first." },
  { q: "Who prescribes my medication?", a: "I do. Every prescription on this site is written by me after a video visit and a review of your labs. Nothing is generated automatically from a form." },
  { q: "Where does the medication come from?", a: "State-licensed US pharmacies, including licensed compounding pharmacies where a compounded preparation is appropriate. I will tell you which pharmacy is filling your prescription and whether the product is FDA-approved or compounded." },
  { q: "What if I need to reach you between visits?", a: "Message me in the portal. It is included in your fee, there is no per-message charge, and I answer within one business day. Anything urgent should go to your primary care provider or an emergency department." },
  { q: "Can I cancel?", a: "Any month, with no penalty and no lock-in. If you stop a hormone or GLP-1 program I will give you a written taper or maintenance plan so you are not left improvising." },
  { q: "Do you work with my primary care doctor?", a: "Gladly. With your consent I send visit notes and lab results to your PCP so your chart stays in one piece. Coordinated care produces better outcomes and fewer duplicate draws." },
];

export const CONTACT = {
  lede: "Existing patients: message me through the portal, it's faster and it's part of your chart. Everyone else, use whichever below is easiest.",
  note: "Do not send urgent medical information by email. If this is an emergency, call 911 or go to your nearest emergency department.",
};

export const LEGAL = [
  { title: "No medical advice", body: "The content on this website is for general information only. It is not medical advice, it is not a substitute for consultation with a licensed clinician, and reading it does not create a patient relationship. A patient relationship begins only after intake, a completed clinical evaluation, and a documented visit." },
  { title: "Scope of licensure", body: `Clinical services are provided by clinicians licensed in the state where the patient is located, and care is offered in ${AVAILABILITY}. Patients must be physically located in a state where their treating clinician is licensed at the time of each visit.` },
  { title: "Telehealth consent", body: "All care is delivered by telehealth. Telehealth has limitations, including the inability to perform a physical examination. In some cases an in-person evaluation, imaging, or referral will be required, and treatment may be declined if remote care is not clinically appropriate." },
  { title: "Compounded medications", body: "Some medications prescribed through this practice are compounded by state-licensed pharmacies. Compounded preparations are not reviewed or approved by the FDA for safety, effectiveness, or manufacturing quality. Your clinician will identify whether a product is FDA-approved or compounded before you begin." },
  { title: "Peptide therapies", body: "Certain peptides are prescribed for uses that are not FDA-approved. Evidence quality varies by agent, and outcomes are not guaranteed. Risks, benefits and the state of the evidence will be discussed with you before any peptide is prescribed." },
  { title: "Controlled substances", body: "Testosterone is a Schedule III controlled substance. Prescribing requires a documented diagnosis, a synchronous video visit, and a check of the applicable state prescription drug monitoring program. Requests that do not meet these requirements will be declined." },
  { title: "No guarantee of results", body: "Individual results vary. No statement on this website should be read as a promise of a specific outcome, including weight loss, symptom relief, or laboratory improvement." },
  { title: "Privacy", body: "Protected health information is handled in accordance with HIPAA and is stored in a HIPAA-compliant electronic health record. Email and web forms are not secure channels; do not send clinical information through them. A full privacy policy prepared by counsel will be published here before launch." },
  { title: "Emergencies", body: "This practice does not provide emergency care. If you are experiencing a medical emergency, call 911 or go to the nearest emergency department. For mental health crises, call or text 988." },
];

/**
 * Nov 19 2026 — THE LABO METHOD, split out as its own brand (Javier: "The Labo
 * Clinic, which we are building now... in-store... The Labo Method... white
 * label solution for Telehealth via Healthie"). It is its own subdomain of
 * the same registered domain — method.thelabomethod.com, src/proxy.ts rewrites
 * it to src/app/labo/method/* — reusing PROGRAMS/HEALTHIE/FAQ/LEGAL above
 * rather than a new domain or the separate mycleanmd.com app (explicitly
 * ruled out: "i dont want to use MyCleanMD").
 */
export const METHOD = {
  name: "The Labo Method",
  domain: "thelabomethod.com",   // Nov 22 2026: was method.thelabomethod.com (the proxy redirects the old subdomain)
  // Keep in sync with the [data-method] --accent override in labo.css — this
  // copy is for cross-links rendered on the CLINIC's own pages (its own
  // [data-clinic] scope has no [data-method], so var(--accent) there is
  // still clay; a Method-coloured mention there has to be hardcoded).
  accent: "#6E3F99",
  tagline: "Hormone, weight and peptide care, by video.",
  email: PRACTICE.email,
} as const;

/** The plain "Telehealth" menu entry (Nov 21 2026) — appended after NAV in the desktop nav and the phone sheet; the
 *  header's eye-catcher is TeleCallout.tsx. Kept out of NAV so the footer's Explore column doesn't double it. */
export const TELE_LINK = { label: "Telehealth", href: `https://${METHOD.domain}` } as const;

/**
 * ⚠️ IS THE LABO METHOD TAKING PATIENTS? (Nov 27 2026, Javier: "can we put something to show this is coming soon, people already
 * clicking on site".) While this is false the site says "Opening soon": the top notice line and the hero tag say so, the header
 * button reads "Join the list", and /start — where every Get started / Start button leads — shows a coming-soon page with an
 * email list instead of the sign-up. The sign-up itself still runs on the clinical platform's SANDBOX, so nobody should reach it
 * by accident; testers open it with /start?preview=1. Flip to true the day the live key is in and sign-up is real.
 */
export const METHOD_OPEN = false;

/**
 * The Method's JOURNAL is open to search engines (Nov 27 2026, Javier: "ok journal is good") while the rest of the Method —
 * programs, pricing, sign-up — stays hidden until LAUNCH_READY. The articles are educational and quote no prices, and search
 * takes weeks to build. This one flag drives the articles' robots meta, the Method's robots.txt and its sitemap. English and
 * Spanish articles alike. Set it to false to pull the Journal back out of search.
 */
export const JOURNAL_INDEX = true;
/** Spread into a Journal page's metadata. Needed because the Method layout says noindex for the whole host until launch. */
export const JOURNAL_ROBOTS = LAUNCH_READY || JOURNAL_INDEX ? { robots: { index: true, follow: true } } : {};

export const METHOD_NAV = [
  { label: "Programs", href: "/programs" },
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Journal", href: "/blog" },
  { label: "FAQ", href: "/faq" },
] as const;

export const FOOTER_BLURB = `Telehealth hormone, peptide and metabolic care for residents of ${AVAILABILITY}.`;
export const FOOTER_DISCLAIMER = `Clinical services are provided by clinicians licensed in the patient's state; care is available in ${AVAILABILITY}. This website does not provide medical advice.`;

/* ───────────────────────────────────────────────────────────────────────────
 * THE CLINIC — in-person laser care in Seattle (Oct 26 2026, Javier: "Now that
 * you know what we will be offering with laser, let's create a better, more
 * premium site" · "one brand, clinic first" · "Seattle-based clinic, address to
 * come"). The homepage now leads with the clinic; the telehealth programs above
 * stay as the second line of the practice.
 *
 * ⚠️ BLOCKING ITEM #5 for LAUNCH_READY — clinic prices. The "from" prices below
 * are the floor of Seattle comps researched Oct 26 2026 (hair removal ~$100–250
 * small area, photofacial ~$400, veins $250–600, nail laser ~$200/session), NOT
 * rates Monika has set. Confirm with her, then keep or change them here only.
 * The street address is deliberately absent until Javier/Monika publish it.
 * ─────────────────────────────────────────────────────────────────────────── */
export const CLINIC = {
  city: "Seattle, Washington",
  address: null as string | null,        // to come — the site says "address announced soon" until this is set
  status: "Opening soon",
  device: "Candela GentleMax Pro Plus",
  hoursNote: "By appointment",
} as const;

export interface Treatment {
  slug: string;
  group: "laser" | "injectables" | "skin";
  techLabel?: string;     // 'Wavelength' for the laser lines; 'Product' / 'Technique' otherwise
  name: string;
  short: string;          // the one-line promise on the homepage row
  treats: string[];
  wavelength: string;
  sessions: string;
  from: string;           // ⚠️ placeholder until Monika confirms (blocking item #5)
  unit: string;
  body: string[];
  skin: string;
}

export const TREATMENTS: Treatment[] = [
  {
    slug: "laser-hair-removal", group: "laser",
    name: "Laser hair removal",
    short: "Smooth, permanently reduced hair on any skin tone.",
    treats: ["Face", "Underarms", "Bikini and Brazilian", "Legs", "Back and chest"],
    wavelength: "755 nm Alexandrite · 1064 nm Nd:YAG",
    sessions: "6 to 8 sessions, 4 to 8 weeks apart",
    from: "$100", unit: " / session · small area",
    body: [
      "Hair grows in cycles, and a laser only reaches follicles that are actively growing. That is why a course takes six to eight visits, and why anyone promising one-session results is selling something else.",
      "We choose the wavelength by your skin, not by the menu: the 755 nm Alexandrite for lighter skin and fine hair, the 1064 nm Nd:YAG for deeper skin tones, where it is the safer choice.",
    ],
    skin: "All skin types, I to VI",
  },
  {
    slug: "sun-spots", group: "laser",
    name: "Sun spots & pigment",
    short: "Fades brown spots, freckling and uneven tone.",
    treats: ["Sun spots", "Age spots", "Freckling", "Uneven tone"],
    wavelength: "755 nm Alexandrite",
    sessions: "1 to 3 sessions",
    from: "$350", unit: " / session",
    body: [
      "Benign pigment absorbs the 755 nm beam, darkens for a week or two, and flakes away as the skin renews.",
      "Not every brown spot is benign. Anything that looks unusual is examined first and, where it should be, referred before it is ever treated.",
    ],
    skin: "Best on lighter skin types",
  },
  {
    slug: "spider-veins", group: "laser",
    name: "Spider veins & redness",
    short: "Clears small facial and leg veins and red marks.",
    treats: ["Spider veins", "Facial redness", "Cherry angiomas", "Leg veins"],
    wavelength: "1064 nm Nd:YAG",
    sessions: "1 to 3 sessions",
    from: "$250", unit: " / session",
    body: [
      "The 1064 nm wavelength reaches the vessel, seals it, and the body clears it over the following weeks.",
      "Larger or deeper leg veins are a vascular-medicine question, not a cosmetic one. We will tell you when that is the case.",
    ],
    skin: "All skin types",
  },
  {
    slug: "skin-rejuvenation", group: "laser",
    name: "Laser skin rejuvenation",
    short: "Brighter, firmer, more even skin without downtime.",
    treats: ["Fine lines", "Texture", "Diffuse redness", "Dullness"],
    wavelength: "1064 nm Nd:YAG · 755 nm Alexandrite",
    sessions: "A series of 3 to 4, then maintenance",
    from: "$350", unit: " / session",
    body: [
      "Gentle, non-ablative passes warm the deeper skin to stimulate collagen while the surface stays intact. Most people return to their day the same afternoon.",
      "Results build over the series rather than overnight, which is why we plan the whole course at the first visit.",
    ],
    skin: "All skin types",
  },
  {
    slug: "nail-fungus", group: "laser",
    name: "Laser nail treatment",
    short: "A drug-free treatment for stubborn nail fungus.",
    treats: ["Toenail fungus", "Fingernail fungus"],
    wavelength: "1064 nm Nd:YAG",
    sessions: "3 sessions, about 3 months apart",
    from: "$200", unit: " / session",
    body: [
      "The 1064 nm laser heats the nail bed enough to stop the fungus without the liver monitoring some oral medicines need.",
      "A clear nail has to grow out, so judge the result at six to twelve months, not at the end of the visit.",
    ],
    skin: "All skin types",
  },
  // Oct 26 2026 (Javier: "can we add these services: Botox, dermal fillers, Sculptra, microneedling"). Seattle comps the same day:
  // Botox $13–16/unit (Well Medical Arts $15, Seattle Face $16), filler $650–850/syringe, Sculptra $850–990/vial, microneedling
  // $350–425/session. The "from" prices are placeholders until Monika sets hers (blocking item #5).
  {
    slug: "botox", group: "injectables", techLabel: "Product",
    name: "Botox & neurotoxins",
    short: "Softens frown lines, forehead lines and crow's feet.",
    treats: ["Frown lines", "Forehead lines", "Crow's feet", "Lip flip", "Jawline / masseter"],
    wavelength: "Botox® or Dysport®, dosed by the unit",
    sessions: "Results in 7 to 14 days, lasting about 3 to 4 months",
    from: "$16", unit: " / unit",
    body: [
      "A neurotoxin relaxes the small muscles that fold the skin into lines. Dosed well, you still look like you on a good day: rested, not frozen.",
      "We price by the unit, map the dose at your consultation, and see you at two weeks to check the result and adjust if needed.",
    ],
    skin: "All skin types",
  },
  {
    slug: "dermal-fillers", group: "injectables", techLabel: "Product",
    name: "Dermal fillers",
    short: "Restores lost volume in lips, cheeks, chin and under the eyes.",
    treats: ["Lips", "Cheeks", "Chin and jawline", "Smile lines", "Under-eye hollows"],
    wavelength: "Hyaluronic-acid fillers (Juvéderm®, Restylane® families)",
    sessions: "One visit, lasting about 6 to 18 months by area",
    from: "$650", unit: " / syringe",
    body: [
      "Hyaluronic-acid filler replaces volume where it has thinned with time, and it can be dissolved if ever needed, which is why it is our only filler for the face.",
      "The plan starts with your proportions, not a syringe count. Most people need less than they expect.",
    ],
    skin: "All skin types",
  },
  {
    slug: "sculptra", group: "injectables", techLabel: "Product",
    name: "Sculptra",
    short: "Rebuilds your own collagen for gradual, natural lift.",
    treats: ["Temples", "Cheeks", "Jawline", "Overall facial volume"],
    wavelength: "Sculptra® (poly-L-lactic acid), a collagen stimulator",
    sessions: "2 to 3 sessions, 4 to 6 weeks apart; results last 2 years or more",
    from: "$850", unit: " / vial",
    body: [
      "Sculptra is not a filler in the usual sense: it prompts your skin to make new collagen over the following months, so the change is slow, structural and your own.",
      "Because it builds gradually, it suits people who want to look refreshed rather than visibly treated.",
    ],
    skin: "All skin types",
  },
  {
    slug: "microneedling", group: "skin", techLabel: "Technique",
    name: "Microneedling",
    short: "Smoother texture, softer acne scars, tighter pores.",
    treats: ["Acne scars", "Texture", "Pores", "Fine lines", "Stretch marks"],
    wavelength: "Medical-grade microneedling, depth set by area",
    sessions: "3 to 4 sessions, about 4 weeks apart",
    from: "$350", unit: " / session",
    body: [
      "Controlled micro-channels trigger the skin's own repair, building collagen and smoothing texture over a series.",
      "Expect pink skin for a day or two. It pairs well with the laser work and is safe across skin tones.",
    ],
    skin: "All skin types",
  },
];

export const GROUPS = { laser: "Laser", injectables: "Injectables", skin: "Skin" } as const;
export const GROUP_NOTE = {
  laser: "Candela GentleMax Pro Plus · 755 + 1064 nm",
  injectables: "Neurotoxins, fillers and collagen stimulators",
  skin: "Texture, scars and pores",
} as const;

/** Browse by concern (Oct 26 2026, after SkinSpirit's "shop by benefit" row): each links to the treatment that answers it. */
export const CONCERNS = [
  { label: "Lines & wrinkles", slug: "botox" },
  { label: "Lost volume", slug: "dermal-fillers" },
  { label: "Gradual lift", slug: "sculptra" },
  { label: "Unwanted hair", slug: "laser-hair-removal" },
  { label: "Sun spots", slug: "sun-spots" },
  { label: "Visible veins", slug: "spider-veins" },
  { label: "Acne scars & texture", slug: "microneedling" },
  { label: "Redness & tone", slug: "skin-rejuvenation" },
] as const;

export const FIRST_VISIT = [
  { n: "01", h: "Consultation", meta: "ABOUT 30 MINUTES", p: "Your skin, your history and what you want to change, examined by a nurse practitioner before anything is treated." },
  { n: "02", h: "Test spot", meta: "SAME VISIT", p: "A small patch at the settings we plan to use, so we see how your skin responds before the full area." },
  { n: "03", h: "Your course", meta: "A PLAN, WRITTEN DOWN", p: "Number of sessions, spacing, price for the whole course and what to avoid before and after, agreed up front." },
  { n: "04", h: "Follow-up", meta: "EVERY VISIT", p: "Settings adjust as your skin responds. If something is not working, we change it or stop." },
];

export const LASER_SPECS = [
  { k: "Platform", v: "Candela GentleMax Pro Plus" },
  { k: "Wavelengths", v: "755 nm Alexandrite and 1064 nm Nd:YAG in one system" },
  { k: "Cooling", v: "Cryogen spray cooling before every pulse, for comfort and protection" },
  { k: "Skin types", v: "Fitzpatrick I to VI, with the wavelength chosen for your skin" },
  { k: "Oversight", v: "Every new patient is examined by a nurse practitioner before the first treatment" },
];

export const LASER_FAQ = [
  { q: "Does laser hair removal hurt?", a: "Most people describe a quick snap, like a rubber band, softened by the cryogen spray that cools the skin before each pulse. Small areas take minutes." },
  { q: "Is it safe for darker skin?", a: "Yes, with the right wavelength. The 1064 nm Nd:YAG is the standard of care for deeper skin tones, and we always start with a test spot." },
  { q: "How many sessions will I need?", a: "Hair removal usually takes six to eight. Pigment and veins often clear in one to three. You get a written plan with the number of sessions and the total price at your consultation." },
  { q: "What should I avoid before treatment?", a: "Sun exposure and self-tanner for two weeks, and waxing or plucking the area for four. Shaving the day before is fine and recommended." },
  { q: "Is there downtime?", a: "Usually none beyond some redness for a few hours. Pigment darkens for one to two weeks before it flakes away." },
  { q: "Who does the injections?", a: "Injectables are performed by the nurse practitioner herself, after a consultation and a written plan. Nothing is injected at a first visit unless you want it and it is appropriate." },
  { q: "How long do Botox and fillers last?", a: "Botox and other neurotoxins about three to four months. Hyaluronic-acid fillers about six to eighteen months depending on the area. Sculptra builds over months and lasts two years or more." },
  { q: "Who performs the treatments?", a: "A licensed clinician, working under protocols written for this clinic, after a nurse practitioner has examined you." },
];
