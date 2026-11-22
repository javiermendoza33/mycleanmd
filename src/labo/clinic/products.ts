import { CLINIC_SITE } from "@/labo/clinic/site";

/**
 * The shop (Nov 19 2026, Javier: "Monika wanted a look and feel like facileskin.com… she wants to sell
 * products as well"). Retail skincare from the lines the clinic partners with. One catalog, read by the
 * home page's ALASTIN row, /shop, /shop/[slug], the bag drawer, the skin quiz and the Stripe checkout
 * route — change a product here only.
 *
 * Nov 21 2026 (Javier: "we will be selling these Alastin products, Anti-Ageing and Serums… remove our own
 * brand replace with Alastin… we will add the unique links once we have them"): the Selfnamed own-line
 * placeholders are gone. ALASTIN Skincare® items are `partner: "alastin"` — sold through the practice's
 * ALASTIN partner storefront, never our Stripe checkout. `buyUrl` holds each product's unique partner
 * link; until it's set the button reads "Available soon at ALASTIN Skincare®". Names, MSRP, sizes and
 * packshots were taken from alastin.com's Anti-Aging and Serums collections on Nov 21 2026 (kits and
 * holiday sets skipped); packshots are hotlinked from ALASTIN's CDN until the partner kit supplies files.
 * Trademark/MAP per ALASTIN's web spec: "ALASTIN Skincare®" title case, no discounts near their buttons.
 *
 * Prices for the clinic-stocked lines (skinbetter, SkinMedica) are typical US retail as a starting point;
 * `pricesConfirmed:false` prints a "pricing being finalized" note until Mónika confirms her list.
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
  price: number; // USD (MSRP for partner lines)
  tagline: string;
  blurb: string;
  how: string[];
  actives: string[];
  bestSeller?: boolean;
  image?: { src: string; alt: string };
  /** Kept for historical labo_orders rows (the former Selfnamed own line); no current product sets it. */
  own?: boolean;
  /** Shown on the shop but not purchasable yet */
  soon?: boolean;
  /** Sold through a partner's own storefront (never our Stripe checkout). */
  partner?: "alastin";
  /** The practice's unique partner link for this product — the card/PDP button goes here, in a new tab. */
  buyUrl?: string;
}

export const SHOP = {
  currency: "usd",
  freeShippingOver: 75,
  flatShipping: 8,
  pricesConfirmed: false,
  promo: CLINIC_SITE.promo,
  /** The line's own authorized store — kept as the alternative while online checkout is being set up. */
  skinbetterStore: CLINIC_SITE.shopUrl,
  shipsTo: "Ships within the US · pick up where South Lake Union meets Eastlake is free",
  /** ALASTIN's public site — the per-product `buyUrl`s replace this once the practice has them. */
  alastinSite: "https://alastin.com",
} as const;

export const CONCERNS: Concern[] = ["Acne", "Aging", "Dryness", "Sensitive", "Pigment"];
export const TYPES: ProductType[] = ["Cleanser", "Exfoliant", "Serum", "Moisturizer", "Sunscreen", "Eyes"];

const ALASTIN = "ALASTIN Skincare®";
const cdn = (file: string) => `https://cdn.shopify.com/s/files/1/1504/4854/files/${file}`;

