import type { Metadata } from "next";
import { METHOD } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import { SignInView } from "../../_views/Soon";

const c = mc("es");

/** The Spanish version of /signin — same template, lang "es" (see src/labo/method/i18n.ts). */
export const metadata: Metadata = {
  title: c.t.meta.signin,
  description: c.t.meta.signinDesc(METHOD.name),
  alternates: alternates("es", "/signin"),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <SignInView lang="es" />;
}
