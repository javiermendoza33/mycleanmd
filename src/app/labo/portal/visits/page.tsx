import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProgram } from "@/labo/content";
import { fmtDate, fmtTime, missingTable } from "@/lib/labo/provider";
import type { Note, Visit } from "@/lib/labo/types";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = { scheduled: "Scheduled", completed: "Completed", canceled: "Canceled", no_show: "Missed" };
const TYPE: Record<string, string> = { initial: "Initial consultation", follow_up: "Follow-up", lab_review: "Lab review" };
const FIELD: Record<string, string> = { weight: "Weight", bmi: "BMI", change: "Change since start", current_med: "Current medication", next_med: "Next medication", next_dose: "Next dose", side_effects: "Side effects", refills: "Refills" };
const card: React.CSSProperties = { background: "var(--canvas)", borderRadius: "var(--radius-card)", padding: "22px 24px", display: "flex", flexDirection: "column", gap: 8 };

export default async function PortalVisits() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <p>You need to be signed in to view this page.</p>;

  const admin = createAdminClient();
  const { data: enrollments } = await admin.from("labo_enrollments").select("id, program_slug").eq("user_id", user.id);
  const ids = (enrollments ?? []).map((e) => e.id);
  const programOf = new Map((enrollments ?? []).map((e) => [e.id, getProgram(e.program_slug)?.name ?? e.program_slug]));

  const [visitsRes, notesRes] = await Promise.all([
    ids.length ? admin.from("labo_visits").select("id, enrollment_id, scheduled_at, zoom_link, status, visit_type, duration_min, reason").in("enrollment_id", ids).order("scheduled_at", { ascending: false }) : Promise.resolve({ data: [] as Visit[], error: null }),
    ids.length ? admin.from("labo_notes").select("id, enrollment_id, visit_id, fields, plan, status, signed_at").in("enrollment_id", ids).eq("status", "signed").order("signed_at", { ascending: false }) : Promise.resolve({ data: [] as Note[], error: null }),
  ]);

  if (missingTable(visitsRes.error)) return <><h1>Visits</h1><p className="sub" style={{ marginTop: 16 }}>This section isn&rsquo;t available yet.</p></>;

  const nowIso = new Date().toISOString();
  const visits = (visitsRes.data ?? []) as Visit[];
  const upcoming = visits.filter((v) => v.status === "scheduled" && v.scheduled_at && v.scheduled_at > nowIso).sort((a, b) => (a.scheduled_at! < b.scheduled_at! ? -1 : 1));
  const past = visits.filter((v) => !upcoming.includes(v));
  const notes = missingTable(notesRes.error) ? [] : ((notesRes.data ?? []) as Note[]);

  const VisitCard = ({ v }: { v: Visit }) => (
    <article style={card}>
      <span className="kicker">{programOf.get(v.enrollment_id)} · {STATUS[v.status] ?? v.status}</span>
      <h3 style={{ margin: 0 }}>{fmtDate(v.scheduled_at, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · {fmtTime(v.scheduled_at)} PT</h3>
      <p style={{ margin: 0, color: "var(--graphite)" }}>{TYPE[v.visit_type] ?? v.visit_type} · {v.duration_min} min · video{v.reason ? ` · ${v.reason}` : ""}</p>
      {v.status === "scheduled" && (v.zoom_link
        ? <a className="btn btn-primary" href={v.zoom_link} target="_blank" rel="noopener" style={{ alignSelf: "flex-start" }}>Join Zoom</a>
        : <p style={{ margin: 0, color: "var(--muted)", fontSize: ".9rem" }}>Zoom link will appear here before your visit.</p>)}
    </article>
  );

  return (
    <div>
      <h1>Visits</h1>

      <h2 style={{ marginTop: 32, fontSize: "1.2rem" }}>Upcoming</h2>
      {upcoming.length === 0 && <p style={{ color: "var(--muted)" }}>Nothing scheduled yet.</p>}
      <div className="tiles" style={{ marginTop: 12 }}>{upcoming.map((v) => <VisitCard key={v.id} v={v} />)}</div>

      <h2 style={{ marginTop: 36, fontSize: "1.2rem" }}>Visit notes</h2>
      {notes.length === 0 && <p style={{ color: "var(--muted)" }}>Your signed visit notes will appear here.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
        {notes.map((n) => {
          const entries = Object.entries(n.fields ?? {}).filter(([, v]) => v);
          return (
            <article key={n.id} style={card}>
              <span className="kicker">{programOf.get(n.enrollment_id)} · signed {fmtDate(n.signed_at, { month: "short", day: "numeric", year: "numeric" })}</span>
              {entries.length > 0 && (
                <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px 18px", margin: "6px 0 0" }}>
                  {entries.map(([k, v]) => (
                    <div key={k}><dt className="kicker" style={{ fontSize: ".6rem" }}>{FIELD[k] ?? k.replace(/_/g, " ")}</dt><dd style={{ margin: "3px 0 0" }}>{v}</dd></div>
                  ))}
                </dl>
              )}
              {n.plan && <p style={{ margin: "8px 0 0", color: "var(--graphite)", whiteSpace: "pre-wrap" }}>{n.plan}</p>}
            </article>
          );
        })}
      </div>

      <h2 style={{ marginTop: 36, fontSize: "1.2rem" }}>Past</h2>
      {past.length === 0 && <p style={{ color: "var(--muted)" }}>No past visits.</p>}
      <div className="tiles" style={{ marginTop: 12 }}>{past.map((v) => <VisitCard key={v.id} v={v} />)}</div>
    </div>
  );
}