export const products: Product[] = [
  // ── ALASTIN Skincare® — Anti-Aging + Serums (Nov 21 2026) ─────────────────────────────────────────────
  { slug: "alastin-c-radical-defense-serum", name: "C-RADICAL Defense Antioxidant Serum", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Serum", concerns: ["Aging", "Pigment"], form: "bottle", tone: "#D9CBB6", label: "C-RADICAL", size: "1 fl oz · 29 mL", price: 218, bestSeller: true,
    image: { src: cdn("C-RADICAL_Shadow.png?v=1766423168"), alt: "ALASTIN C-RADICAL Defense Antioxidant Serum bottle" },
    tagline: "The future of vitamin C.", blurb: "A clinically proven antioxidant serum built on a novel form of vitamin C plus 14 antioxidants, to defend against environmental stressors while helping conserve the skin's elastin.",
    how: ["Every morning on clean, dry skin", "Over the face, neck and chest", "Follow with moisturizer and sunscreen"], actives: ["Novel vitamin C", "14-antioxidant complex", "Elastin support"] },
  { slug: "alastin-ha-immerse-serum", name: "HA (Hyaluronic Acid) IMMERSE Serum™", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Serum", concerns: ["Dryness", "Sensitive"], form: "bottle", tone: "#D8E1E6", label: "HA IMMERSE", size: "1 fl oz · 29 mL", price: 134, bestSeller: true,
    image: { src: cdn("HA_Immerse_Shadow.png?v=1765340815"), alt: "ALASTIN HA IMMERSE Serum bottle" },
    tagline: "Instant and long-term hydration.", blurb: "A breakthrough hyaluronic-acid serum that delivers immediate hydration for smoother, more radiant skin while helping the skin amplify its own hyaluronic acid over time.",
    how: ["Morning and night on clean skin", "Press over the face and neck", "Layer under moisturizer"], actives: ["Hyaluronic acid", "Hydration-amplifying complex"] },
  { slug: "alastin-a-luminate-brightening-serum", name: "A-LUMINATE Brightening Serum™", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Serum", concerns: ["Pigment"], form: "bottle", tone: "#E3D3C2", label: "A-LUMINATE", size: "1.7 fl oz · 50 mL", price: 198,
    image: { src: cdn("AL_c7e16d17-3647-40b6-b728-191b5d09e0d9.png?v=1758313990"), alt: "ALASTIN A-LUMINATE Brightening Serum bottle" },
    tagline: "Surface pigmentation, without the irritation.", blurb: "Helps reduce the appearance of surface pigmentation, minimize its recurrence and protect against future damage, in a clinically proven, non-irritating formula.",
    how: ["Morning and night on clean skin", "Over the whole face, not just the spots", "Always with daily sunscreen"], actives: ["Brightening complex", "Pigment-recurrence support"] },
  { slug: "alastin-restorative-skin-complex", name: "Restorative Skin Complex with TriHex+™", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Serum", concerns: ["Aging"], form: "bottle", tone: "#C9CFDA", label: "Restorative Skin Complex", size: "1 fl oz · 29 mL", price: 258, bestSeller: true,
    image: { src: cdn("RSC_PDP_bottle_1.jpg?v=1793631117"), alt: "ALASTIN Restorative Skin Complex with TriHex+ bottle" },
    tagline: "The serum we send home after treatments.", blurb: "Visibly improves collagen- and elastin-depleted skin with the newly advanced TriHex+™ technology, targeting texture, tone, volume, hydration and elasticity. The first thing we recommend after laser, microneedling or peels.",
    how: ["Morning and night", "One pump over the face and neck", "Layer under moisturizer and sunscreen"], actives: ["TriHex+™ peptides", "Antioxidants"] },
  { slug: "alastin-renewal-retinol", name: "Renewal Retinol", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Serum", concerns: ["Aging", "Acne"], form: "bottle", tone: "#CBC4D3", label: "Renewal Retinol", size: "1 fl oz · 29 mL · 0.25 or 0.5", price: 81,
    image: { src: cdn("Retinol_.5.png?v=1758564937"), alt: "ALASTIN Renewal Retinol bottle" },
    tagline: "Encapsulated retinol, two strengths.", blurb: "A lipid-encapsulated retinol serum that supports smoother texture, improves tone and reduces the appearance of fine lines and wrinkles. Start at 0.25, move to 0.5 when your skin is ready.",
    how: ["Nightly on clean, dry skin", "A pea-sized amount; start three nights a week", "Sunscreen every morning"], actives: ["Encapsulated retinol", "Oat extract", "Niacinamide"] },
  { slug: "alastin-restorative-eye-complex", name: "Restorative Eye Complex with TriHex Technology®", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Eyes", concerns: ["Aging"], form: "bottle", tone: "#D5CFC8", label: "Restorative Eye Complex", size: "0.5 fl oz · 15 mL", price: 128,
    image: { src: cdn("Restorative_Eye_Complex_Shadow.png?v=1758537976"), alt: "ALASTIN Restorative Eye Complex bottle" },
    tagline: "Puffiness, dark circles and the first lines.", blurb: "An award-winning anti-aging eye cream that reduces the appearance of puffiness and dark circles while smoothing fine lines and wrinkles around the eyes. Post-procedure safe.",
    how: ["Morning and night", "A rice-grain amount patted around the orbital bone"], actives: ["TriHex Technology®", "Peptides", "Caffeine"] },
  { slug: "alastin-restorative-neck-complex", name: "Restorative Neck Complex with TriHex Technology®", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Moisturizer", concerns: ["Aging"], form: "bottle", tone: "#D2D6DC", label: "Restorative Neck Complex", size: "2 fl oz · 59 mL", price: 158,
    image: { src: cdn("Restoratie_Neck_Complex_Shadow.png?v=1758537832"), alt: "ALASTIN Restorative Neck Complex bottle" },
    tagline: "Texture, pigment and lines on the neck and chest.", blurb: "A next-generation skin tightener, clinically proven to improve the appearance of texture, pigmentation and wrinkles on the neck and décolleté.",
    how: ["Morning and night", "Smooth upward over the neck and chest"], actives: ["TriHex Technology®", "Skin-tightening peptides"] },
  { slug: "alastin-ultra-nourishing-moisturizer", name: "Ultra Nourishing Moisturizer with TriHex Technology®", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Moisturizer", concerns: ["Dryness", "Aging"], form: "jar", tone: "#E2D9CC", label: "Ultra Nourishing", size: "2 oz · 59 mL", price: 98,
    image: { src: cdn("Ultra_Nourishing_Moisturizer_Shadow.png?v=1758537727"), alt: "ALASTIN Ultra Nourishing Moisturizer jar" },
    tagline: "Rich hydration for dry or post-treatment skin.", blurb: "Hydrates, nourishes and soothes with linoleic acid, oat kernel, silver mushroom and TriHex Technology®. The moisturizer we reach for in winter and after laser.",
    how: ["Morning and night, after serums", "A pea-sized amount over the face"], actives: ["TriHex Technology®", "Linoleic acid", "Oat kernel", "Silver mushroom"] },
  { slug: "alastin-ultra-light-moisturizer", name: "Ultra Light Moisturizer with TriHex Technology®", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Moisturizer", concerns: ["Acne", "Sensitive"], form: "jar", tone: "#DDE4E6", label: "Ultra Light", size: "2 oz · 59 mL", price: 98,
    image: { src: cdn("Ultra_Light_Moisturizer_Shadow.png?v=1758537561"), alt: "ALASTIN Ultra Light Moisturizer jar" },
    tagline: "Weightless hydration for oily or sensitive skin.", blurb: "Lightweight hydration that encourages the skin's own elastin and collagen production. The one for combination, oily and reactive skin.",
    how: ["Morning and night, after serums", "A pea-sized amount over the face"], actives: ["TriHex Technology®", "Lightweight hydrators"] },
  { slug: "alastin-hydratint-spf36", name: "HydraTint Pro Mineral Broad Spectrum Sunscreen SPF 36", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Sunscreen", concerns: ["Aging", "Dryness", "Sensitive"], form: "tube", tone: "#E1CDB7", label: "HydraTint SPF 36", size: "1.8 fl oz · 55 mL", price: 84, bestSeller: true,
    image: { src: cdn("Hydratint_Shadow.png?v=1758537886"), alt: "ALASTIN HydraTint Pro Mineral Sunscreen SPF 36 tube" },
    tagline: "Tinted mineral SPF that feels like skincare.", blurb: "A lightweight, mineral, broad-spectrum tinted sunscreen that hydrates and protects from UVA/UVB while leaving a soft, glowing finish. Enough coverage to skip foundation.",
    how: ["Every morning as the last step", "Reapply every two hours in the sun"], actives: ["Zinc oxide", "Titanium dioxide", "Hydrating peptides"] },
  { slug: "alastin-silkshield-spf30", name: "SilkSHIELD® All Mineral Sunscreen SPF 30 with TriHex Technology®", line: ALASTIN, lineShort: "ALASTIN", partner: "alastin",
    type: "Sunscreen", concerns: ["Sensitive", "Aging"], form: "tube", tone: "#E8E3DB", label: "SilkSHIELD SPF 30", size: "2 fl oz · 59 mL", price: 78,
    image: { src: cdn("Silk_Shield_Shadow.png?v=1758537423"), alt: "ALASTIN SilkSHIELD All Mineral Sunscreen SPF 30 tube" },
    tagline: "Transparent mineral protection, untinted.", blurb: "Powerful yet gentle all-mineral protection in a transparent finish, with an exclusive peptide blend that keeps working after sunset.",
    how: ["Every morning as the last step", "Reapply every two hours outdoors"], actives: ["Zinc oxide", "TriHex Technology®", "Peptides"] },
  // ── skinbetter science (clinic-stocked) ─────────────────────────────────────────────────────────────
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
  // ── SkinMedica (clinic-stocked) ────────────────────────────────────────────────────────────────────
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
export const alastinLine = products.filter((p) => p.partner === "alastin");
export const LINES = [ALASTIN, "skinbetter science", "SkinMedica"] as const;
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const money = (n: number) => `$${n.toFixed(n % 1 ? 2 : 0)}`;
/** True when a product can't go in the bag: coming soon, or a partner item (bought on the partner's store). */
export const notInBag = (p: Product) => !!p.soon || !!p.partner;
