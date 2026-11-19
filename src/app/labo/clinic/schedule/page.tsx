import { getStaff, listStaff, loadBlocks } from "@/lib/labo/clinic";
import { getHours } from "@/lib/labo/booking";
import { fmtDate, fmtTime } from "@/lib/labo/provider";
import HoursForm from "@/components/labo/clinic/HoursForm";
import BlocksForm from "@/components/labo/clinic/BlocksForm";

export default async function ClinicSchedule() {
  const s = await getStaff(); if (!s) return null; const [hours, team, blocks] = await Promise.all([getHours(), listStaff(), loadBlocks(new Date().toISOString(), new Date(Date.now() + 120 * 86_400_000).toISOString())]);
  const byStaff = new Map(team.rows.map((t) => [t.id, t.name]));
  return (
    <>
      <div className="top"><div><h1>Hours &amp; time off</h1><p>What the website lets people book, Pacific time</p></div></div>
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div className="col" style={{ flex: 1 }}><HoursForm initial={hours} canEdit={s.staff.role === "admin"} /></div>
        <div className="col" style={{ flex: 1 }}>
          <BlocksForm team={team.rows.filter((t) => t.active).map((t) => ({ id: t.id!, name: t.name }))} />
          <div className="card"><h3>Upcoming time off</h3><div className="list">{blocks.length === 0 && <div className="empty">None.</div>}
            {blocks.map((b) => <div className="li" key={b.id}><div className="w"><b>{fmtDate(b.starts_at, { weekday: "short", month: "short", day: "numeric" })} {fmtTime(b.starts_at)} – {fmtDate(b.ends_at, { month: "short", day: "numeric" })} {fmtTime(b.ends_at)}</b><span>{b.reason || "blocked"} · {b.staff_id ? byStaff.get(b.staff_id) ?? "" : "whole clinic"}</span></div><BlocksForm.Delete id={b.id} /></div>)}
          </div></div>
        </div>
      </div>
    </>
  );
}
