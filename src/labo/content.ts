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

export const AVAILABILITY = "California and Washington";

export const PRACTICE = {
  name: "The Labo Method",
  subline: "Hormone & Longevity Medicine",
  footerSubline: "Longevity & Hormone Medicine",
  domain: "thelabomethod.com",
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
export const HEALTHIE = {
  login: "https://app.gethealthie.com",
  intake: "https://app.gethealthie.com",
  book: "https://app.gethealthie.com",
  program: (_slug: string) => "https://app.gethealthie.com",
} as const;

export const NAV = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
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
  body: `I am a board-certified nurse practitioner licensed in ${AVAILABILITY}. Every protocol here is written by me, reviewed by me, and adjusted by me as your numbers change.`,
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
    "Telehealth has been part of every one of those roles, which is why I am comfortable building a practice around it. I completed my Doctorate in Nursing Practice in 2025, hold a Master of Science as a Family Nurse Practitioner from Cal State Long Beach, and I see patients in English and Spanish.",
  ],
  /** Licences HELD, from the provider's CV — a different claim from where the
   *  practice accepts patients. See the licensure note at the top of the file. */
  credentials: [
    { label: "Credential", value: "DNP, MSN, PHN, NP-C — Family Nurse Practitioner" },
    { label: "Licensure", value: "California, Washington, New York, Nevada. Oregon pending." },
    { label: "Doctorate", value: "Doctor of Nursing Practice, Aspen University, 2025" },
    { label: "Graduate", value: "MSN, Family Nurse Practitioner, Cal State Long Beach, 2014" },
    { label: "Certification", value: "American Academy of Nurse Practitioners, cert. F0415015" },
    { label: "Languages", value: "English, Spanish" },
  ],
  history: [
    { dates: "2020 –", role: "Nurse Practitioner", org: "CVS Health MinuteClinic", desc: "Clinical oversight for COVID-19 testing across retail, mobile and telemedicine settings." },
    { dates: "2020", role: "Nurse Practitioner", org: "Kate Somerville Skin Health Experts", desc: "Bicoastal dermatology and aesthetic practice. Protocol development, injector training, NYC clinic opening." },
    { dates: "2019", role: "Nurse Practitioner", org: "Westcoast Wound and Skincare", desc: "Direct patient care alongside hospice and home health agencies." },
    { dates: "2016 – 2018", role: "Clinical Transplant Coordinator", org: "Cedars-Sinai Medical Center", desc: "Liver transplant team. Referral through post-transplant care, inpatient and outpatient." },
    { dates: "2015 – 2016", role: "Surgical Nurse Practitioner", org: "Providence Saint Joseph Medical Center", desc: "Pre- and post-operative care. Managed the Bariatric Wellness Center." },
    { dates: "2011 – 2015", role: "Clinical Nurse II", org: "Cedars-Sinai Medical Center", desc: "Neuroscience and medical-surgical ICU. Brawerman Nursing Institute residency alumna." },
  ],
  practice: [
    { title: "Labs before prescriptions", body: "Nothing is prescribed off a questionnaire. If I do not have numbers, I do not have a plan, and neither do you." },
    { title: "One clinician", body: "You see me. Not a rotating panel, not a chatbot. Your history stays in one head and one chart." },
    { title: "Stop what is not working", body: "If a protocol has not produced measurable change by the follow-up panel, we change it or we discontinue it." },
  ],
  /** Handoff open item #11: captions for slides 2 and 3 were inferred from the
   *  images and are unconfirmed. Kept, since they are descriptive not clinical. */
  slides: [
    { src: "/labo/slide-1.jpg", pos: "50% 20%", caption: "Monika Jauregui, DNP, NP-C." },
    { src: "/labo/slide-2.jpg", pos: "50% 32%", caption: "San Juan Islands, Washington." },
    { src: "/labo/slide-3.jpg", pos: "50% 45%", caption: "Cold water swim off Alki Beach, Seattle." },
  ],
};

export const FAQ = [
  { q: `Do I need to live in ${AVAILABILITY}?`, a: `Yes. I am licensed in ${AVAILABILITY}, and telehealth rules require you to be physically located in a state where your clinician holds a license at the time of your visit. If you move or travel, tell me, because it affects whether I can see you that day.` },
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
  { title: "Scope of licensure", body: `Clinical services are provided by a nurse practitioner licensed in the State of California and the State of Washington. Patients must be physically located in one of these states at the time of each visit. We cannot treat residents of other states.` },
  { title: "Telehealth consent", body: "All care is delivered by telehealth. Telehealth has limitations, including the inability to perform a physical examination. In some cases an in-person evaluation, imaging, or referral will be required, and treatment may be declined if remote care is not clinically appropriate." },
  { title: "Compounded medications", body: "Some medications prescribed through this practice are compounded by state-licensed pharmacies. Compounded preparations are not reviewed or approved by the FDA for safety, effectiveness, or manufacturing quality. Your clinician will identify whether a product is FDA-approved or compounded before you begin." },
  { title: "Peptide therapies", body: "Certain peptides are prescribed for uses that are not FDA-approved. Evidence quality varies by agent, and outcomes are not guaranteed. Risks, benefits and the state of the evidence will be discussed with you before any peptide is prescribed." },
  { title: "Controlled substances", body: "Testosterone is a Schedule III controlled substance. Prescribing requires a documented diagnosis, a synchronous video visit, and a check of the applicable state prescription drug monitoring program. Requests that do not meet these requirements will be declined." },
  { title: "No guarantee of results", body: "Individual results vary. No statement on this website should be read as a promise of a specific outcome, including weight loss, symptom relief, or laboratory improvement." },
  { title: "Privacy", body: "Protected health information is handled in accordance with HIPAA and is stored in a HIPAA-compliant electronic health record. Email and web forms are not secure channels; do not send clinical information through them. A full privacy policy prepared by counsel will be published here before launch." },
  { title: "Emergencies", body: "This practice does not provide emergency care. If you are experiencing a medical emergency, call 911 or go to the nearest emergency department. For mental health crises, call or text 988." },
];

export const FOOTER_BLURB = `Telehealth hormone, peptide and metabolic care for residents of ${AVAILABILITY}.`;
export const FOOTER_DISCLAIMER = `Clinical services provided by a nurse practitioner licensed in ${AVAILABILITY}. This website does not provide medical advice.`;
