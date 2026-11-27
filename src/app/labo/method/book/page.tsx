import type { Metadata } from "next";
import { METHOD } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import { BookView } from "../_views/Soon";

const c = mc("en");

export const metadata: Metadata = {
  title: c.t.meta.book,
  description: c.t.meta.bookDesc(METHOD.name),
  alternates: alternates("en", "/book"),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <BookView lang="en" />;
}
