import type { Metadata } from "next";
import { METHOD } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import { SignInView } from "../_views/Soon";

const c = mc("en");

export const metadata: Metadata = {
  title: c.t.meta.signin,
  description: c.t.meta.signinDesc(METHOD.name),
  alternates: alternates("en", "/signin"),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <SignInView lang="en" />;
}
