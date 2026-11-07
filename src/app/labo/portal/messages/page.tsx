import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRACTICE } from "@/labo/content";
import { fmtDate, fmtTime, missingTable } from "@/lib/labo/provider";
import type { Message } from "@/lib/labo/types";
import PatientComposer from "@/components/labo/PatientComposer";

export const dynamic = "force-dynamic";

export default async function PortalMessages() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <p>You need to be signed in to view this page.</p>;

  const admin = createAdminClient();
  const res = await admin.from("labo_messages").select("id, patient_user_id, sender, body, read_at, created_at").eq("patient_user_id", user.id).order("created_at", { ascending: true });
  if (missingTable(res.error)) return <><h1>Messages</h1><p className="sub" style={{ marginTop: 16 }}>This section isn&rsquo;t available yet.</p></>;

  const messages = (res.data ?? []) as Message[];
  if (messages.some((m) => m.sender === "provider" && !m.read_at)) {
    await admin.from("labo_messages").update({ read_at: new Date().toISOString() }).eq("patient_user_id", user.id).eq("sender", "provider").is("read_at", null);
  }

  let lastDay = "";
  return (
    <div>
      <h1>Messages</h1>
      <p className="sub" style={{ marginTop: 12 }}>A private thread with {PRACTICE.provider.split(",")[0]}.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 28, background: "var(--canvas)", borderRadius: "var(--radius-card)", padding: "22px 24px", minHeight: 200 }}>
        {messages.length === 0 && <p style={{ margin: 0, color: "var(--muted)" }}>No messages yet. Write below and your provider will reply here.</p>}
        {messages.map((m) => {
          const day = fmtDate(m.created_at, { weekday: "short", month: "short", day: "numeric" });
          const showDay = day !== lastDay; lastDay = day;
          const mine = m.sender === "patient";
          return (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {showDay && <span className="mono" style={{ alignSelf: "center", color: "var(--muted)", fontSize: ".72rem" }}>{day}</span>}
              <div style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "78%", padding: "10px 14px", borderRadius: 18, background: mine ? "var(--accent)" : "var(--paper)", color: mine ? "var(--on-accent)" : "var(--ink)", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                {m.body}
                <div style={{ fontSize: ".7rem", opacity: .7, marginTop: 4 }}>{fmtTime(m.created_at)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <PatientComposer />
        <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: ".85rem" }}>Not for emergencies. Replies within 1 business day.</p>
      </div>
    </div>
  );
}
