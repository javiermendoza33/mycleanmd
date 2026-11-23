import { createClient } from "@/lib/supabase/server";
import { careById } from "@/lib/labo/crm";
import { getProgram } from "@/labo/content";
import { CareTimeline } from "@/components/labo/method/CareTimeline";

export const dynamic = "force-dynamic";

/** The patient's care timeline for one program start: filed → in review → approved → prescription → shipped, plus messages. */
export default async function CarePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ paid?: string }> }) {
  const { id } = await params; const sp = await searchParams;
  const { data: { user } } = await (await createClient()).auth.getUser();
  const care = user ? await careById(id) : null;
  if (!care || care.user_id !== user!.id) return <p>We couldn't find that program start.</p>;
  const program = getProgram(care.program_slug);
  return <CareTimeline id={id} programName={program?.name || care.program_slug} justPaid={sp.paid === "1"} />;
}
