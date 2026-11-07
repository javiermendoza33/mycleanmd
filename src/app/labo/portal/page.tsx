import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProgram } from "@/labo/content";
import { fmtDate, fmtTime, missingTable } from "@/lib/labo/provider";
import type { Enrollment, Note, Visit } from "@/lib/labo/types";

export const dynamic = "force-dynamic";

type Row = Pick<Enrollment, "id" | "program_slug" | "status" | "created_at">;

function statusFor(e: Row, hasIntake: boolean, hasVisit: boolean) {
  if (e.status !== "active") return { label: "Payment processing", cta: null as null | { href: string; label: string } };
  if (!hasIntake) return { label: "Intake needed", cta: { href: `/portal/intake/${e.id}`, label: "Start your intake" } };
  if (!hasVisit) return { label: "Awaiting your video visit", cta: null };
  return { label: "Active", cta: null };
}

const card: React.CSSProperties = { background: "var(--canvas)", borderRadius: "var(--radius-card)", padding: "26px 28px", display: "flex", flexDirection: "column", gap: 10 };

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

  const rows = (enrollments ?? []) as Row[];
  const ids = rows.map((r) => r.id);
  const nowIso = new Date().toISOString();

  const [{ data: intakes }, visitsRes, notesRes, rxRes, reqRes, msgRes] = await Promise.all([
    ids.length
      ? admin.from("labo_intake_responses").select("enrollment_id").in("enrollment_id", ids)
      : Promise.resolve({ data: [] as { enrollment_id: string }[] }),
    ids.length
      ? admin.from("labo_visits").select("id, enrollment_id, scheduled_at, zoom_link, status, visit_type, duration_min, reason").in("enrollment_id", ids).order("scheduled_at", { ascending: true })
      : Promise.resolve({ data: [] as Visit[], error: null }),
    ids.length
      ? admin.from("labo_notes").select("id, enrollment_id, fields, plan, status, signed_at").in("enrollment_id", ids).eq("status", "signed").order("signed_at", { ascending: false }).limit(1)
      : Promise.resolve({ data: [] as Note[], error: null }),
    ids.length
      ? admin.from("labo_prescriptions").select("id, medication, dose, written_at, status").in("enrollment_id", ids).eq("status", "approved").order("written_at", { ascending: false }).limit(5)
      : Promise.resolve({ data: [] as { id: string; medication: string; dose: string | null; written_at: string; status: string }[], error: null }),
    admin.from("labo_requests").select("id", { count: "exact", head: true }).eq("patient_user_id", user.id).eq("status", "pending"),
    admin.from("labo_messages").select("id", { count: "exact", head: true }).eq("patient_user_id", user.id).eq("sender", "provider").is("read_at", null),
  ]);

  const intakeIds = new Set((intakes ?? []).map((i) => i.enrollment_id));
  const visits = (visitsRes.data ?? []) as Visit[];
  const visitIds = new Set(visits.map((v) => v.enrollment_id));
  const nextVisit = visits.find((v) => v.status === "scheduled" && v.scheduled_at && v.scheduled_at > nowIso) ?? null;
  const plan = !missingTable(notesRes.error) ? ((notesRes.data ?? [])[0] as Note | undefined) ?? null : null;
  const meds = !missingTable(rxRes.error) ? rxRes.data ?? [] : [];
  const pendingRequests = missingTable(reqRes.error) ? null : reqRes.count ?? 0;
  const unread = missingTable(msgRes.error) ? null : msgRes.count ?? 0;
  const typeLabel = (t: string) => ({ initial: "Initial consultation", follow_up: "Follow-up", lab_review: "Lab review" } as Record<string, string>)[t] ?? t.replace(/_/g, " ");

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

      {rows.length > 0 && (
        <div className="tiles" style={{ marginTop: 28 }}>
          {!missingTable(visitsRes.error) && (
            <section style={card}>
              <span className="kicker">Next visit</span>
              {nextVisit ? (
                <>
                  <h3 style={{ margin: 0 }}>{fmtDate(nextVisit.scheduled_at, { weekday: "long", month: "long", day: "numeric" })} · {fmtTime(nextVisit.scheduled_at)} PT</h3>
                  <p style={{ margin: 0, color: "var(--graphite)" }}>{typeLabel(nextVisit.visit_type)} · {nextVisit.duration_min} min · video</p>
                  {nextVisit.zoom_link
                    ? <a className="btn btn-primary" href={nextVisit.zoom_link} target="_blank" rel="noopener" style={{ alignSelf: "flex-start" }}>Join Zoom</a>
                    : <p style={{ margin: 0, color: "var(--muted)", fontSize: ".9rem" }}>Zoom link will appear here before your visit.</p>}
                </>
              ) : (
                <p style={{ margin: 0, color: "var(--muted)" }}>Nothing scheduled yet. Once your intake is reviewed, your visit will appear here.</p>
              )}
              <Link href="/portal/visits" style={{ fontSize: ".9rem" }}>All visits →</Link>
            </section>
          )}

          {!missingTable(notesRes.error) && (
            <section style={card}>
              <span className="kicker">Your plan</span>
              {plan ? (
                <>
                  {(plan.fields?.next_med || plan.fields?.next_dose) && (
                    <p style={{ margin: 0 }}><strong>{[plan.fields.next_med, plan.fields.next_dose].filter(Boolean).join(" · ")}</strong></p>
                  )}
                  <p style={{ margin: 0, color: "var(--graphite)", whiteSpace: "pre-wrap" }}>{plan.plan || "See your visit notes."}</p>
                  <p className="mono" style={{ margin: 0, color: "var(--muted)", fontSize: ".8rem" }}>Signed {fmtDate(plan.signed_at, { month: "short", day: "numeric", year: "numeric" })}</p>
                </>
              ) : (
                <p style={{ margin: 0, color: "var(--muted)" }}>Your plan appears here after your first visit.</p>
              )}
            </section>
          )}

          {!missingTable(rxRes.error) && (
            <section style={card}>
              <span className="kicker">Medications</span>
              {meds.length ? (
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--graphite)" }}>
                  {meds.map((m) => (
                    <li key={m.id}><strong>{m.medication}</strong>{m.dose ? ` · ${m.dose}` : ""} <span className="mono" style={{ color: "var(--muted)", fontSize: ".8rem" }}>{fmtDate(m.written_at)}</span></li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, color: "var(--muted)" }}>No medications on file yet.</p>
              )}
            </section>
          )}

          {pendingRequests !== null && (
            <section style={card}>
              <span className="kicker">Requests</span>
              <p style={{ margin: 0 }}>{pendingRequests === 0 ? "No pending requests." : `${pendingRequests} pending request${pendingRequests === 1 ? "" : "s"}.`}</p>
              <Link href="/portal/requests" style={{ fontSize: ".9rem" }}>Refills and labs →</Link>
            </section>
          )}

          {unread !== null && (
            <section style={card}>
              <span className="kicker">Messages</span>
              <p style={{ margin: 0 }}>{unread === 0 ? "No unread messages." : `${unread} unread message${unread === 1 ? "" : "s"} from your provider.`}</p>
              <Link href="/portal/messages" style={{ fontSize: ".9rem" }}>Open messages →</Link>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
