import type { Metadata } from "next";
import { PROGRAMS, GATE_ROBOTS } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import JoinView from "../../../_views/Join";

const c = mc("es");

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const p = c.getProgram((await params).slug);
  if (!p) return { title: c.t.meta.notFound };
  return { title: c.t.meta.join(p.name), ...GATE_ROBOTS, alternates: alternates("es", `/join/${p.slug}`) };
}

export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  return <JoinView lang="es" slug={(await params).slug} />;
}
