import type { Post } from "@/labo/clinic/types";

export const post: Post = {
  slug: "hormone-therapy-for-women-the-new-evidence",
  title: "Hormone Therapy for Women: The Evidence Since the 2002 Scare",
  excerpt:
    "One study in 2002 changed how an entire generation of women were treated for menopause. Twenty years of follow-up research told a more complicated story.",
  date: "2026-11-13",
  image: {
    src: "/labo/img/misc/testimonials.jpg",
    alt: "A diverse group of women standing close together",
  },
  body: [
    {
      heading: "What the Women's Health Initiative actually found",
      paragraphs: [
        "The Women's Health Initiative (WHI), published in 2002, was a large randomized trial of combined hormone therapy. Its headline finding — a small but real increase in breast cancer and cardiovascular risk in the combined-therapy group — triggered an immediate, dramatic drop in hormone therapy use worldwide. For a long time afterward, \"hormones\" and \"risky\" became nearly synonymous in how menopause was discussed with patients.",
        "What got far less attention at the time: the average participant in that trial was in her early 60s and, on average, more than a decade past menopause. Risk in a 63-year-old starting hormone therapy for the first time is a different question than risk in a 50-year-old starting it at the onset of menopause — and the original headlines didn't make that distinction.",
      ],
    },
    {
      heading: "The timing hypothesis",
      paragraphs: [
        "Subsequent re-analyses of the WHI data, and newer trials designed specifically to test it, support what's now called the \"timing hypothesis\": hormone therapy started within about 10 years of menopause onset, or before age 60, has a more favorable risk profile — for cardiovascular outcomes in particular — than therapy started later in life. This is now reflected in the current position of The Menopause Society (formerly NAMS): for most healthy women within that window, the benefits of treating moderate-to-severe menopausal symptoms are considered to outweigh the risks.",
      ],
    },
    {
      heading: "What hormone therapy reliably helps",
      paragraphs: [
        "Hot flashes and night sweats remain the best-studied and most reliably improved symptoms. Vaginal dryness and related symptoms respond well, often to low-dose local estrogen alone. Bone density benefits are well established. Mood and cognitive effects are reported by many patients but are measured less consistently across trials than the physical symptoms — which is a pattern that shows up across a lot of hormone research, not just this one.",
      ],
      list: [
        "Well-supported: hot flashes, night sweats, vaginal/urogenital symptoms, bone density",
        "Reported but less consistently measured: mood, sleep quality, cognitive symptoms",
        "Timing matters: starting within ~10 years of menopause or before 60 changes the risk profile",
        "Not one-size-fits-all: estrogen-only vs. combined therapy carry different risk profiles depending on whether you have a uterus",
      ],
    },
    {
      heading: "Why this still needs a real evaluation, not a form",
      paragraphs: [
        "None of this makes hormone therapy risk-free, and it isn't right for every woman — a personal history of certain cancers, blood clots, or cardiovascular disease changes the calculation. The honest version of this evidence is: for the right candidate, started at the right time, with the right type of therapy for her own history, it's one of the better-supported treatments in menopausal medicine. Getting to \"the right candidate\" is the part that actually requires a lab panel and a real conversation, not a symptom checklist.",
      ],
    },
  ],
  seo: {
    title: "Hormone Therapy for Women: The Evidence Since the 2002 Scare",
    description: "How the 2002 WHI findings got misread for a generation, what the timing hypothesis actually says, and what menopausal hormone therapy reliably helps.",
  },
};
