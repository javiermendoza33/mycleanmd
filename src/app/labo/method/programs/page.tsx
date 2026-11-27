import type { Metadata } from "next";
import { GATE_ROBOTS } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import ProgramsView from "../_views/Programs";

const c = mc("en");

export const metadata: Metadata = {
  title: c.t.meta.programs,
  description: c.t.meta.programsDesc(c.AVAILABILITY),
  alternates: alternates("en", "/programs"),
  ...GATE_ROBOTS,
};

export default function Page() {
  return <ProgramsView lang="en" />;
}
