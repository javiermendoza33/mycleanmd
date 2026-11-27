import type { Metadata } from "next";
import { GATE_ROBOTS } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import PricingView from "../_views/Pricing";

const c = mc("en");

export const metadata: Metadata = {
  title: c.t.meta.pricing,
  description: c.t.meta.pricingDesc,
  alternates: alternates("en", "/pricing"),
  ...GATE_ROBOTS,
};

export default function Page() {
  return <PricingView lang="en" />;
}
