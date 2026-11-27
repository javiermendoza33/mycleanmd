import type { Metadata } from "next";
import { GATE_ROBOTS } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import FaqView from "../_views/FaqView";

const c = mc("en");

export const metadata: Metadata = {
  title: c.t.meta.faq,
  description: c.t.meta.faqDesc,
  alternates: alternates("en", "/faq"),
  ...GATE_ROBOTS,
};

export default function Page() {
  return <FaqView lang="en" />;
}
