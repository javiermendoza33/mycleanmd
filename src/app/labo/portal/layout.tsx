import Link from "next/link";
import { PRACTICE } from "@/labo/content";
import PortalSignOut from "@/components/labo/PortalSignOut";

/**
 * Minimal chrome for the logged-in patient portal — deliberately NOT the
 * marketing Header/Footer from (site), and NOT MyCleanMD's dark 11-specialty
 * Sidebar (src/app/patient/layout.tsx) — this is Labo Method's own patient
 * population. Auth is enforced one layer up, in src/proxy.ts.
 */
const NAV = [
  ["/portal", "Home"],
  ["/portal/visits", "Visits"],
  ["/portal/requests", "Requests"],
  ["/portal/messages", "Messages"],
] as const;

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)" }}>
      <header
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 32px", borderBottom: "1px solid var(--line)", flexWrap: "wrap", gap: 12,
        }}
      >
        <Link href="/portal" style={{ color: "var(--ink)", textDecoration: "none", fontWeight: 600 }}>
          {PRACTICE.name} · Portal
        </Link>
        <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} style={{ color: "var(--graphite)", textDecoration: "none", fontSize: ".92rem" }}>
              {label}
            </Link>
          ))}
        </nav>
        <PortalSignOut />
      </header>
      <main className="wrap" style={{ padding: "40px 0 80px" }}>{children}</main>
    </div>
  );
}
