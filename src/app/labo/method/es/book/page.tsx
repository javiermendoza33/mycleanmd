import type { Metadata } from "next";
import { METHOD } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import { BookView } from "../../_views/Soon";

const c = mc("es");

/** The Spanish version of /book — same template, lang "es" (see src/labo/method/i18n.ts). */
export const metadata: Metadata = {
  title: c.t.meta.book,
  description: c.t.meta.bookDesc(METHOD.name),
  alternates: alternates("es", "/book"),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <BookView lang="es" />;
}
