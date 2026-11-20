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
