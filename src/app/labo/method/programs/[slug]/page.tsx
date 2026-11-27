import type { Metadata } from "next";
import { PROGRAMS, GATE_ROBOTS } from "@/labo/content";
import { mc, alternates } from "@/labo/method/i18n";
import ProgramView from "../../_views/Program";

const c = mc("en");

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const p = c.getProgram((await params).slug);
  if (!p) return { title: c.t.meta.notFound };
  return {
    title: p.name,
    description: p.lede,
    alternates: alternates("en", `/programs/${p.slug}`),
    ...GATE_ROBOTS,
    openGraph: { title: p.name, description: p.lede },
  };
}

export default async function Page(
  { params }: { params: Promise<{ slug: string }> }
) {
  return <ProgramView lang="en" slug={(await params).slug} />;
}
