import type { Metadata } from "next";
import { PROGRAMS, AVAILABILITY } from "@/labo/content";
import { cuvo, cuvoMode } from "@/lib/cuvo";
import { createClient } from "@/lib/supabase/server";
import { StartFlow, type FlowProgram } from "@/components/labo/method/StartFlow";

export const metadata: Metadata = { title: "Get started — The Labo Method", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** Which published intake (Cuvo question set) each program files against. Placeholders until we read the real set ids. */
// Real sandbox set ids read on Nov 24 2026 (GET /v1/question_sets): weight-loss, peptides (NAD+ is the only peptide set in the sandbox),
// mens-hormones (testosterone is controlled → the case needs a live visit), womens-hormones. Re-check against the live catalog before launch.
export const QUESTION_SET: Record<string, string> = { "glp-1-weight-management": "semaglutide-glp-1-weight-loss", "peptide-therapy": "nad", "testosterone-for-men": "testosterone-injectable", "hormone-therapy-for-women": "estrogen-cream-systemic-topical" };

export default async function Start({ searchParams }: { searchParams: Promise<{ program?: string }> }) {
  const sp = await searchParams;
  const c = cuvo();
  const [states, sets, { data: { user } }] = await Promise.all([c.states().catch(() => []), c.questionSets().catch(() => []), (await createClient()).auth.getUser()]);
  const programs: FlowProgram[] = PROGRAMS.map(p => ({ slug: p.slug, name: p.name, blurb: p.navBlurb, price: p.price, questionSet: QUESTION_SET[p.slug] || sets[0]?.id || "" }));
  const sets2 = await Promise.all([...new Set(programs.map(p => p.questionSet).filter(Boolean))].map(id => c.questionSet(id).catch(() => null)));
  return (
    <section className="sflow-wrap">
      <div className="wrap">
        <StartFlow programs={programs} initial={sp.program || ""} states={states.length ? states : [{ code: "CA", name: "California" }, { code: "WA", name: "Washington" }]} availability={AVAILABILITY}
          sets={Object.fromEntries(sets2.filter(Boolean).map(s => [s!.id, s!]))} signedIn={user ? { email: user.email || "" } : null} mode={cuvoMode()} />
      </div>
    </section>
  );
}
