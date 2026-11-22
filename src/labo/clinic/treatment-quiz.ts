/**
 * In-clinic treatment finder (Nov 21 2026, from Javier's "Medical Spa Treatment Quiz Blueprint" PDF):
 * goal → sub-concern → downtime → safety flags → experience, mapped to a treatment the clinic actually
 * offers. The blueprint's matrix named devices this clinic does not have (Hydrafacial, Morpheus8, BBL/IPL,
 * Pico, CO2, Halo, Moxi, Sofwave…); every cell here is re-mapped to the real menu. The safety overrides are
 * kept as written: pregnancy strips injectables/lasers/peels/needling, recent sun adds the laser wait notice,
 * the melasma branch never gets laser, sensitive/rosacea/cold-sore history gets the antiviral-first note.
 * Shared by the client component (TreatmentQuiz.tsx) and the admin page (/clinic/quiz) — no "use client".
 */
export type Goal = "aging" | "pigment" | "texture" | "glow";
export type Sub = "lines" | "volume" | "laxity" | "sunspots" | "redness" | "melasma" | "acne" | "scars" | "pores" | "express" | "exfoliate" | "routine";
export type Downtime = "zero" | "short" | "deep";
export type Safety = "pregnant" | "sun" | "sensitive";
export type Experience = "first" | "experienced" | "results";
export type TxKey = keyof typeof TX;

export const GOALS: { key: Goal; label: string }[] = [
  { key: "aging", label: "Fine lines, wrinkles or volume loss" },
  { key: "pigment", label: "Sun spots, redness or dark patches" },
  { key: "texture", label: "Acne, scars, pores or rough texture" },
  { key: "glow", label: "Dullness, dehydration or general glow" },
];
export const SUBS: Record<Goal, { key: Sub; label: string }[]> = {
  aging: [
    { key: "lines", label: "Expression lines — forehead, eyes, frown" },
    { key: "volume", label: "Hollow cheeks, thin lips or deep smile lines" },
    { key: "laxity", label: "Loose skin along the jawline, neck or under-eyes" },
  ],
  pigment: [
    { key: "sunspots", label: "Brown sun spots, freckles or age spots" },
    { key: "redness", label: "Flushing, redness or broken capillaries" },
    { key: "melasma", label: "Blotchy patches that darken in heat or sun" },
  ],
  texture: [
    { key: "acne", label: "Active breakouts, clogged pores, blackheads" },
    { key: "scars", label: "Indented acne scars or deep unevenness" },
    { key: "pores", label: "Enlarged pores, crepey skin or mild roughness" },
  ],
  glow: [
    { key: "express", label: "A quick glow before an event" },
    { key: "exfoliate", label: "Deep exfoliation of dull surface buildup" },
    { key: "routine", label: "A medical-grade at-home routine" },
  ],
};
export const DOWNTIMES: { key: Downtime; label: string }[] = [
  { key: "zero", label: "None — back to work or an event today" },
  { key: "short", label: "1–3 days — some pinkness or flaking over a weekend" },
  { key: "deep", label: "4–7+ days — open to real recovery for a bigger change" },
];
export const SAFETIES: { key: Safety; label: string }[] = [
  { key: "pregnant", label: "Pregnant or breastfeeding" },
  { key: "sun", label: "Sun exposure or self-tanner in the last 14 days" },
  { key: "sensitive", label: "Sensitive skin, rosacea or cold-sore history" },
];
export const EXPERIENCES: { key: Experience; label: string }[] = [
  { key: "first", label: "This would be my first treatment" },
  { key: "experienced", label: "I've had treatments before" },
  { key: "results", label: "I'm ready for a full plan" },
];

type Flag = "injectable" | "laser" | "peel" | "needle";
export const TX = {
  botox: { name: "Botox® / Dysport®", href: "/services/wrinkle-relaxers", from: "from $16 / unit", flags: ["injectable"] as Flag[] },
  filler: { name: "Dermal fillers", href: "/services/dermal-fillers", from: "from $650 / syringe", flags: ["injectable"] as Flag[] },
  sculptra: { name: "Sculptra", href: "/services/sculptra", from: "from $850 / vial", flags: ["injectable"] as Flag[] },
  threads: { name: "PDO threads", href: "/services/pdo-threads", from: "priced at consultation", flags: ["injectable"] as Flag[] },
  microneedling: { name: "Microneedling with SkinPen®", href: "/services/microneedling", from: "from $350 / session", flags: ["needle"] as Flag[] },
  prp: { name: "PRP / exosomes add-on", href: "/services/prp-exosomes", from: "priced at consultation", flags: ["needle"] as Flag[] },
  vipeel: { name: "VI Peel", href: "/services/chemical-peels", from: "priced at consultation", flags: ["peel"] as Flag[] },
  cosmelan: { name: "Cosmelan depigmentation", href: "/services/chemical-peels", from: "priced at consultation", flags: ["peel"] as Flag[] },
  laserRejuv: { name: "Laser skin rejuvenation", href: "/treatments#skin-rejuvenation", from: "from $350 / session", flags: ["laser"] as Flag[] },
  laserSpots: { name: "Laser for sun spots & pigment", href: "/treatments#sun-spots", from: "from $350 / session", flags: ["laser"] as Flag[] },
  laserVeins: { name: "Laser for spider veins & redness", href: "/treatments#spider-veins", from: "from $250 / session", flags: ["laser"] as Flag[] },
  rx: { name: "Cosmetic Rx & medical-grade skincare", href: "/services/cosmetic-rx", from: "priced at consultation", flags: [] as Flag[] },
  iv: { name: "IV therapy & wellness", href: "/services/wellness", from: "priced at consultation", flags: [] as Flag[] },
  skincare: { name: "A medical-grade home routine", href: "/shop", from: "from the shop", flags: [] as Flag[] },
} as const;

