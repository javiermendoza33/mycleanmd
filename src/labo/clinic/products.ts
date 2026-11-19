import { CLINIC_SITE } from "@/labo/clinic/site";

/**
 * The shop (Nov 19 2026, Javier: "Monika wanted a look and feel like facileskin.com… she wants to sell
 * products as well"). Retail skincare from the lines the clinic already partners with (the partner
 * strip: skinbetter science, Alastin, SkinMedica). One catalog, read by the home page's best-seller
 * row, /shop, /shop/[slug], the bag drawer and the Stripe checkout route — change a product here only.
 *
 * Prices: typical US retail for each item as a starting point; `pricesConfirmed:false` prints a
 * "pricing being finalized" note on the shop until Mónika confirms her list. Photos: none yet, so
 * every product renders a drawn packshot (Packshot.tsx) in the line's tone; drop a real photo in
 * `image` to replace it per product.
 */
export type ProductType = "Cleanser" | "Exfoliant" | "Serum" | "Moisturizer" | "Sunscreen" | "Eyes";
export type Concern = "Acne" | "Aging" | "Dryness" | "Sensitive" | "Pigment";
export type Form = "bottle" | "jar" | "tube";

export interface Product {
  slug: string;
  name: string;
  line: string;
  lineShort: string;
  type: ProductType;
  concerns: Concern[];
  form: Form;
  tone: string;
  label: string;
  size: string;
  price: number; // USD
  tagline: string;
  blurb: string;
  how: string[];
  actives: string[];
  bestSeller?: boolean;
  image?: { src: string; alt: string };
}

export const SHOP = {
  currency: "usd",
  freeShippingOver: 75,
  flatShipping: 8,
  pricesConfirmed: false,
  promo: CLINIC_SITE.promo,
  /** The line's own authorized store — kept as the alternative while online checkout is being set up. */
  skinbetterStore: CLINIC_SITE.shopUrl,
  shipsTo: "Ships within the US · pick up in South Lake Union is free",
} as const;

export const CONCERNS: Concern[] = ["Acne", "Aging", "Dryness", "Sensitive", "Pigment"];
export const TYPES: ProductType[] = ["Cleanser", "Exfoliant", "Serum", "Moisturizer", "Sunscreen", "Eyes"];

