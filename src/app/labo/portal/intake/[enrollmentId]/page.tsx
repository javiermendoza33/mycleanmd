import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProgram } from "@/labo/content";
import { INTAKE_STEPS } from "@/labo/intakeSteps";
import LaboIntakeFlow from "@/components/labo/LaboIntakeFlow";

export const dynamic = "force-dynamic";

export default async function PortalIntakePage(
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  const { enrollmentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();
  const { data: enrollment } = await admin
    .from("labo_enrollments")
    .select("id, user_id, program_slug, status")
    .eq("id", enrollmentId)
    .single();

  if (!enrollment || enrollment.user_id !== user.id) notFound();
  if (enrollment.status !== "active") redirect("/portal");

  const program = getProgram(enrollment.program_slug);
  const steps = INTAKE_STEPS[enrollment.program_slug];
  if (!program || !steps) notFound();

  const { data: existing } = await admin
    .from("labo_intake_responses")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .maybeSingle();
  if (existing) redirect("/portal");

  return (
    <LaboIntakeFlow
      enrollmentId={enrollment.id}
      careType={enrollment.program_slug}
      steps={steps}
    />
  );
}
