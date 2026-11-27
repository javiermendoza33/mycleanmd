import type { Post } from "@/labo/clinic/types";
import { post as glp1Evidence } from "./glp-1-evidence";
import { post as peptideEvidence } from "./peptide-therapy-evidence";
import { post as testosteroneEvidence } from "./testosterone-evidence";
import { post as hormoneWomenEvidence } from "./hormone-therapy-women-evidence";
import { post as howTelehealthWorks } from "./how-telehealth-works";
import { post as compoundedMedications } from "./compounded-medications";

export const posts: Post[] = [
  glp1Evidence,
  peptideEvidence,
  testosteroneEvidence,
  hormoneWomenEvidence,
  howTelehealthWorks,
  compoundedMedications,
].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/* ── Two languages (Nov 27 2026) ─────────────────────────────────────────────────────────────────────────────────────────
   Spanish articles live in ./es.ts with their own Spanish slugs; `en` on each ties it to its English twin. */
import { postsEs, type EsPost } from "./es";
type L = "en" | "es";
const es: EsPost[] = [...postsEs].sort((a, b) => b.date.localeCompare(a.date));

export const postsFor = (lang: L): Post[] => (lang === "es" ? es : posts);
export const getPostFor = (lang: L, slug: string): Post | undefined => postsFor(lang).find((p) => p.slug === slug);
/** The same article's slug in the other language (given a slug in `lang`), if it has one. */
export function twinSlug(lang: L, slug: string): string | undefined {
  return lang === "es" ? es.find((p) => p.slug === slug)?.en : es.find((p) => p.en === slug)?.slug;
}
/** For a slug that belongs to the OTHER language (someone used the language switch on an article): this language's slug. */
export function fromOtherLang(lang: L, slug: string): string | undefined {
  return lang === "es" ? es.find((p) => p.en === slug)?.slug : es.find((p) => p.slug === slug)?.en;
}
/** Every slug the article route should answer in `lang`: its own, plus the other language's (those redirect). */
export const routeSlugs = (lang: L): string[] => [...postsFor(lang).map((p) => p.slug), ...postsFor(lang === "es" ? "en" : "es").map((p) => p.slug)];
/** The Spanish article for an English slug, or the English one itself — for cross-links that are written with English slugs. */
export const postByEnSlug = (lang: L, enSlug: string): Post | undefined => (lang === "es" ? es.find((p) => p.en === enSlug) : posts.find((p) => p.slug === enSlug));
