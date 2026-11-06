import type { IntakeStep } from "@/components/IntakeFlow";

/**
 * Per-program intake steps for the Labo Method portal. Deliberately simpler
 * than MyCleanMD's bespoke weight-care intake (src/app/patient/care/weight/
 * intake/page.tsx, BMI calc + 6/12-month projection chart) — that screen is
 * the right template to port over for GLP-1 specifically in a follow-up pass,
 * but reusing the generic IntakeFlow engine for all 4 programs keeps this
 * first version shippable. Revisit glp1Steps first if a richer intake is wanted.
 */

const CONTACT_STEPS: IntakeStep[] = [
  { kind: "yesno", q: "Are you currently pregnant or breastfeeding?" },
  { kind: "yesno", q: "Do you have any known drug allergies?" },
  {
    kind: "multi", q: "Current medications or supplements",
    sub: "Select all that apply, or None.",
    items: ["Blood pressure medication", "Blood thinners", "Thyroid medication", "Antidepressants", "None"],
  },
];

const glp1Steps: IntakeStep[] = [
  {
    kind: "single", q: "Have you taken a GLP-1 medication before?",
    options: [
      { label: "No, this is my first time" },
      { label: "Yes, and I'm still taking one" },
      { label: "Yes, but I stopped" },
    ],
  },
  {
    kind: "single", q: "What's your primary goal?",
    options: [
      { label: "Lose weight" },
      { label: "Keep weight off after losing it" },
      { label: "Manage a weight-related health condition" },
    ],
  },
  { kind: "yesno", q: "Do you have a personal or family history of medullary thyroid carcinoma or MEN2?" },
  ...CONTACT_STEPS,
  {
    kind: "reveal", emoji: "🩺", title: "Thanks — that's everything for now.",
    body: "Monika will review this with your labs before your video visit.",
    summaryFn: (a) => [
      { label: "GLP-1 history", value: String(a.s0 ?? "—") },
      { label: "Goal", value: String(a.s1 ?? "—") },
    ],
  },
];

const peptideSteps: IntakeStep[] = [
  {
    kind: "multi", q: "What are you hoping peptide therapy helps with?",
    sub: "Select all that apply.",
    items: ["Recovery from training/injury", "Sleep quality", "Body composition", "Joint/soft-tissue pain", "General longevity"],
  },
  { kind: "yesno", q: "Have you used peptides before?" },
  ...CONTACT_STEPS,
  {
    kind: "reveal", emoji: "🧬", title: "Thanks — that's everything for now.",
    body: "Monika will build your protocol from your baseline panel.",
    summaryFn: (a) => [{ label: "Goals", value: (a.s0 as string[] | undefined)?.join(", ") ?? "—" }],
  },
];

const trtSteps: IntakeStep[] = [
  {
    kind: "multi", q: "Which of these have you noticed?",
    sub: "Select all that apply.",
    items: ["Fatigue sleep doesn't fix", "Low libido", "Loss of muscle/strength", "Low mood or irritability", "None of these"],
  },
  { kind: "yesno", q: "Do you want to preserve fertility (have or may want children)?" },
  ...CONTACT_STEPS,
  {
    kind: "reveal", emoji: "💪", title: "Thanks — that's everything for now.",
    body: "Two morning total testosterone draws are required before any treatment decision.",
    summaryFn: (a) => [{ label: "Symptoms", value: (a.s0 as string[] | undefined)?.join(", ") ?? "—" }],
  },
];

const hrtSteps: IntakeStep[] = [
  {
    kind: "multi", q: "What are you experiencing?",
    sub: "Select all that apply.",
    items: ["Hot flashes/night sweats", "Sleep disruption", "Mood changes/brain fog", "Vaginal dryness", "Low libido"],
  },
  { kind: "yesno", q: "Do you still have a uterus?" },
  ...CONTACT_STEPS,
  {
    kind: "reveal", emoji: "🌸", title: "Thanks — that's everything for now.",
    body: "Monika will walk through what applies to you specifically at your visit.",
    summaryFn: (a) => [{ label: "Symptoms", value: (a.s0 as string[] | undefined)?.join(", ") ?? "—" }],
  },
];

export const INTAKE_STEPS: Record<string, IntakeStep[]> = {
  "glp-1-weight-management": glp1Steps,
  "peptide-therapy": peptideSteps,
  "testosterone-for-men": trtSteps,
  "hormone-therapy-for-women": hrtSteps,
};
