import Link from "next/link";
import { getStaff } from "@/lib/labo/clinic";
import { fmtDate, fmtTime, initials } from "@/lib/labo/provider";
import { searchAppts, dateOfPT, PILL, STATUS_LABEL, fullName } from "../_data";
import ApptActions from "@/components/labo/clinic/ApptActions";

export default async function ClinicAppointments({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await getStaff(); const sp = await searchParams; const q = (sp.q ?? "").trim().slice(0, 60); const status = ["booked", "confirmed", "completed", "canceled", "no_show"].includes(sp.status ?? "") ? sp.status! : "";
  const rows = await searchAppts(q, status);
  return (
    <>
      <div className="top"><div><h1>Appointments</h1><p>{rows.length} shown · newest first</p></div></div>
      <div className="card"><form className="row" style={{ gap: 10 }}><input className="in" name="q" defaultValue={q} placeholder="Search name, phone or email" style={{ maxWidth: 340 }} />
        <select className="in" name="status" defaultValue={status} style={{ maxWidth: 180 }}><option value="">Any status</option>{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select><button className="btn" type="submit">Search</button></form></div>
      <div className="card"><table><thead><tr><th>When</th><th>Customer</th><th>Service</th><th>Status</th><th></th></tr></thead><tbody>
        {rows.length === 0 && <tr><td colSpan={5} className="muted">Nothing matches.</td></tr>}
        {rows.map((a) => <tr key={a.id}><td style={{ whiteSpace: "nowrap" }}><Link href={`/clinic/calendar?d=${dateOfPT(a.starts_at)}&a=${a.id}`}>{fmtDate(a.starts_at, { month: "short", day: "numeric", year: "numeric" })} · {fmtTime(a.starts_at)}</Link></td>
          <td><span className="row" style={{ gap: 8, alignItems: "center" }}><span className="av s">{initials(fullName(a), a.email)}</span><span><b>{fullName(a)}</b><br /><span className="tiny">{a.phone} · {a.email}</span></span></span></td>
          <td>{a.service_name}<br /><span className="tiny">{a.duration_min} min · {a.source === "web" ? "online" : "by staff"}</span></td>
          <td><span className={`pill ${PILL[a.status] ?? ""}`}>{STATUS_LABEL[a.status] ?? a.status}</span></td><td><ApptActions id={a.id} status={a.status} compact /></td></tr>)}
      </tbody></table></div>
    </>
  );
}
