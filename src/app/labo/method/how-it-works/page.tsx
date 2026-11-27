import type { Metadata } from "next";
import { GATE_ROBOTS } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import HowView from "../_views/How";

const c = mc("en");

export const metadata: Metadata = {
  title: c.t.meta.how,
  description: c.t.meta.howDesc,
  alternates: alternates("en", "/how-it-works"),
  ...GATE_ROBOTS,
};

export default function Page() {
  return <HowView lang="en" />;
}
