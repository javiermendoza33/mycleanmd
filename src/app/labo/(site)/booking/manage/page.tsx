import Link from "next/link";
import { getBooking, fmtWhen } from "@/lib/labo/booking";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { BOOKING } from "@/labo/clinic/booking";
import CancelButton from "./CancelButton";

export const metadata = { title: "Manage your appointment", robots: { index: false, follow: false } };

export default async function ManagePage({ searchParams }: { searchParams: Promise<{ id?: string; t?: string }> }) {
  const sp = await searchParams; const b = await getBooking(sp.id ?? "", sp.t ?? "");
  return (
    <section className="pdp" style={{ minHeight: "60vh" }}>
      <div className="wrap tight">
        {!b ? (
          <><span className="kicker">Appointment</span><h1 style={{ marginTop: 14 }}>We couldn&rsquo;t find that one.</h1><p className="sub" style={{ marginTop: 16 }}>The link may have expired. Text {CLINIC_SITE.phoneDisplay} and we&rsquo;ll sort it out.</p></>
        ) : (
          <>
            <span className="kicker">{b.status === "canceled" ? "Canceled" : "Your appointment"}</span>
            <h1 style={{ marginTop: 14 }}>{b.service_name}</h1>
            <p className="sub" style={{ marginTop: 16 }}>{fmtWhen(b.starts_at)} · {b.duration_min} min · {b.first_name} {b.last_name}</p>
            {b.status === "canceled" ? (
              <p className="note" style={{ marginTop: 18 }}>This appointment is canceled. <Link className="more" href="/booking">Book a new time</Link>.</p>
            ) : (
              <>
                <p className="note" style={{ marginTop: 18 }}>Changes within {BOOKING.cancelHours} hours of the appointment carry a {BOOKING.cancelFee} fee. To move it, cancel here and pick a new time, or text {CLINIC_SITE.phoneDisplay}.</p>
                <div className="acts" style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
                  <Link className="btn btn-primary" href={`/booking?service=${b.service_slug}`}>Pick a new time</Link>
                  <CancelButton id={b.id} token={b.cancel_token} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
