import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProgram } from "@/labo/content";

export const dynamic = "force-dynamic";

type Enrollment = {
  id: string;
  program_slug: string;
  status: string;
  created_at: string;
};

function statusFor(e: Enrollment, hasIntake: boolean, hasVisit: boolean) {
  if (e.status !== "active") return { label: "Payment processing", cta: null as null | { href: string; label: string } };
  if (!hasIntake) return { label: "Intake needed", cta: { href: `/portal/intake/${e.id}`, label: "Start your intake" } };
  if (!hasVisit) return { label: "Awaiting your video visit", cta: null };
  return { label: "Active", cta: null };
}

export default async function PortalDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <p>You need to be signed in to view this page.</p>; // proxy.ts should have already redirected
  }

  const admin = createAdminClient();
  const { data: enrollments } = await admin
    .from("labo_enrollments")
    .select("id, program_slug, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (enrollments ?? []) as Enrollment[];
  const ids = rows.map((r) => r.id);

  const [{ data: intakes }, { data: visits }] = await Promise.all([
    ids.length
      ? admin.from("labo_intake_responses").select("enrollment_id").in("enrollment_id", ids)
      : Promise.resolve({ data: [] as { enrollment_id: string }[] }),
    ids.length
      ? admin.from("labo_visits").select("enrollment_id").in("enrollment_id", ids)
      : Promise.resolve({ data: [] as { enrollment_id: string }[] }),
  ]);
  const intakeIds = new Set((intakes ?? []).map((i) => i.enrollment_id));
  const visitIds = new Set((visits ?? []).map((v) => v.enrollment_id));

  return (
    <div>
      <h1>Your programs</h1>
      {rows.length === 0 && (
        <p className="sub" style={{ marginTop: 16 }}>
          No programs yet. <Link href="/programs">Browse programs →</Link>
        </p>
      )}
      <div className="tiles" style={{ marginTop: 24 }}>
        {rows.map((e) => {
          const program = getProgram(e.program_slug);
          const s = statusFor(e, intakeIds.has(e.id), visitIds.has(e.id));
          return (
            <article className="tile" key={e.id}>
              <h3>{program?.name ?? e.program_slug}</h3>
              <p>{s.label}</p>
              {s.cta && <Link className="btn btn-primary" href={s.cta.href}>{s.cta.label}</Link>}
            </article>
          );
        })}
      </div>
    </div>
  );
}