export const products: Product[] = [
  {
    slug: "skinbetter-alto-advanced", name: "Alto Advanced Defense and Repair Serum", line: "skinbetter science", lineShort: "skinbetter",
    type: "Serum", concerns: ["Aging", "Pigment"], form: "bottle", tone: "#D9C7B2", label: "Alto Advanced", size: "1 oz · 30 mL", price: 180, bestSeller: true,
    tagline: "The antioxidant serum that does the heavy lifting.",
    blurb: "A broad antioxidant blend that helps defend skin against the free-radical damage behind fine lines, dullness and uneven tone. Light, fast-absorbing, and the one product Mónika puts under every routine.",
    how: ["Morning and night, after cleansing", "One to two pumps over the face, neck and chest", "Follow with moisturizer and, in the morning, sunscreen"],
    actives: ["Antioxidant complex", "Vitamin E", "Peptides"],
  },
  {
    slug: "skinbetter-alpharet-overnight", name: "AlphaRet Overnight Cream", line: "skinbetter science", lineShort: "skinbetter",
    type: "Moisturizer", concerns: ["Aging", "Acne", "Pigment"], form: "jar", tone: "#B9B3AE", label: "AlphaRet", size: "1.7 oz · 50 mL", price: 135, bestSeller: true,
    tagline: "Retinoid results without the retinoid drama.",
    blurb: "A retinoid and alpha-hydroxy acid combined in one overnight cream, built to visibly smooth lines, texture and tone with far less of the redness and peeling that usually come with retinol.",
    how: ["Nightly, on clean dry skin", "Start three nights a week and build up", "Pair with daily sunscreen"],
    actives: ["Retinoid + AHA", "Peptides", "Ceramides"],
  },
  {
    slug: "skinbetter-oxygen-infusion-wash", name: "Oxygen Infusion Wash", line: "skinbetter science", lineShort: "skinbetter",
    type: "Cleanser", concerns: ["Sensitive", "Dryness"], form: "tube", tone: "#CFE3DC", label: "Oxygen Infusion Wash", size: "5 oz · 150 mL", price: 65,
    tagline: "A clean that doesn't strip.",
    blurb: "A gentle, non-foaming cleanser that lifts makeup, sunscreen and the day off the skin while leaving the barrier calm and comfortable.",
    how: ["Morning and night", "Massage a small amount over damp skin", "Rinse with lukewarm water"],
    actives: ["Alpha-hydroxy acids", "Soothing botanicals"],
  },
  {
    slug: "skinbetter-sunbetter-tone-smart", name: "sunbetter TONE SMART SPF 68", line: "skinbetter science", lineShort: "skinbetter",
    type: "Sunscreen", concerns: ["Pigment", "Aging", "Sensitive"], form: "tube", tone: "#E8D3BC", label: "sunbetter SPF 68", size: "1.7 oz · 50 mL", price: 70, bestSeller: true,
    tagline: "Mineral protection with a sheer, adaptable tint.",
    blurb: "A 100% mineral sunscreen with a tone-adapting tint, so it blends in instead of leaving a white cast. Broad spectrum, water resistant, and the last step of every morning routine we write.",
    how: ["Every morning as the last step", "Reapply every two hours outdoors", "Doubles as a light makeup base"],
    actives: ["Zinc oxide", "Titanium dioxide", "Antioxidants"],
  },
  {
    slug: "skinbetter-interfuse-eye", name: "InterFuse Treatment Cream EYE", line: "skinbetter science", lineShort: "skinbetter",
    type: "Eyes", concerns: ["Aging", "Dryness"], form: "jar", tone: "#D6CBBF", label: "InterFuse Eye", size: "0.5 oz · 15 mL", price: 120,
    tagline: "For the lines that show up first.",
    blurb: "A peptide-rich eye cream that targets crow's feet, under-eye crepiness and puffiness, with hydration that lasts the day.",
    how: ["Morning and night", "A rice-grain amount patted around the orbital bone", "Avoid the lash line"],
    actives: ["Peptides", "Hyaluronic acid", "Caffeine"],
  },
  {
    slug: "skinbetter-even-tone", name: "Even Tone Correcting Serum", line: "skinbetter science", lineShort: "skinbetter",
    type: "Serum", concerns: ["Pigment"], form: "bottle", tone: "#E4C9A8", label: "Even Tone", size: "1.7 oz · 50 mL", price: 155,
    tagline: "Dark spots, sun damage and post-breakout marks, addressed.",
    blurb: "A hydroquinone-free brightening serum for discoloration from sun, hormones and old breakouts. Visible evening of tone in weeks, and safe for every skin tone and long-term use.",
    how: ["Morning and night, before moisturizer", "Over the whole face, not just the spots", "Always with daily sunscreen"],
    actives: ["Brightening complex", "Niacinamide", "Antioxidants"],
  },
  {
    slug: "alastin-restorative-skin-complex", name: "Restorative Skin Complex", line: "Alastin Skincare", lineShort: "Alastin",
    type: "Serum", concerns: ["Aging"], form: "bottle", tone: "#C9D3DD", label: "Restorative Skin Complex", size: "1 oz · 30 mL", price: 210, bestSeller: true,
    tagline: "The serum we send home after treatments.",
    blurb: "Alastin's peptide technology helps the skin clear damaged elastin and collagen and build new, healthy support. Ideal on its own, and the first thing we recommend after laser, microneedling or peels.",
    how: ["Morning and night", "One pump over the face and neck", "Layer under moisturizer and sunscreen"],
    actives: ["TriHex peptides", "Antioxidants", "Niacinamide"],
  },
  {
    slug: "alastin-gentle-cleanser", name: "Gentle Cleanser", line: "Alastin Skincare", lineShort: "Alastin",
    type: "Cleanser", concerns: ["Sensitive", "Dryness"], form: "tube", tone: "#DCE4EA", label: "Gentle Cleanser", size: "6 oz · 177 mL", price: 48,
    tagline: "Self-foaming, fragrance-free, post-procedure safe.",
    blurb: "A soft, self-foaming cleanser that removes impurities and makeup without disturbing a healing or sensitive barrier. Safe straight after in-office treatments.",
    how: ["Morning and night", "Lather over damp skin, rinse", "Use after treatments once cleared by your provider"],
    actives: ["Glycerin", "Sodium hyaluronate", "Oat extract"],
  },
  {
    slug: "alastin-hydratint-spf36", name: "HydraTint Pro Mineral SPF 36", line: "Alastin Skincare", lineShort: "Alastin",
    type: "Sunscreen", concerns: ["Aging", "Dryness"], form: "tube", tone: "#E1CDB7", label: "HydraTint SPF 36", size: "1.8 oz · 55 mL", price: 62,
    tagline: "Tinted mineral SPF that feels like skincare.",
    blurb: "A lightweight, tinted mineral sunscreen with hydrating peptides and antioxidants. Enough coverage to skip foundation on an everyday morning.",
    how: ["Every morning as the last step", "Reapply every two hours in the sun"],
    actives: ["Zinc oxide", "Titanium dioxide", "Peptides"],
  },
  {
    slug: "skinmedica-tns-advanced", name: "TNS Advanced+ Serum", line: "SkinMedica", lineShort: "SkinMedica",
    type: "Serum", concerns: ["Aging"], form: "bottle", tone: "#CFC4D6", label: "TNS Advanced+", size: "1 oz · 28.4 g", price: 295,
    tagline: "Growth factors for skin that wants to look rested.",
    blurb: "SkinMedica's two-chamber growth-factor serum, clinically shown to improve the look of coarse wrinkles, sagging and tone. The splurge, and the one patients re-order.",
    how: ["Morning and night", "One pump, blended from the dual chamber", "Follow with moisturizer"],
    actives: ["TNS-MR growth factors", "Peptides", "Marine extracts"],
  },
  {
    slug: "skinmedica-ha5", name: "HA5 Rejuvenating Hydrator", line: "SkinMedica", lineShort: "SkinMedica",
    type: "Moisturizer", concerns: ["Dryness", "Aging"], form: "bottle", tone: "#BFD5E6", label: "HA5", size: "2 oz · 56.7 g", price: 178,
    tagline: "Five forms of hyaluronic acid, instant plump.",
    blurb: "A hydrator that smooths the look of fine lines on contact and supports the skin's own hyaluronic acid over time. Sits well under makeup and sunscreen.",
    how: ["Morning and night, after serums", "A pea-sized amount over the face", "Layer under your moisturizer in dry months"],
    actives: ["5 forms of hyaluronic acid", "Vitamin E", "Time-release HA"],
  },
  {
    slug: "skinmedica-aha-bha-cleanser", name: "AHA/BHA Exfoliating Cleanser", line: "SkinMedica", lineShort: "SkinMedica",
    type: "Exfoliant", concerns: ["Acne", "Pigment"], form: "tube", tone: "#D8DFD4", label: "AHA/BHA Cleanser", size: "6 oz · 177 mL", price: 49,
    tagline: "A daily exfoliating wash for congested, uneven skin.",
    blurb: "Alpha- and beta-hydroxy acids plus jojoba beads clear pores and lift dull surface cells, for brighter, smoother skin without a separate scrub.",
    how: ["Morning or night, two to three times a week to start", "Massage over damp skin for 30 seconds, rinse", "Skip on retinoid nights if skin feels sensitive"],
    actives: ["Glycolic + lactic acid", "Salicylic acid", "Jojoba esters"],
  },
];

export const bestSellers = products.filter((p) => p.bestSeller);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const money = (n: number) => `$${n.toFixed(n % 1 ? 2 : 0)}`;
