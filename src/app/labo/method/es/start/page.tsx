import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { METHOD_OPEN } from "@/labo/content";
import { mc } from "@/labo/method/i18n";
import StartSoonView from "../../_views/StartSoon";

/** /es/start — the coming-soon page in Spanish. The sign-up itself is English only, so once the Method opens this sends people there. */
export const metadata: Metadata = { title: mc("es").t.soon.metaTitle, robots: { index: false, follow: false } };

export default async function StartEs({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const sp = await searchParams;
  if (METHOD_OPEN) redirect(sp.program ? `/start?program=${encodeURIComponent(sp.program)}` : "/start");
  return <StartSoonView lang="es" program={sp.program} />;
}
