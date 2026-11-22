import Link from "next/link";
import { getStaff, listStaff } from "@/lib/labo/clinic";
import { fmtTime, initials } from "@/lib/labo/provider";
import { loadAppts, ptDayRange, todayPT, shiftDay, PILL, STATUS_LABEL, SETUP, fullName } from "./_data";
import ApptActions from "@/components/labo/clinic/ApptActions";
import NewAppointment from "@/components/labo/clinic/NewAppointment";
import { getMenu } from "@/lib/labo/booking";
import { createAdminClient } from "@/lib/supabase/admin";

/** Members (Nov 21 2026) = portal accounts with role patient; 0 when the profiles table or the service key is missing. */
async function countMembers(): Promise<number> {
  try { const { count } = await createAdminClient().from("profiles").select("id", { count: "exact", head: true }).eq("role", "patient"); return count ?? 0; } catch { return 0; }
}

export default async function ClinicToday() {
  const s = await getStaff(); if (!s) return null;   // the layout shows "Clinic team only"
  const today = todayPT(); const [start, end] = ptDayRange(today);
  const [{ rows, setup }, week, menu, team, members] = await Promise.all([loadAppts(start, end), loadAppts(start, ptDayRange(shiftDay(today, 7))[0]), getMenu(), listStaff(), countMembers()]);
  const unconfirmed = week.rows.filter((a) => a.status === "booked");
  const next = rows.find((a) => new Date(a.starts_at) > new Date() && !["completed", "no_show"].includes(a.status));
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", hourCycle: "h23" }).format(new Date()));
  const dateLine = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", weekday: "long", month: "long", day: "numeric" }).format(new Date());
  return (
    <>
      <div className="top"><div><h1>{hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"}, {s.staff.name.split(" ")[0]}</h1><p>{dateLine} · {rows.length} appointment{rows.length === 1 ? "" : "s"} today · <Link href="/clinic/members">{members} member{members === 1 ? "" : "s"}</Link></p></div><NewAppointment menu={menu.map((m) => ({ slug: m.slug, name: m.name, min: m.min }))} team={team.rows.filter((t) => t.active).map((t) => ({ id: t.id!, name: t.name }))} /></div>
      {setup && <div className="setup">{SETUP}</div>}
      <div className="kpis">
        <div className="card kpi"><div className="lbl">Today</div><div className="v">{rows.length}</div><div className="d">{next ? `next at ${fmtTime(next.starts_at)}` : rows.length ? "all done" : "nothing booked"}</div></div>
        <div className="card kpi"><div className="lbl">Next 7 days</div><div className="v">{week.rows.length}</div><div className="d">appointments</div></div>
        <div className="card kpi"><div className="lbl">To confirm</div><div className="v">{unconfirmed.length}</div><div className="d">{unconfirmed.length ? "booked online, not yet confirmed" : "all confirmed"}</div></div>
        <div className="card kpi"><div className="lbl">Online today</div><div className="v">{rows.filter((a) => a.source === "web").length}</div><div className="d">from the website</div></div>
      </div>
      <div className="card"><h3>Today <Link href={`/clinic/calendar?d=${today}`}>Open calendar ›</Link></h3>
        <div className="list">{rows.length === 0 && <div className="empty">No appointments today.</div>}
          {rows.map((a) => (
            <div className="li" key={a.id}><div className="t">{fmtTime(a.starts_at)}</div><div className="av s">{initials(fullName(a), a.email)}</div>
              <div className="w"><b><Link href={`/clinic/calendar?d=${today}&a=${a.id}`}>{fullName(a)}</Link></b><span>{a.service_name} · {a.duration_min} min · {a.phone}{a.intake?.goals ? ` · “${a.intake.goals.slice(0, 50)}”` : ""}</span></div>
              <span className={`pill ${PILL[a.status] ?? ""}`}>{STATUS_LABEL[a.status] ?? a.status}</span><ApptActions id={a.id} status={a.status} compact />
            </div>))}
        </div></div>
      {unconfirmed.length > 0 && <div className="card"><h3>To confirm this week</h3>
        <div className="list">{unconfirmed.map((a) => (
          <div className="li" key={a.id}><div className="t">{new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", weekday: "short", hour: "numeric", minute: "2-digit" }).format(new Date(a.starts_at))}</div>
            <div className="w"><b>{fullName(a)}</b><span>{a.service_name} · {a.phone} · {a.email}</span></div><ApptActions id={a.id} status={a.status} compact />
          </div>))}</div></div>}
    </>
  );
}
