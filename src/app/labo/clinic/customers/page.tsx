import Link from "next/link";
import { getStaff } from "@/lib/labo/clinic";
import { fmtDate, initials } from "@/lib/labo/provider";
import { searchAppts, fullName } from "../_data";

/** Customers are derived from bookings (grouped by email) until there is a proper customer record. */
export default async function ClinicCustomers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await getStaff(); const sp = await searchParams; const q = (sp.q ?? "").trim().slice(0, 60);
  const rows = await searchAppts(q, ""); const now = Date.now();
  const byEmail = new Map<string, { name: string; email: string; phone: string; visits: number; last: string | null; next: string | null; noShows: number }>();
  for (const a of rows) {
    const c = byEmail.get(a.email) ?? { name: fullName(a), email: a.email, phone: a.phone, visits: 0, last: null, next: null, noShows: 0 };
    if (a.status === "completed") { c.visits++; if (!c.last || a.starts_at > c.last) c.last = a.starts_at; }
    if (a.status === "no_show") c.noShows++;
    if (new Date(a.starts_at).getTime() > now && !["canceled", "no_show"].includes(a.status) && (!c.next || a.starts_at < c.next)) c.next = a.starts_at;
    byEmail.set(a.email, c);
  }
  const list = [...byEmail.values()].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <div className="top"><div><h1>Customers</h1><p>{list.length} people · from the appointment book</p></div></div>
      <div className="card"><form className="row" style={{ gap: 10 }}><input className="in" name="q" defaultValue={q} placeholder="Search name, phone or email" style={{ maxWidth: 340 }} /><button className="btn" type="submit">Search</button></form></div>
      <div className="card"><table><thead><tr><th>Customer</th><th>Contact</th><th>Visits</th><th>Last visit</th><th>Next</th></tr></thead><tbody>
        {list.length === 0 && <tr><td colSpan={5} className="muted">No customers yet.</td></tr>}
        {list.map((c) => <tr key={c.email}><td><span className="row" style={{ gap: 8, alignItems: "center" }}><span className="av s">{initials(c.name, c.email)}</span><b>{c.name}</b></span></td><td className="sm">{c.phone}<br /><span className="tiny">{c.email}</span></td><td>{c.visits}{c.noShows ? <span className="tiny" style={{ color: "var(--red)" }}> · {c.noShows} no-show</span> : null}</td><td className="sm">{c.last ? fmtDate(c.last, { month: "short", day: "numeric", year: "numeric" }) : "—"}</td><td className="sm">{c.next ? <Link href={`/clinic/appointments?q=${encodeURIComponent(c.email)}`}>{fmtDate(c.next, { month: "short", day: "numeric" })}</Link> : "—"}</td></tr>)}
      </tbody></table></div>
    </>
  );
}
