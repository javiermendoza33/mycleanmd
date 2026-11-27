import type { Post } from "@/labo/clinic/types";

export const post: Post = {
  slug: "how-telehealth-hormone-care-works",
  title: "How Telehealth Hormone & Metabolic Care Actually Works",
  excerpt:
    "No physical exam, a video call instead of a waiting room — telehealth changes the format of care, not the standard. Here's what that means in practice.",
  date: "2026-11-15",
  image: {
    src: "/labo/img/about/clinic.jpg",
    alt: "A small group talking and laughing together",
  },
  body: [
    {
      heading: "Labs come before the visit, not after",
      paragraphs: [
        "A telehealth intake for GLP-1, peptide, testosterone or hormone care doesn't start with a video call — it starts with a lab order, sent to a draw site near you. By the time you're actually on a call with a clinician, there's a real metabolic or hormone panel to look at, not just a symptom questionnaire. That ordering matters: a plan built on your actual labs is a different thing than a dose assigned from your answers to a form.",
      ],
    },
    {
      heading: "What a video visit can and can't replace",
      paragraphs: [
        "Telehealth is genuinely good at the parts of hormone and metabolic care that are conversation-and-data driven: reviewing labs, adjusting a dose, discussing side effects, deciding whether to continue a protocol. It's not a substitute for a physical exam, and a responsible telehealth practice will say so and refer out when an in-person exam, imaging, or a specialist is actually what the situation calls for — rather than stretching a video call past what it can reasonably assess.",
      ],
    },
    {
      heading: "The visit schedule isn't arbitrary",
      paragraphs: [
        "Check-ins at weeks 2, 6 and 12, then roughly every eight weeks, aren't a billing cadence — they map to when side effects typically show up, when a dose usually needs adjusting, and when it's time to re-check labs to see if the plan is actually working. A program that skips this schedule in favor of \"refill on request\" has quietly dropped the monitoring that makes the medication safer in the first place.",
      ],
      list: [
        "Week 2: early side-effect check, first dose adjustment if needed",
        "Week 6: tolerance and early response check",
        "Week 12: first full re-evaluation against the baseline labs",
        "Every 8 weeks after: ongoing monitoring, labs repeated as indicated",
      ],
    },
    {
      heading: "Licensing is a real boundary, not a formality",
      paragraphs: [
        "A clinician can only legally treat a patient who is physically located in a state where that clinician is licensed — this is true no matter how good the technology is. That's why sign-up starts with a straightforward question about where you live, and why your care is matched to a clinician licensed in your state, instead of pretending geography doesn't matter.",
      ],
    },
  ],
  seo: {
    title: "How Telehealth Hormone & Metabolic Care Actually Works",
    description: "What a telehealth intake for GLP-1, peptide, testosterone or hormone therapy actually involves — labs first, a real visit schedule, and the limits of what video can assess.",
  },
};
