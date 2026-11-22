import Link from "next/link";
import { CLINIC_SITE } from "@/labo/clinic/site";
import ClearBag from "./ClearBag";

export const metadata = { title: "Thank you", robots: { index: false, follow: false } };

export default function ThankYouPage() {
  return (
    <section className="pdp" style={{ minHeight: "60vh" }}>
      <div className="wrap tight" style={{ textAlign: "center" }}>
        <ClearBag />
        <span className="kicker">Order received</span>
        <h1 style={{ marginTop: 16 }}>Thank you.</h1>
        <p className="sub" style={{ marginTop: 18 }}>Your receipt is on its way by email. Pick-up orders are ready within one business day at the clinic where South Lake Union meets Eastlake; shipped orders go out within two.</p>
        <p className="note" style={{ marginTop: 22 }}>Questions? Text or call <a href={CLINIC_SITE.tel}>{CLINIC_SITE.phoneDisplay}</a>.</p>
        <div className="acts" style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 30 }}><Link className="btn btn-primary" href="/shop">Back to the shop</Link><Link className="btn btn-ghost" href="/booking">Book a visit</Link></div>
      </div>
    </section>
  );
}
