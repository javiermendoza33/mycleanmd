import Link from "next/link";
import { getStaff } from "@/lib/labo/clinic";
import { fmtDate, initials } from "@/lib/labo/provider";
import { listCustomers, type Brand } from "@/lib/labo/crm";

/** The Labo CRM (Nov 23 2026): one list of people across The Labo Clinic and The Labo Method. Tables in supabase-labo-crm.sql. */
export default async function ClinicCustomers({ searchParams }: { searchParams: Promise<{ q?: string; brand?: string }> }) {
  if (!(await getStaff())) return null; const sp = await searchParams; const q = (sp.q ?? "").trim().slice(0, 60); const brand = (["clinic", "method"].includes(sp.brand || "") ? sp.brand : undefined) as Brand | undefined;
  const { rows, setup } = await listCustomers(q, brand);
  const chip = (b: string) => <span key={b} className={`pill ${b === "method" ? "new" : "ok"}`} style={{ marginRight: 4 }}>{b === "method" ? "Method" : "Clinic"}</span>;
  return (
    <>
      <div className="top"><div><h1>Customers</h1><p>{rows.length} people · The Labo Clinic + The Labo Method, one record each</p></div></div>
      {setup ? <div className="card"><h3>CRM not set up yet</h3><p className="muted" style={{ marginTop: 8 }}>Run <code>supabase-labo-crm.sql</code> in the Supabase SQL editor. Existing bookings are imported automatically.</p></div> : null}
      <div className="card"><form className="row" style={{ gap: 10, flexWrap: "wrap" }}><input className="in" name="q" defaultValue={q} placeholder="Search name, phone or email" style={{ maxWidth: 340 }} /><select className="in" name="brand" defaultValue={brand || ""} style={{ maxWidth: 160 }}><option value="">Both brands</option><option value="clinic">Clinic</option><option value="method">Method</option></select><button className="btn" type="submit">Search</button></form></div>
      <div className="card"><table><thead><tr><th>Customer</th><th>Contact</th><th>Brands</th><th>Activity</th><th>Last</th></tr></thead><tbody>
        {rows.length === 0 && !setup && <tr><td colSpan={5} className="muted">No customers yet.</td></tr>}
        {rows.map((c) => { const name = `${c.first_name} ${c.last_name}`.trim() || c.email; return (
          <tr key={c.id}><td><Link href={`/clinic/customers/${c.id}`} className="row" style={{ gap: 8, alignItems: "center" }}><span className="av s">{initials(name, c.email)}</span><b>{name}</b></Link></td><td className="sm">{c.phone || "—"}<br /><span className="tiny">{c.email}</span></td><td>{c.brands.map(chip)}</td><td className="sm">{c.events} event{c.events === 1 ? "" : "s"}{c.state ? <span className="tiny"> · {c.state}</span> : null}</td><td className="sm">{c.last_at ? fmtDate(c.last_at, { month: "short", day: "numeric", year: "numeric" }) : fmtDate(c.created_at, { month: "short", day: "numeric", year: "numeric" })}</td></tr>); })}
      </tbody></table></div>
    </>
  );
}
