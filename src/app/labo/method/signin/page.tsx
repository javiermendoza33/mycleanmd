import Link from "next/link";
import { METHOD, AVAILABILITY } from "@/labo/content";

export const metadata = {
  title: "Sign in",
  description: `Patient sign-in for ${METHOD.name} is coming soon.`,
  alternates: { canonical: "/signin" },
  robots: { index: false, follow: true },
};

/** /signin (Nov 22 2026, Javier: "remove signin page or put coming soon page"): the patient portal for The Labo
 *  Method isn't open yet, so Sign in lands here instead of the bare Healthie placeholder. Swap this page for the real
 *  portal link (HEALTHIE.login in content.ts) when the practice supplies it. */
export default function SignInSoon() {
  return (
    <section className="soon">
      <div className="wrap tight">
        <span className="tag">Patient portal</span>
        <h1>Sign-in is <em>coming soon.</em></h1>
        <p className="sub">We&rsquo;re finishing the patient portal — video visits, your written protocol, medications, refill requests and messages, all in one place. New patients can still start today.</p>
        <div className="acts">
          <Link className="btn btn-primary" href="/programs">Start a program</Link>
          <Link className="btn btn-ghost" href="/how-it-works">How it works</Link>
        </div>
        <p className="note">Already a patient? Email <a href={`mailto:${METHOD.email}`}>{METHOD.email}</a> and we&rsquo;ll get back to you. Available to residents of {AVAILABILITY}.</p>
      </div>
    </section>
  );
}
