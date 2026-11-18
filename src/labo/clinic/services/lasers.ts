import type { Service } from "../types";

/** The laser line is real at The Labo Method (Candela GentleMax Pro Plus) — the card sends people to /treatments. */
export const service: Service = {
  slug: "lasers",
  name: "Laser Treatments",
  brand: "Candela GentleMax Pro Plus",
  menuLabel: "Laser Treatments",
  tagline: "Laser hair removal for every skin type, sun spots, spider veins and skin rejuvenation.",
  cardDescription:
    "Laser hair removal for every skin type, sun spots, spider veins, skin rejuvenation and nail treatment on the Candela GentleMax Pro Plus. Every plan starts with an exam by a nurse practitioner.",
  intro: [],
  faqs: [],
  image: {
    src: "/labo/img/services/lasers.jpg",
    alt: "Woman with smooth, glowing skin after a laser skin treatment",
  },
  href: "/treatments",
  seo: {
    title: "Laser Treatments in Seattle, WA | The Labo Method",
    description:
      "Laser hair removal, sun spots, spider veins and skin rejuvenation on the Candela GentleMax Pro Plus at The Labo Method in Seattle.",
  },
};
