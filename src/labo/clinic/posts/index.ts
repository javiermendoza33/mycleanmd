import type { Post } from "../types";
import { post as ivTherapyBenefits } from "./iv-therapy-benefits";
import { post as exosomesVsPrp } from "./exosomes-vs-prp";
import { post as medicalWeightLoss } from "./medical-weight-loss";
import { post as chemicalPeels } from "./chemical-peels";
import { post as ivTherapyStress } from "./iv-therapy-stress";
import { post as botoxVsDysport } from "./botox-vs-dysport";
import { post as pdoThreads } from "./pdo-threads";

export const posts: Post[] = [
  ivTherapyBenefits,
  exosomesVsPrp,
  medicalWeightLoss,
  chemicalPeels,
  ivTherapyStress,
  botoxVsDysport,
  pdoThreads,
].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
