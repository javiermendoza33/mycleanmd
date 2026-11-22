import { getStaff, listStaff } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";
import { fmtDate, initials } from "@/lib/labo/provider";

/**
 * /clinic/members (Nov 21 2026): everyone who joined through the site's "Become a member" flow — i.e. every portal
 * account with role `patient` (the signup page upserts that), minus the clinic team. Joined = profiles.created_at;
 * last sign-in / confirmed come from Supabase Auth via the admin client. Search by name or email.
 */
export const dynamic = "force-dynamic";

type Member = { id: string; name: string; email: string; joined: string | null; lastSignIn: string | null; confirmed: boolean };

export default async function ClinicMembers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  if (!(await getStaff())) return null;
  const sp = await searchParams; const q = (sp.q ?? "").trim().toLowerCase().slice(0, 60);
  const admin = createAdminClient();
  const [{ data: profiles, error }, { rows: team }, users] = await Promise.all([
    admin.from("profiles").select("id,email,full_name,created_at").eq("role", "patient").order("created_at", { ascending: false }).limit(2000),
    listStaff(),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }).then((r) => r.data?.users ?? []).catch(() => []),
  ]);
  const teamEmails = new Set([...team.map((t) => t.email.toLowerCase()), ...(process.env.LABO_PROVIDER_EMAIL ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)]);
  const auth = new Map(users.map((u) => [u.id, u]));
  const all: Member[] = (profiles ?? [])
    .filter((p) => p.email && !teamEmails.has(String(p.email).toLowerCase()))
    .map((p) => { const u = auth.get(p.id); return { id: p.id, name: p.full_name || (u?.user_metadata?.full_name as string) || "", email: String(p.email), joined: p.created_at ?? u?.created_at ?? null, lastSignIn: u?.last_sign_in_at ?? null, confirmed: !!u?.email_confirmed_at }; });
  const list = q ? all.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)) : all;
  const month = all.filter((m) => m.joined && Date.now() - new Date(m.joined).getTime() < 30 * 864e5).length;
  return (
    <>
      <div className="top"><div><h1>Members</h1><p>{all.length} member{all.length === 1 ? "" : "s"} · {month} joined in the last 30 days · from <a href="/membership" target="_blank" rel="noopener noreferrer">thelabomethod.com/membership ↗</a></p></div></div>
      {error && <div className="setup">Couldn&rsquo;t read the profiles table: {error.message}</div>}
      <div className="card"><form className="row" style={{ gap: 10 }}><input className="in" name="q" defaultValue={sp.q ?? ""} placeholder="Search name or email" style={{ maxWidth: 340 }} /><button className="btn" type="submit">Search</button></form></div>
      <div className="card"><table><thead><tr><th>Member</th><th>Email</th><th>Joined</th><th>Last sign-in</th><th>Status</th></tr></thead><tbody>
        {list.length === 0 && <tr><td colSpan={5} className="muted">{q ? "No members match." : "No members yet — the Join free button on the site creates them."}</td></tr>}
        {list.map((m) => (
          <tr key={m.id}>
            <td><span className="row" style={{ gap: 8, alignItems: "center" }}><span className="av s">{initials(m.name, m.email)}</span><b>{m.name || "—"}</b></span></td>
            <td className="mono">{m.email}</td>
            <td>{m.joined ? fmtDate(m.joined) : "—"}</td>
            <td>{m.lastSignIn ? fmtDate(m.lastSignIn) : <span className="muted">never</span>}</td>
            <td><span className={`pill ${m.confirmed ? "ok" : "warn"}`}>{m.confirmed ? "Active" : "Email not confirmed"}</span></td>
          </tr>))}
      </tbody></table></div>
    </>
  );
}
