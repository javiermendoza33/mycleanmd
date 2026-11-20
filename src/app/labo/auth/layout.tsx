import Link from "next/link";
import { PRACTICE } from "@/labo/content";

/** Sign-in pages in the clinic look (sandbox, Nov 19 2026 — Javier: "change the login page to reflect the labo clinic style").
 *  Served on the Labo hosts by src/proxy.ts rewriting /auth/login, /auth/signup and /auth/forgot here. */
export default function LaboAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-clinic className="auth">
      <aside className="authside">
        <Link href="/" className="brand">{PRACTICE.name}</Link>
        {/* Nov 19 2026 (Javier: "add high res photo from library here somewhere"): the 1877×2560 hero portrait (Monika passed on the blonde one), framed like the home hero. */}
        <div className="authphoto"><img src="/labo/img/about/team.jpg" alt="" aria-hidden="true" /></div>
        <div className="authcopy">
          <span className="kicker">Seattle · South Lake Union</span>
          <h1>Skin that looks like <em>you</em>, on your best day.</h1>
          <p>One sign-in for the clinic team and for patients: your appointments, your plan, your messages.</p>
        </div>
        <p className="authfoot">Nurse practitioner-led · {PRACTICE.subline}</p>
      </aside>
      <main className="authmain">{children}</main>
    </div>
  );
}
