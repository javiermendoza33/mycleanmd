import type { Post } from "@/labo/clinic/types";

export const post: Post = {
  slug: "glp-1-weight-loss-what-the-evidence-shows",
  title: "GLP-1 Weight Loss: What the Evidence Actually Shows",
  excerpt:
    "Semaglutide and tirzepatide are the most studied weight-loss medications in a generation. Here's what the major trials found — and what they didn't.",
  date: "2026-11-10",
  image: {
    src: "/labo/img/services/medical-weight-loss.jpg",
    alt: "Hands holding a heart-shaped bowl of vegetables, fruit and lean protein next to workout gear",
  },
  body: [
    {
      heading: "Two drugs, two large trials",
      paragraphs: [
        "Most of what people mean by \"GLP-1s for weight loss\" comes down to two medications: semaglutide (the active ingredient in Wegovy and Ozempic) and tirzepatide (the active ingredient in Zepbound and Mounjaro). Both mimic gut hormones that slow digestion and reduce appetite. Both were tested in large, randomized, placebo-controlled trials before approval — which is the kind of evidence that actually tells you what a drug does, not just what people hope it does.",
        "Semaglutide's weight-loss trial, STEP 1, followed adults without diabetes for 68 weeks. The semaglutide group lost close to 15% of their starting body weight on average; the placebo group lost about 2%. Tirzepatide's trial, SURMOUNT-1, ran 72 weeks and found even larger average losses at the higher doses — into the low-to-mid 20% range — compared to a few percent on placebo.",
      ],
    },
    {
      heading: "What that actually means for a person",
      paragraphs: [
        "A percentage on a chart isn't the same as a result in a specific body, and average isn't the same as guaranteed. Some people respond strongly, some respond modestly, and a small number don't tolerate the medication well enough to stay on it. The trials also made one thing very clear: when people stop taking the medication, most regain a meaningful share of the weight over the following year. GLP-1 therapy, at least so far, behaves like a treatment for a chronic condition — not a course you finish and walk away from.",
      ],
    },
    {
      heading: "The side effects are real, and mostly GI",
      paragraphs: [
        "Nausea, constipation, and reflux are the most common reasons people stop. They're usually worst during dose increases and ease as the body adjusts, which is why a supervised titration schedule — not a fixed calendar, but one that responds to how you're actually tolerating each dose — matters more than people expect going in. Rare but serious risks (gallbladder disease, pancreatitis) are tracked and discussed before starting, along with the contraindication for anyone with a personal or family history of medullary thyroid carcinoma or MEN2.",
      ],
      list: [
        "Most common: nausea, constipation, reflux, fatigue during titration",
        "Less common but notable: gallbladder disease, pancreatitis",
        "Contraindicated: personal/family history of medullary thyroid carcinoma, MEN2",
        "Not studied for safety in pregnancy — stopped before conception",
      ],
    },
    {
      heading: "Compounded versus brand",
      paragraphs: [
        "Supply shortages pushed a lot of people toward compounded semaglutide and tirzepatide — versions prepared by a licensed compounding pharmacy rather than manufactured by Novo Nordisk or Eli Lilly. Compounded medications are not FDA-approved products; they haven't gone through the same manufacturing review as the brand-name drug, even when the active ingredient is the same. That's not automatically disqualifying — compounding has a long, legitimate history in medicine — but it's a real distinction, and you should always know which one you're being given and why.",
      ],
    },
    {
      heading: "The honest summary",
      paragraphs: [
        "The trial evidence for GLP-1 medications in weight management is unusually strong for a weight-loss intervention — large sample sizes, randomized design, real placebo comparison, multi-year follow-up. That's not the same as saying it's right for everyone, or that the number on the study slide is the number you'll see. It's a real tool, with real tradeoffs, that works best with real monitoring — labs before you start, a dose plan that adjusts to you, and someone watching for the parts that don't show up on a chart.",
      ],
    },
  ],
  seo: {
    title: "GLP-1 Weight Loss: What the Evidence Actually Shows",
    description: "What the STEP and SURMOUNT trials found for semaglutide and tirzepatide, what the side effects really are, and the compounded-vs-brand question — explained plainly.",
  },
};
