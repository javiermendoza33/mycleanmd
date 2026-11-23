import Link from "next/link";
import { getStaff } from "@/lib/labo/clinic";
import { fmtDate, initials } from "@/lib/labo/provider";
import { getCustomer } from "@/lib/labo/crm";
import { getProgram } from "@/labo/content";

/** One person: who they are, which brands, every touch across the clinic book, the shop and the Method (no clinical detail — that stays in the EMR). */
export default async function Customer({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getStaff())) return null; const { id } = await params;
  const r = await getCustomer(id); if (!r) return <div className="card"><p className="muted">Customer not found.</p></div>;
  const { customer: c, events, care } = r; const name = `${c.first_name} ${c.last_name}`.trim() || c.email;
  return (
    <>
      <div className="top"><div><p className="tiny"><Link href="/clinic/customers">← Customers</Link></p><h1 className="row" style={{ gap: 12, alignItems: "center" }}><span className="av">{initials(name, c.email)}</span>{name}</h1></div></div>
      <div className="grid2">
        <div className="card"><h3>Profile</h3>
          <dl className="kv"><dt>Email</dt><dd>{c.email}</dd><dt>Phone</dt><dd>{c.phone || "—"}</dd><dt>State</dt><dd>{c.state || "—"}</dd><dt>Brands</dt><dd>{c.brands.map(b => <span key={b} className={`pill ${b === "method" ? "new" : "ok"}`} style={{ marginRight: 4 }}>{b === "method" ? "Method" : "Clinic"}</span>)}</dd><dt>Source</dt><dd>{c.source || "—"}</dd><dt>Consents</dt><dd>{c.sms_consent ? "SMS ✓ " : "SMS — "}{c.email_consent ? "· Email ✓" : "· Email —"}</dd><dt>Sign-in</dt><dd>{c.user_id ? "Has an account" : "No account"}</dd><dt>EMR</dt><dd>{c.cuvo_patient_id ? <code>{c.cuvo_patient_id}</code> : "—"}</dd><dt>Since</dt><dd>{fmtDate(c.created_at, { month: "short", day: "numeric", year: "numeric" })}</dd></dl>
        </div>
        <div className="card"><h3>Programs (Method)</h3>
          {care.length === 0 ? <p className="muted">None.</p> : <ul className="list">{care.map(k => <li key={k.id}><b>{getProgram(k.program_slug)?.name || k.program_slug}</b> <span className="pill">{k.status}</span><br /><span className="tiny">{fmtDate(k.created_at, { month: "short", day: "numeric", year: "numeric" })}{k.cuvo_case_id ? ` · case ${k.cuvo_case_id}` : ""}{k.cuvo_mode !== "live" ? ` · ${k.cuvo_mode}` : ""}</span></li>)}</ul>}
        </div>
      </div>
      <div className="card"><h3>Timeline</h3>
        {events.length === 0 ? <p className="muted">No activity recorded yet.</p> : <ul className="list">{events.map(e => <li key={e.id}><span className={`pill ${e.brand === "method" ? "new" : "ok"}`}>{e.brand === "method" ? "Method" : "Clinic"}</span> <b>{e.title}</b><br /><span className="tiny">{fmtDate(e.at, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })} · {e.kind}</span></li>)}</ul>}
      </div>
    </>
  );
}
