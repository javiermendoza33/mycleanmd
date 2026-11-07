import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProgram, PRACTICE } from "@/labo/content";
import { fmtDate, missingTable } from "@/lib/labo/provider";
import type { RequestRow } from "@/lib/labo/types";
import PatientRequestForm from "@/components/labo/PatientRequestForm";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { pending: "Waiting for review", approved: "Approved", denied: "Not approved", completed: "Completed" };
const card: React.CSSProperties = { background: "var(--canvas)", borderRadius: "var(--radius-card)", padding: "22px 24px", display: "flex", flexDirection: "column", gap: 8 };

export default async function PortalRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <p>You need to be signed in to view this page.</p>;

  const admin = createAdminClient();
  const [{ data: enrollments }, reqRes] = await Promise.all([
    admin.from("labo_enrollments").select("id, program_slug, status").eq("user_id", user.id),
    admin.from("labo_requests").select("id, enrollment_id, patient_user_id, kind, status, medication, dose, pharmacy, patient_note, result, provider_note, decided_at, created_at").eq("patient_user_id", user.id).order("created_at", { ascending: false }),
  ]);

  if (missingTable(reqRes.error)) return <><h1>Requests</h1><p className="sub" style={{ marginTop: 16 }}>This section isn&rsquo;t available yet.</p></>;

  const active = (enrollments ?? []).filter((e) => e.status === "active").map((e) => ({ id: e.id, name: getProgram(e.program_slug)?.name ?? e.program_slug }));
  const programOf = new Map((enrollments ?? []).map((e) => [e.id, getProgram(e.program_slug)?.name ?? e.program_slug]));
  const requests = (reqRes.data ?? []) as RequestRow[];

  return (
    <div>
      <h1>Requests</h1>
      <p className="sub" style={{ marginTop: 12 }}>Refills and labs. Your provider reviews these, usually within a business day.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 28 }}>
        {requests.length === 0 && <p style={{ color: "var(--muted)" }}>No requests yet.</p>}
        {requests.map((r) => (
          <article key={r.id} style={card}>
            <span className="kicker">{r.kind === "refill" ? "Refill" : "Labs"} · {programOf.get(r.enrollment_id)} · {STATUS[r.status] ?? r.status}</span>
            {r.kind === "refill" && <h3 style={{ margin: 0 }}>{[r.medication, r.dose].filter(Boolean).join(" · ") || "Refill request"}</h3>}
            {r.kind === "lab" && <h3 style={{ margin: 0 }}>Lab results</h3>}
            {r.pharmacy && <p style={{ margin: 0, color: "var(--graphite)", fontSize: ".92rem" }}>Pharmacy: {r.pharmacy}</p>}
            {r.patient_note && <p style={{ margin: 0, color: "var(--graphite)", fontSize: ".92rem" }}>You wrote: {r.patient_note}</p>}
            {r.provider_note && r.decided_at && (
              <p style={{ margin: "4px 0 0", padding: "12px 14px", background: "var(--paper)", borderRadius: 12, whiteSpace: "pre-wrap" }}>
                <strong>From your provider:</strong> {r.provider_note}
              </p>
            )}
            <p className="mono" style={{ margin: 0, color: "var(--muted)", fontSize: ".8rem" }}>
              Sent {fmtDate(r.created_at, { month: "short", day: "numeric", year: "numeric" })}{r.decided_at ? ` · reviewed ${fmtDate(r.decided_at, { month: "short", day: "numeric", year: "numeric" })}` : ""}
            </p>
          </article>
        ))}
      </div>

      {active.length > 0 ? (
        <div className="tiles" style={{ marginTop: 36 }}>
          <section style={card}>
            <span className="kicker">Request a refill</span>
            <PatientRequestForm kind="refill" enrollments={active} />
          </section>
          <section style={card}>
            <span className="kicker">Lab results or a question about labs</span>
            <p style={{ margin: 0, color: "var(--graphite)", fontSize: ".92rem" }}>
              Tell us what you had drawn, or ask a question. To send the actual results, email the PDF to{" "}
              <a href={`mailto:${PRACTICE.email}`}>{PRACTICE.email}</a>.
            </p>
            <PatientRequestForm kind="lab" enrollments={active} />
          </section>
        </div>
      ) : (
        <p style={{ marginTop: 36, color: "var(--muted)" }}>Requests open once a program is active.</p>
      )}
    </div>
  );
}
