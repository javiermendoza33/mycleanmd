import { requireStaff, listStaff } from "@/lib/labo/clinic";
import TeamForm from "@/components/labo/clinic/TeamForm";

export default async function ClinicTeam() {
  const s = await requireStaff("admin");
  if (!s) return <div className="card"><h3>Admin only</h3><p className="muted" style={{ marginTop: 8 }}>Only an admin can manage the team.</p></div>;
  const team = await listStaff();
  return (
    <>
      <div className="top"><div><h1>Team</h1><p>Who can sign in to the clinic portal, and what they can do</p></div></div>
      {team.setup && <div className="setup">Run supabase-labo-clinic.sql in the Supabase SQL editor first.</div>}
      <TeamForm rows={team.rows.map((t) => ({ id: t.id!, email: t.email, name: t.name, role: t.role, active: t.active, invitedAt: t.invited_at ?? null }))} me={s.user.email} />
      <div className="card"><h3>How someone joins</h3><ol className="sm" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.7 }}><li>Add them here with the email they will sign in with, then press <b>Send invite</b> — they get an email with the steps below.</li><li>They create an account at <b>/auth/signup</b> with that same email (or sign in if they already have one). <b>Remove</b> deletes a row added by mistake; <b>Deactivate</b> keeps it but closes access.</li><li>They open <b>/clinic</b>. Staff see Today, Calendar, Appointments, Customers and Hours &amp; time off. Admins also see Services &amp; prices and Team.</li></ol></div>
    </>
  );
}
