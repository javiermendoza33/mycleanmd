import type { Post } from "@/labo/clinic/types";

export const post: Post = {
  slug: "compounded-medications-what-to-know",
  title: "Compounded Medications: What They Are, and What They Aren't",
  excerpt:
    "Compounded semaglutide, tirzepatide and peptides are common in telehealth right now. Here's the real difference between a compounded drug and the brand-name version.",
  date: "2026-11-17",
  image: {
    src: "/labo/img/services/wellness-iv-therapy.jpg",
    alt: "A gloved hand holding an IV bag filled with sliced fruit",
  },
  body: [
    {
      heading: "What \"compounded\" actually means",
      paragraphs: [
        "A compounded medication is prepared by a state-licensed pharmacy for an individual patient, rather than mass-manufactured by a pharmaceutical company. Compounding itself is a long-established, legitimate part of medicine — it's how you get a liquid version of a pill a child can't swallow, or a custom-dosed cream. The practice isn't new or inherently suspect. What's newer is how much compounding has scaled up specifically around GLP-1 medications, driven by shortages of the brand-name products.",
      ],
    },
    {
      heading: "The real distinction: FDA approval",
      paragraphs: [
        "Brand-name semaglutide and tirzepatide (Wegovy, Ozempic, Zepbound, Mounjaro) went through the FDA's full approval process — large trials, manufacturing review, ongoing safety monitoring. Compounded versions of the same active ingredient have not gone through that same process, even when the chemistry is intended to be identical. That doesn't automatically mean a compounded version is unsafe, but it does mean a layer of independent verification that exists for the brand-name drug simply isn't there for the compounded one.",
      ],
      list: [
        "Brand-name: FDA-approved, manufactured under FDA oversight, consistent dosing verified in trials",
        "Compounded: prepared by a licensed pharmacy, not individually FDA-approved, quality depends on that specific pharmacy",
        "Both can be legitimate — but they are not interchangeable claims about safety or consistency",
      ],
    },
    {
      heading: "Why pharmacy choice matters more than people assume",
      paragraphs: [
        "Not all compounding pharmacies operate at the same standard. Reputable ones are licensed, inspected, and compound from pharmaceutical-grade active ingredients with documented testing. Less reputable operations have been the source of real safety incidents — dosing errors, contamination, mislabeled concentration — that make the news precisely because compounding quality isn't uniform. If you're prescribed a compounded medication anywhere, it's reasonable to ask which pharmacy is preparing it and how it's sourced.",
      ],
    },
    {
      heading: "Where this practice lands on it",
      paragraphs: [
        "We'll tell you plainly, for any prescription, whether it's the brand-name product or a compounded preparation, which pharmacy is preparing it if compounded, and why — whether that's cost, availability, or a specific dosing need. If brand medication is available and appropriate for your situation, we'll pursue that first. The goal isn't to default to whichever is easier to fill; it's to make sure you actually know what you're taking.",
      ],
    },
  ],
  seo: {
    title: "Compounded Medications: What They Are, and What They Aren't",
    description: "The real difference between compounded and FDA-approved GLP-1 medications, why pharmacy quality varies, and what to ask before starting either one.",
  },
};
