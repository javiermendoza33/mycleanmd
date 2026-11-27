import type { Metadata } from "next";
import { JOURNAL_ROBOTS } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import BlogView from "../../_views/Blog";

const c = mc("es");

/** thelabomethod.com/es/blog — the Journal in Spanish. */
export const metadata: Metadata = {
  title: c.t.blog.metaTitle,
  description: c.t.blog.metaDesc,
  alternates: alternates("es", "/blog"),
  ...JOURNAL_ROBOTS,
};

export default function Page() {
  return <BlogView lang="es" />;
}
