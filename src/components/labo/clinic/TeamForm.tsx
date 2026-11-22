"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Row = { id: string; email: string; name: string; role: "admin" | "staff"; active: boolean; invitedAt: string | null };
export default function TeamForm({ rows, me }: { rows: Row[]; me: string }) {
  const router = useRouter(); const [f, setF] = useState({ name: "", email: "", role: "staff" }); const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [sent, setSent] = useState<string | null>(null);
  const call = async (method: "POST" | "PATCH" | "DELETE", body: Record<string, unknown>, path = "/api/labo/clinic/staff") => { setBusy(true); setErr(""); const r = await fetch(path, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json().catch(() => ({})); setBusy(false); if (!r.ok || !j.ok) { setErr(j.error || "Could not save"); return false; } router.refresh(); return true; };
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <>
      <div className="card"><h3>Add a team member</h3>
        <div className="row" style={{ gap: 10, marginTop: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div className="f" style={{ flex: 1, minWidth: 160 }}><label>Name</label><input className="in" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="f" style={{ flex: 1.4, minWidth: 220 }}><label>Sign-in email</label><input className="in" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div className="f"><label>Role</label><select className="in" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}><option value="staff">Staff</option><option value="admin">Admin</option></select></div>
          <button className="btn" disabled={busy} onClick={async () => { if (await call("POST", f)) setF({ name: "", email: "", role: "staff" }); }}>Add</button>
        </div>{err && <div className="sm" style={{ color: "var(--red)", marginTop: 8 }}>{err}</div>}
      </div>
      <div className="card"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>
        {rows.length === 0 && <tr><td colSpan={5} className="muted">No one yet — the provider allowlist is admin until you add people.</td></tr>}
        {rows.map((r) => <tr key={r.id}><td><b>{r.name}</b>{r.email === me ? <span className="tiny"> · you</span> : null}{r.invitedAt && <div className="tiny muted">Invited {fmt(r.invitedAt)}</div>}</td><td className="sm">{r.email}</td>
          <td><select className="in" style={{ width: 110, minHeight: 34, padding: "4px 8px" }} value={r.role} disabled={busy} onChange={(e) => call("PATCH", { id: r.id, role: e.target.value })}><option value="staff">Staff</option><option value="admin">Admin</option></select></td>
          <td><span className={`pill ${r.active ? "ok" : ""}`}>{r.active ? "Active" : "Off"}</span></td>
          <td><div className="row" style={{ gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
            {r.email !== me && r.active && <button className="btn sm" disabled={busy} onClick={async () => { if (await call("POST", { id: r.id }, "/api/labo/clinic/staff/invite")) { setSent(r.id); setTimeout(() => setSent(null), 4000); } }}>{sent === r.id ? "Sent ✓" : r.invitedAt ? "Resend invite" : "Send invite"}</button>}
            <button className="btn l sm" disabled={busy || r.email === me} onClick={() => call("PATCH", { id: r.id, active: !r.active })}>{r.active ? "Deactivate" : "Reactivate"}</button>
            {r.email !== me && <button className="btn l sm" disabled={busy} onClick={() => { if (confirm(`Remove ${r.name} (${r.email}) from the team? Their sign-in account stays; they just lose portal access.`)) call("DELETE", { id: r.id }); }}>Remove</button>}
          </div></td></tr>)}
      </tbody></table></div>
    </>
  );
}
