import type { Metadata } from "next";
import { GATE_ROBOTS } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import ProgramsView from "../../_views/Programs";

const c = mc("es");

/** The Spanish version of /programs — same template, lang "es" (see src/labo/method/i18n.ts). */
export const metadata: Metadata = {
  title: c.t.meta.programs,
  description: c.t.meta.programsDesc(c.AVAILABILITY),
  alternates: alternates("es", "/programs"),
  ...GATE_ROBOTS,
};

export default function Page() {
  return <ProgramsView lang="es" />;
}
