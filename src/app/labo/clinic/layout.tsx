import { PRACTICE } from "@/labo/content";
import PortalSignOut from "@/components/labo/PortalSignOut";
import ClinicNav from "./ClinicNav";
import { getStaff } from "@/lib/labo/clinic";
import { initials } from "@/lib/labo/provider";
import { LMark } from "@/components/labo/Logo";
import "../provider/provider.css";
import "./clinic.css";

export const dynamic = "force-dynamic";

/** The clinic staff portal shell (sandbox, Nov 19 2026): same look as the provider portal, its own nav and roles. */
export default async function ClinicLayout({ children }: { children: React.ReactNode }) {
  const s = await getStaff();
  if (!s) return <div data-provider data-clinicp><main className="main"><div className="card"><h3>Clinic team only</h3><p className="muted" style={{ marginTop: 8 }}>Sign in with the email your admin added to the team. Not on the team yet? Ask Mónika or Javier.</p></div></main></div>;
  return (
    <div data-provider data-clinicp>
      <aside className="side">
        <div className="brand"><i className="lmark-tile"><LMark variant="clinic" size={20} /></i><div><b>{PRACTICE.name}</b><span>Clinic · {s.staff.role}</span></div></div>
        <ClinicNav admin={s.staff.role === "admin"} />
        <div className="me"><div className="av">{initials(s.staff.name, s.user.email)}</div><div style={{ flex: 1, minWidth: 0 }}><b>{s.staff.name}</b><span>{s.user.email}</span></div><PortalSignOut /></div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
