export interface ServiceFaq {
  question: string;
  answer: string[];
}

export interface Service {
  slug: string;
  /** Short display name, e.g. "Wrinkle Relaxers" */
  name: string;
  /** Product/brand line shown under the name, e.g. "Botox® & Dysport®" */
  brand?: string;
  /** Label used in nav menus */
  menuLabel: string;
  /** One-line hook for cards and heroes */
  tagline: string;
  /** Card copy on the services index — verbatim from the current site */
  cardDescription: string;
  /** Intro paragraphs on the detail page — verbatim from the current site */
  intro: string[];
  /** Bullet highlights (treatment areas / benefits), if the page has them */
  highlights?: string[];
  faqs: ServiceFaq[];
  image: { src: string; alt: string };
  comingSoon?: boolean;
  /** When set, the card links here instead of /services/[slug] (the laser line lives at /treatments). */
  href?: string;
  /** When set, the detail page also offers this as a telehealth alternative (Nov 2026, Monika: cross-link
   *  Cosmetic Rx and Medical Weight Loss to The Labo Method so patients who'd rather not come in can). */
  telehealthHref?: string;
  seo: { title: string; description: string };
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface PostSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, e.g. "2024-03-14" */
  date: string;
  /** Local image path under /images, chosen from the service images */
  image: { src: string; alt: string };
  body: PostSection[];
  seo: { title: string; description: string };
}

export interface CareInstructionSet {
  /** Treatment name, e.g. "Wrinkle Relaxers — Botox & Dysport" */
  treatment: string;
  /** Matching service slug when one exists, for cross-linking */
  serviceSlug?: string;
  pre: string[];
  post: string[];
  /** Trailing notes such as expected duration / side effects */
  notes?: string[];
}

export interface LegalSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
}
