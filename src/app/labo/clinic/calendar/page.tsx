import Link from "next/link";
import { getStaff, listStaff, loadBlocks } from "@/lib/labo/clinic";
import { fmtDate, fmtTime, initials } from "@/lib/labo/provider";
import { loadAppts, ptDayRange, ptToUtc, shiftDay, todayPT, dateOfPT, PILL, STATUS_LABEL, SETUP, fullName } from "../_data";
import ApptActions from "@/components/labo/clinic/ApptActions";
import NewAppointment from "@/components/labo/clinic/NewAppointment";
import { getMenu } from "@/lib/labo/booking";

export default async function ClinicCalendar({ searchParams }: { searchParams: Promise<{ d?: string; a?: string; new?: string }> }) {
  await getStaff(); const sp = await searchParams; const day = /^\d{4}-\d{2}-\d{2}$/.test(sp.d ?? "") ? sp.d! : todayPT();
  const [y, m] = day.split("-").map(Number); const monthStart = `${day.slice(0, 7)}-01`; const nextMonth = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
  const [dStart, dEnd] = ptDayRange(day);
  const [{ rows: monthRows, setup }, { rows: dayRows }, blocks, menu, team] = await Promise.all([loadAppts(ptToUtc(monthStart).toISOString(), ptToUtc(nextMonth).toISOString()), loadAppts(dStart, dEnd, { includeCanceled: true }), loadBlocks(dStart, dEnd), getMenu(), listStaff()]);
  const dot = new Set(monthRows.map((a) => dateOfPT(a.starts_at)));
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(); const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = [...Array(first)].map((_, i) => ({ date: `x${i}`, label: "", x: true })).concat([...Array(days)].map((_, i) => ({ date: `${day.slice(0, 7)}-${String(i + 1).padStart(2, "0")}`, label: String(i + 1), x: false })));
  const selected = dayRows.find((a) => a.id === sp.a) ?? null; const byStaff = new Map(team.rows.map((t) => [t.id, t.name]));
  const weekStart = shiftDay(day, -new Date(day + "T12:00:00Z").getUTCDay()); const week = monthRows.filter((a) => { const d = dateOfPT(a.starts_at); return d >= weekStart && d < shiftDay(weekStart, 7); });
  return (
    <>
      <div className="top"><div><h1>Calendar</h1><p>{fmtDate(ptToUtc(day, "12:00").toISOString(), { weekday: "long", month: "long", day: "numeric" })} · {dayRows.filter((a) => a.status !== "canceled").length} appointment{dayRows.length === 1 ? "" : "s"} · Pacific time</p></div>
        <NewAppointment menu={menu.map((x) => ({ slug: x.slug, name: x.name, min: x.min }))} team={team.rows.filter((t) => t.active).map((t) => ({ id: t.id!, name: t.name }))} day={day} open={!!sp.new} /></div>
      {setup && <div className="setup">{SETUP}</div>}
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div className="col" style={{ width: 300, flex: "none" }}>
          <div className="card"><h3>{new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })} <span className="muted" style={{ fontWeight: 400 }}><Link href={`/clinic/calendar?d=${shiftDay(monthStart, -1)}`}>‹</Link> <Link href={`/clinic/calendar?d=${nextMonth}`}>›</Link></span></h3>
            <div className="cal">{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div className="h" key={i}>{d}</div>)}
              {cells.map((c) => c.x ? <span key={c.date} className="d x" /> : <Link key={c.date} href={`/clinic/calendar?d=${c.date}`} className={`d${c.date === day ? " on" : ""}${dot.has(c.date) ? " dot" : ""}`}>{c.label}</Link>)}</div>
            <div className="tiny" style={{ marginTop: 8 }}><Link href={`/clinic/calendar?d=${todayPT()}`}>Today</Link></div></div>
          <div className="card"><div className="lbl">This week</div><div className="row" style={{ marginTop: 10, gap: 22 }}>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{week.length}</div><div className="tiny">booked</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{week.filter((a) => a.status === "booked").length}</div><div className="tiny">to confirm</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{week.filter((a) => a.status === "no_show").length}</div><div className="tiny">no-show</div></div></div></div>
          {blocks.length > 0 && <div className="card"><div className="lbl">Time off today</div>{blocks.map((b) => <div key={b.id} className="sm" style={{ marginTop: 6 }}>{fmtTime(b.starts_at)}–{fmtTime(b.ends_at)} · {b.reason || "blocked"}{b.staff_id ? ` · ${byStaff.get(b.staff_id) ?? ""}` : " · whole clinic"}</div>)}</div>}
        </div>
        <div className="card" style={{ flex: 1 }}><h3>{fmtDate(ptToUtc(day, "12:00").toISOString(), { weekday: "long", month: "long", day: "numeric" })}</h3>
          <div className="col" style={{ gap: 10, marginTop: 14 }}>{dayRows.length === 0 && <div className="empty">Nothing booked this day.</div>}
            {dayRows.map((a) => (
              <Link key={a.id} href={`/clinic/calendar?d=${day}&a=${a.id}`} className={`slot${selected?.id === a.id ? " sel" : ""}`} style={a.status === "canceled" ? { opacity: .5 } : undefined}>
                <div className="time">{fmtTime(a.starts_at)}<span>{a.duration_min} min</span></div><div className="av s">{initials(fullName(a), a.email)}</div>
                <div style={{ flex: 1 }}><b style={{ fontSize: 14 }}>{fullName(a)}</b><div className="sm muted">{a.service_name}{a.provider_id ? ` · ${byStaff.get(a.provider_id) ?? ""}` : ""} · {a.source === "web" ? "online" : "by staff"}</div></div>
                <span className={`pill ${PILL[a.status] ?? ""}`}>{STATUS_LABEL[a.status] ?? a.status}</span></Link>))}
          </div></div>
        <div className="card" style={{ width: 380, flex: "none", display: "flex", flexDirection: "column", gap: 14 }}>
          {!selected ? <div className="empty">Select an appointment.</div> : (<>
            <div><div className="lbl">Who</div><div style={{ fontWeight: 700, marginTop: 3 }}>{fullName(selected)}</div><div className="sm muted">{selected.phone} · {selected.email}</div></div>
            <div><div className="lbl">What</div><div className="sm" style={{ marginTop: 3 }}>{selected.service_name} · {selected.duration_min} min · {fmtDate(selected.starts_at, { weekday: "short", month: "short", day: "numeric" })} {fmtTime(selected.starts_at)}</div></div>
            {selected.intake && <div><div className="lbl">Intake</div>{Object.entries(selected.intake).map(([k, v]) => <div key={k} className="sm" style={{ marginTop: 4 }}><span className="muted">{k}:</span> {v}</div>)}</div>}
            {selected.notes && <div><div className="lbl">Customer note</div><div className="sm" style={{ marginTop: 3 }}>{selected.notes}</div></div>}
            <ApptActions id={selected.id} status={selected.status} startsAt={selected.starts_at} durationMin={selected.duration_min} staffNotes={selected.staff_notes} providerId={selected.provider_id} team={team.rows.filter((t) => t.active).map((t) => ({ id: t.id!, name: t.name }))} />
          </>)}
        </div>
      </div>
    </>
  );
}