/** The blueprint's mapping matrix, re-mapped to this clinic's menu: sub-concern × downtime → treatments. */
const MATRIX: Record<Sub, Record<Downtime, TxKey[]>> = {
  lines: { zero: ["botox"], short: ["botox", "vipeel"], deep: ["botox", "laserRejuv"] },
  volume: { zero: ["filler"], short: ["sculptra"], deep: ["sculptra", "filler"] },
  laxity: { zero: ["sculptra"], short: ["threads"], deep: ["microneedling", "prp"] },
  sunspots: { zero: ["rx"], short: ["vipeel"], deep: ["laserSpots"] },
  redness: { zero: ["rx"], short: ["laserVeins"], deep: ["laserRejuv"] },
  melasma: { zero: ["rx"], short: ["vipeel"], deep: ["cosmelan"] },   // never laser — heat drives PIH in melasma patterns
  acne: { zero: ["rx"], short: ["vipeel"], deep: ["vipeel", "microneedling"] },
  scars: { zero: ["rx"], short: ["microneedling"], deep: ["microneedling", "prp"] },
  pores: { zero: ["rx"], short: ["microneedling"], deep: ["laserRejuv"] },
  express: { zero: ["iv", "rx"], short: ["vipeel"], deep: ["laserRejuv"] },
  exfoliate: { zero: ["rx"], short: ["vipeel"], deep: ["vipeel", "microneedling"] },
  routine: { zero: ["skincare"], short: ["skincare"], deep: ["skincare"] },
};

export type TreatmentAnswers = { goal: Goal; sub: Sub; downtime: Downtime; safety: Safety[]; experience: Experience };
export type TreatmentResult = { picks: TxKey[]; banners: string[]; plan: string; routineHandoff: boolean };

export function recommendTreatment(a: TreatmentAnswers): TreatmentResult {
  let picks: TxKey[] = [...MATRIX[a.sub][a.downtime]];
  const banners: string[] = [];
  if (a.safety.includes("pregnant")) {
    picks = picks.filter((k) => TX[k].flags.length === 0);
    if (!picks.includes("skincare")) picks.push("skincare");
    banners.push("While you're pregnant or nursing we keep it to pregnancy-safe skincare — no injectables, lasers or strong peels. Book a consultation and we'll plan the rest for afterwards.");
  }
  if (a.sub === "melasma") banners.push("We don't use high-heat lasers on melasma patterns — heat can darken them. Peels and pigment inhibitors do the work here.");
  if (a.safety.includes("sun") && picks.some((k) => TX[k].flags.includes("laser"))) banners.push("Laser needs 2–4 weeks without sun exposure or self-tanner first. We'll time it at your consultation.");
  if (a.safety.includes("sensitive")) banners.push("Mention rosacea or a cold-sore history at your visit — peels and microneedling are planned around it, with antivirals first if needed.");
  const plan = a.experience === "first" ? "Start with one treatment and a test spot. You leave your consultation with a written plan — no obligation to begin." : a.experience === "experienced" ? "A course, with the number of sessions and the total price agreed in writing at your consultation." : "A combined plan across treatments, sequenced so each one supports the next.";
  return { picks, banners, plan, routineHandoff: a.sub === "routine" || picks.includes("skincare") };
}

export const GOAL_LABEL = Object.fromEntries(GOALS.map((g) => [g.key, g.label])) as Record<Goal, string>;
export const SUB_LABEL = Object.fromEntries(Object.values(SUBS).flat().map((s) => [s.key, s.label])) as Record<Sub, string>;
export const DOWNTIME_LABEL = Object.fromEntries(DOWNTIMES.map((d) => [d.key, d.label])) as Record<Downtime, string>;
export const SAFETY_LABEL = Object.fromEntries(SAFETIES.map((s) => [s.key, s.label])) as Record<Safety, string>;
export const EXPERIENCE_LABEL = Object.fromEntries(EXPERIENCES.map((e) => [e.key, e.label])) as Record<Experience, string>;
