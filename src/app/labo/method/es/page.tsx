import type { Metadata } from "next";
import { METHOD } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import HomeView from "../_views/Home";

/** thelabomethod.com/es — the home in Spanish (Nov 27 2026). Same template as the English home. */
const c = mc("es");
const TITLE = `${c.t.meta.homeTitle} | ${METHOD.name}`;
const DESCRIPTION = c.t.meta.homeDesc(c.tagline, c.AVAILABILITY);

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: alternates("es", "/"),
  openGraph: { type: "website", siteName: METHOD.name, locale: c.t.ogLocale, title: TITLE, description: DESCRIPTION },
};

export default function MethodHomeEs() {
  return <HomeView lang="es" />;
}
