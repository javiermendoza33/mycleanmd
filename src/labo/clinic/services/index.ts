import type { Service } from "../types";
import { service as wrinkleRelaxers } from "./wrinkle-relaxers";
import { service as dermalFillers } from "./dermal-fillers";
import { service as sculptra } from "./sculptra";
import { service as microneedling } from "./microneedling";
import { service as prpExosomes } from "./prp-exosomes";
import { service as pdoThreads } from "./pdo-threads";
import { service as chemicalPeels } from "./chemical-peels";
import { service as cosmeticRx } from "./cosmetic-rx";
import { service as wellness } from "./wellness";
import { service as medicalWeightLoss } from "./medical-weight-loss";
import { service as lasers } from "./lasers";

export const services: Service[] = [
  wrinkleRelaxers,
  dermalFillers,
  // Nov 21 2026 (Javier: "add this to top row in third place") — the .cards grid is 3 columns,
  // so Laser Treatments needs to be the 3rd entry to land in the top row.
  lasers,
  sculptra,
  microneedling,
  prpExosomes,
  pdoThreads,
  chemicalPeels,
  cosmeticRx,
  wellness,
  medicalWeightLoss,
];

export const availableServices = services.filter((s) => !s.comingSoon && !s.href);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
