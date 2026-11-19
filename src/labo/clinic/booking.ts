/**
 * The clinic's own scheduler (sandbox, Nov 19 2026 — Javier: "lets remove [Vagaro] and copy as much as we could to build
 * our own"; the LIVE site keeps Vagaro until this is approved). Modeled on Vagaro's booking flow: category → service →
 * day → time → details + intake + consent → confirmation. Hours come from the provider portal's settings
 * (labo_provider_settings.hours, Pacific) and fall back to DEFAULT_HOURS here. Durations are working defaults and
 * prices are "at consult" until Monika pastes her Vagaro service menu — change them here only.
 */
export const BOOKING = {
  tz: "America/Los_Angeles",
  stepMin: 30,        // slot grid
  bufferMin: 15,      // gap after every appointment
  leadHours: 24,      // earliest online booking
  horizonDays: 60,    // how far ahead the calendar opens
  pricesConfirmed: false,
  cancelHours: 24,    // the clinic's own policy: reschedule/cancel 24 h before
  cancelFee: "$150",
} as const;

/** Mon–Fri 10–6, weekends by appointment only (CLINIC_SITE.hours) — used when the provider has not set hours in the portal. */
export const DEFAULT_HOURS: Record<string, { on: boolean; from: string; to: string }> = {
  mon: { on: true, from: "10:00", to: "18:00" }, tue: { on: true, from: "10:00", to: "18:00" }, wed: { on: true, from: "10:00", to: "18:00" },
  thu: { on: true, from: "10:00", to: "18:00" }, fri: { on: true, from: "10:00", to: "18:00" }, sat: { on: false, from: "10:00", to: "14:00" }, sun: { on: false, from: "10:00", to: "14:00" },
};

export type Category = "Consultations" | "Injectables" | "Skin" | "Laser" | "Wellness";
export const CATEGORIES: Category[] = ["Consultations", "Injectables", "Skin", "Laser", "Wellness"];

export interface MenuItem {
  slug: string;
  name: string;
  category: Category;
  min: number;
  /** USD; null = quoted at the visit (per unit / per syringe / per area) */
  price: number | null;
  priceNote?: string;
  desc: string;
  /** the site's service page, for the "Learn more" link */
  serviceSlug?: string;
  popular?: boolean;
  /** false = hidden from online booking (set from /clinic/services) */
  active?: boolean;
}

export const MENU: MenuItem[] = [
  { slug: "consultation", name: "Consultation", category: "Consultations", min: 30, price: 0, priceNote: "Complimentary", desc: "Meet Mónika, talk through your goals and leave with a plan. Credited toward a treatment booked the same day.", popular: true },
  { slug: "laser-consultation", name: "Laser consultation & patch test", category: "Consultations", min: 30, price: 0, priceNote: "Complimentary", desc: "Skin-type assessment and a test spot before any laser treatment.", serviceSlug: "lasers" },
  { slug: "wrinkle-relaxers", name: "Wrinkle relaxers · Botox® / Dysport®", category: "Injectables", min: 30, price: null, priceNote: "Per unit", desc: "Forehead, frown lines, crow's feet, lip flip, masseter and more.", serviceSlug: "wrinkle-relaxers", popular: true },
  { slug: "dermal-fillers", name: "Dermal fillers · Juvéderm® / Restylane®", category: "Injectables", min: 60, price: null, priceNote: "Per syringe", desc: "Lips, cheeks, chin, jawline, under-eyes and nasolabial folds.", serviceSlug: "dermal-fillers", popular: true },
  { slug: "sculptra", name: "Sculptra®", category: "Injectables", min: 60, price: null, priceNote: "Per vial", desc: "Collagen biostimulator for gradual, natural volume.", serviceSlug: "sculptra" },
  { slug: "pdo-threads", name: "PDO threads", category: "Injectables", min: 90, price: null, priceNote: "Per area", desc: "Lift and tighten with Mint™ and NovaThreads.", serviceSlug: "pdo-threads" },
  { slug: "microneedling", name: "Microneedling · SkinPen®", category: "Skin", min: 60, price: null, priceNote: "Per session", desc: "Texture, fine lines and scars. Series of three recommended.", serviceSlug: "microneedling" },
  { slug: "prp-exosomes", name: "PRP / PRF & exosomes", category: "Skin", min: 75, price: null, priceNote: "Per session", desc: "Your own growth factors, with microneedling or as injections.", serviceSlug: "prp-exosomes" },
  { slug: "chemical-peel", name: "Chemical peel · Cosmelan / VI Peel", category: "Skin", min: 45, price: null, priceNote: "Per peel", desc: "Pigment, texture and tone. Plan five to seven days of downtime for a VI Peel.", serviceSlug: "chemical-peels" },
  { slug: "cosmetic-rx", name: "Cosmetic Rx · Latisse® / Upneeq®", category: "Skin", min: 15, price: null, priceNote: "Product + visit", desc: "A short visit for prescription lash growth or eyelid lift.", serviceSlug: "cosmetic-rx" },
  { slug: "laser-hair-removal", name: "Laser hair removal", category: "Laser", min: 45, price: null, priceNote: "Per area", desc: "Candela GentleMax Pro Plus — 755 nm and 1064 nm, every skin type.", serviceSlug: "lasers", popular: true },
  { slug: "laser-skin", name: "Laser skin treatment", category: "Laser", min: 45, price: null, priceNote: "Per area", desc: "Sun spots, pigment, vessels and nail fungus on the same platform.", serviceSlug: "lasers" },
  { slug: "iv-therapy", name: "IV / IM therapy", category: "Wellness", min: 60, price: null, priceNote: "Per drip", desc: "Hydration, immunity, energy and recovery blends.", serviceSlug: "wellness-iv-therapy" },
  { slug: "weight-loss-consult", name: "Medical weight loss consult", category: "Wellness", min: 30, price: null, priceNote: "Consult", desc: "Compounded GLP-1 options after a metabolic review.", serviceSlug: "medical-weight-loss" },
];

export const getMenuItem = (slug: string) => MENU.find((m) => m.slug === slug);
export const priceLabel = (m: MenuItem) => (m.price === 0 ? (m.priceNote ?? "Free") : m.price != null ? `$${m.price}` : (m.priceNote ?? "At consult"));

/** Intake asked at booking — short, the full consent happens in the room. */
export const INTAKE = [
  { key: "goals", label: "What would you like to improve?", type: "text", placeholder: "Lines on my forehead, dullness, lip volume…" },
  { key: "history", label: "Previous aesthetic treatments (and when)", type: "text", placeholder: "Botox 6 months ago, none…" },
  { key: "medical", label: "Allergies, medications or medical conditions we should know about", type: "text", placeholder: "" },
  { key: "pregnant", label: "Are you pregnant, nursing or trying to conceive?", type: "choice", options: ["No", "Yes", "Not sure"] },
  { key: "referral", label: "How did you hear about us?", type: "choice", options: ["Instagram", "Google", "A friend", "Walked by", "Other"] },
] as const;
