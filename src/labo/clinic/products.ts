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
  /** Sold through a partner's own storefront (never our Stripe checkout): ALASTIN or skinbetter science. */
  partner?: "alastin" | "skinbetter";
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
  // ── skinbetter science® — best sellers (Nov 21 2026, Javier: "since we will also sell Skinbetter, lets use just the best
  //    sellers for now"). skinbetter.com sits behind a bot challenge, so this is the 2026 ranked best-seller set with sizes
  //    and suggested retail from an independent guide (cross-checked against search snippets of skinbetter's own pages);
  //    reconcile names/prices against the official Best Sellers page when Javier sends a screenshot. No packshots yet —
  //    the drawn Packshot stands in until the partner kit supplies files. Same partner model as ALASTIN. ─────────────
  { slug: "skinbetter-alpharet-overnight", name: "AlphaRet Overnight Cream", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Moisturizer", concerns: ["Aging", "Acne", "Pigment"], form: "jar", tone: "#B9B3AE", label: "AlphaRet", size: "30 mL · also 50 mL", price: 145, bestSeller: true,
    tagline: "Retinoid results without the retinoid drama.", blurb: "A retinoid bonded to lactic acid (AlphaRet) that renews texture, tone and lines with far less of the redness and peeling usual retinol brings. The one product most patients re-order.",
    how: ["Nightly, on clean dry skin", "Start three nights a week and build up", "Sunscreen every morning"], actives: ["AlphaRet (retinoid + lactic acid)", "Peptides", "Ceramides"] },
  { slug: "skinbetter-alto-defense-serum", name: "Alto Defense Serum", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Serum", concerns: ["Aging", "Pigment"], form: "bottle", tone: "#D9C7B2", label: "Alto", size: "30 mL · also 50 mL", price: 175, bestSeller: true,
    tagline: "Nineteen antioxidants, one morning step.", blurb: "A broad antioxidant serum that guards against the free-radical damage behind fine lines, dullness and uneven tone. Light, fast-absorbing, and the base of nearly every routine we write.",
    how: ["Morning and night, after cleansing", "One to two pumps over the face, neck and chest", "Follow with moisturizer and, in the morning, sunscreen"], actives: ["19-antioxidant complex", "Vitamin E", "Peptides"] },
  { slug: "skinbetter-even-intensive-serum", name: "Even Intensive Skin Tone Correcting Serum", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Serum", concerns: ["Pigment"], form: "bottle", tone: "#E4C9A8", label: "Even Intensive", size: "50 mL", price: 190, bestSeller: true,
    tagline: "Brown, red and yellow discoloration, addressed.", blurb: "A hydroquinone-free corrector for discoloration from sun, hormones and old breakouts — visible evening of tone in weeks, safe for every skin tone and for long-term use.",
    how: ["Morning and night, before moisturizer", "Over the whole face, not just the spots", "Always with daily sunscreen"], actives: ["Brightening complex", "Niacinamide", "Antioxidants"] },
  { slug: "skinbetter-mystro-active-balance", name: "Mystro Active Balance Serum", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Serum", concerns: ["Sensitive", "Pigment", "Aging"], form: "bottle", tone: "#CDD6CF", label: "Mystro", size: "30 mL · also 50 mL", price: 225,
    tagline: "Plant adaptogens for reactive, uneven skin.", blurb: "An adaptogen serum that helps the skin manage redness, rough texture, dullness and uneven pigmentation — the pick for skin that reacts to everything.",
    how: ["Morning and night on clean skin", "Press over the face and neck", "Layer under moisturizer"], actives: ["Plant adaptogens", "Antioxidants"] },
  { slug: "skinbetter-sunbetter-tone-smart-spf75", name: "sunbetter TONE SMART SPF 75 Sunscreen Lotion", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Sunscreen", concerns: ["Pigment", "Aging", "Sensitive"], form: "tube", tone: "#E8D3BC", label: "sunbetter SPF 75", size: "50 mL", price: 75, bestSeller: true,
    tagline: "Mineral protection with a sheer, adaptable tint.", blurb: "A 100% mineral broad-spectrum lotion with a tone-adapting tint, so it blends in instead of leaving a white cast. Doubles as a primer; the last step of every morning routine.",
    how: ["Every morning as the last step", "Reapply every two hours outdoors"], actives: ["Zinc oxide", "Titanium dioxide", "Antioxidants"] },
  { slug: "skinbetter-eyemax-alpharet", name: "EyeMax AlphaRet Overnight Cream", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Eyes", concerns: ["Aging"], form: "jar", tone: "#D6CBBF", label: "EyeMax", size: "15 mL", price: 135,
    tagline: "The AlphaRet retinoid, made for under the eyes.", blurb: "A gentle retinoid eye cream for puffiness, crepiness and the first lines, for evening use.",
    how: ["Nightly", "A rice-grain amount patted around the orbital bone", "Avoid the lash line"], actives: ["AlphaRet", "Peptides", "Caffeine"] },
  { slug: "skinbetter-trio-rebalancing", name: "Trio Rebalancing Moisture Treatment", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Moisturizer", concerns: ["Dryness", "Sensitive"], form: "jar", tone: "#DCE4E6", label: "Trio", size: "50 mL", price: 160,
    tagline: "Hydration three ways.", blurb: "A moisturizer that hydrates through three mechanisms at once — humectant, emollient and barrier support — for skin that stays comfortable all day.",
    how: ["Morning and night, after serums", "A pea-sized amount over the face"], actives: ["Hyaluronic acid", "Ceramides", "Lipid complex"] },
  { slug: "skinbetter-mystro-revive", name: "Mystro Revive Renewing Serum", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Serum", concerns: ["Aging", "Dryness"], form: "bottle", tone: "#D8CFD9", label: "Mystro Revive", size: "30 mL", price: 245,
    tagline: "For the skin changes of perimenopause and menopause.", blurb: "A serum formulated for thinning, drying, less elastic skin in perimenopause and menopause — pairs naturally with the hormone care on our telehealth side.",
    how: ["Morning and night on clean skin", "Press over the face and neck", "Layer under moisturizer"], actives: ["Adaptogen complex", "Peptides"] },
  { slug: "skinbetter-techno-neck", name: "Techno Neck Perfecting Cream", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Moisturizer", concerns: ["Aging"], form: "jar", tone: "#D2D6DC", label: "Techno Neck", size: "50 mL", price: 160,
    tagline: "The neck and chest, finally looked after.", blurb: "A cream for the neck and décolletage that supports the look of firmness, texture and tone where the face routine usually stops.",
    how: ["Morning and night", "Smooth upward over the neck and chest"], actives: ["Peptides", "Antioxidants"] },
  { slug: "skinbetter-ampra-ha", name: "Ampra Volumizing Macro HA Serum", line: "skinbetter science", lineShort: "skinbetter", partner: "skinbetter",
    type: "Serum", concerns: ["Dryness", "Aging"], form: "bottle", tone: "#D8E1E6", label: "Ampra", size: "30 mL", price: 180,
    tagline: "Macro hyaluronic acid for plumpness and lift.", blurb: "A hyaluronic-acid serum built to improve plumpness, lift and texture — the hydration step for skin that has lost bounce.",
    how: ["Morning and night on damp skin", "Press in, then moisturizer"], actives: ["Macro hyaluronic acid", "Peptides"] },
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
/** Partner storefront brands in each brand's own trademark casing. Lives here (not in a "use client" file) so
 *  server components get the real map — a client module's non-component export is a stub on the server. */
export const PARTNER_NAME: Record<string, string> = { alastin: ALASTIN, skinbetter: "skinbetter science®" };
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const money = (n: number) => `$${n.toFixed(n % 1 ? 2 : 0)}`;
/** True when a product can't go in the bag: coming soon, or a partner item (bought on the partner's store). */
export const notInBag = (p: Product) => !!p.soon || !!p.partner;
