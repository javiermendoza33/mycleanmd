"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ALL: [string, string, string, boolean][] = [
  ["/clinic", "◎", "Today", false], ["/clinic/calendar", "▦", "Calendar", false], ["/clinic/appointments", "☰", "Appointments", false], ["/clinic/customers", "◯", "Customers", false], ["/clinic/members", "✦", "Members", false], ["/clinic/orders", "▣", "Orders", false], ["/clinic/quiz", "◈", "Skin quiz", false],
  ["/clinic/schedule", "◷", "Hours & time off", false], ["/clinic/services", "✎", "Services & prices", true], ["/clinic/rates", "$", "Rate plans", true], ["/clinic/reports", "▤", "Reports", true], ["/clinic/team", "⚙", "Team", true],
];
export default function ClinicNav({ admin }: { admin: boolean }) {
  const path = usePathname() || "";
  return (
    <nav className="nav">
      {ALL.filter(([, , , a]) => !a || admin).map(([href, ic, label]) => {
        const on = href === "/clinic" ? path === "/clinic" || path === "/labo/clinic" : path.startsWith(href) || path.startsWith("/labo" + href);
        return <Link key={href} href={href} className={on ? "on" : ""}><span className="ic">{ic}</span>{label}</Link>;
      })}
    </nav>
  );
}
