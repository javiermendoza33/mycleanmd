import type { Post } from "@/labo/clinic/types";

export const post: Post = {
  slug: "peptide-therapy-what-we-know-and-dont",
  title: "Peptide Therapy: What We Know, and What We Don't",
  excerpt:
    "Peptides get marketed as a cure-all for recovery and aging. The honest picture is more mixed — some agents have real human data, others barely have any.",
  date: "2026-11-11",
  image: {
    src: "/labo/img/misc/blog.jpg",
    alt: "Close-up of healthy, hydrated skin",
  },
  body: [
    {
      heading: "\"Peptides\" is not one thing",
      paragraphs: [
        "A peptide is just a short chain of amino acids — the term covers everything from insulin (decades of use, extremely well studied) to growth-hormone secretagogues like CJC-1295 and ipamorelin, to recovery-focused agents like BPC-157. Lumping them together under one marketing word is part of why the evidence conversation gets so muddy. Each agent needs to be judged on its own data, not on the category's reputation.",
      ],
    },
    {
      heading: "Where the evidence is strongest",
      paragraphs: [
        "Growth-hormone secretagogues have the most human trial data of the group, largely because some were studied for legitimate hormone-deficiency indications before the wellness market found them. Small clinical studies have shown effects on sleep quality and growth-hormone pulsatility. That's real, but it's also a narrower claim than \"anti-aging\" or \"fat loss\" — and small studies, even good ones, are not the same as the large randomized trials behind GLP-1 medications.",
      ],
    },
    {
      heading: "Where the evidence is thin",
      paragraphs: [
        "Agents like BPC-157, often marketed for tissue repair and injury recovery, are supported mostly by animal and in-vitro studies. That doesn't mean they do nothing — early-stage science sometimes holds up — but it does mean the human evidence most of the marketing implies simply isn't there yet. It's also worth knowing some of these agents sit in a genuinely unsettled regulatory space: several have moved on and off FDA's lists of substances compounding pharmacies may use, which is part of why availability has shifted over the past couple of years.",
      ],
    },
    {
      heading: "The honest ledger, by agent",
      paragraphs: ["Here's roughly where the evidence sits by category, as plainly as it can be put:"],
      list: [
        "Stronger human data: certain growth-hormone secretagogues (sleep, GH pulsatility — narrower claims than marketed)",
        "Thin/early human data: many \"repair\" peptides (BPC-157 and similar) — mostly preclinical",
        "Regulatory status: shifting; some agents have moved in and out of permitted compounding lists",
        "None of this category carries FDA approval for the uses they're typically sold for",
      ],
    },
    {
      heading: "Why we still offer it — with conditions",
      paragraphs: [
        "A program built on a baseline panel, a documented goal, and a plan to stop what isn't working is a reasonable way to use a category with mixed evidence — it's a very different thing from a questionnaire that ships a vial with no follow-up. If you start a peptide protocol here, you'll be told plainly which agent you're on, what it does and doesn't have good data for, and what the tradeoffs are before you begin. If the evidence doesn't support continuing, that's a conversation we have — not a subscription that just keeps renewing.",
      ],
    },
  ],
  seo: {
    title: "Peptide Therapy: What We Know, and What We Don't",
    description: "An honest look at the human evidence behind peptide therapy — where the data is real, where it's thin, and why the regulatory picture keeps shifting.",
  },
};
