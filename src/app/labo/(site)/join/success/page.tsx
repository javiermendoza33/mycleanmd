import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Eyebrow } from "@/components/labo/Sections";

/**
 * Post-Stripe-Checkout landing. The webhook (/api/labo/webhook) already wrote
 * the labo_enrollments row by the time Stripe redirects a human here — this
 * page's only job is linking that row to a signed-in account:
 *   - already signed in → backfill user_id on the row (in case checkout
 *     happened before an account existed) and go straight to the portal.
 *   - not signed in → ask for sign-in/signup, redirect param brings them
 *     right back here afterward to finish the link.
 */
export default async function JoinSuccessPage(
  { searchParams }: { searchParams: Promise<{ session_id?: string }> }
) {
  const { session_id: sessionId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user && sessionId) {
    const admin = createAdminClient();
    await admin
      .from("labo_enrollments")
      .update({ user_id: user.id })
      .eq("stripe_checkout_session_id", sessionId)
      .is("user_id", null);
    redirect("/portal");
  }

  const here = `/join/success${sessionId ? `?session_id=${sessionId}` : ""}`;

  return (
    <section>
      <div className="wrap tight" style={{ padding: "80px 0", textAlign: "center" }}>
        <Eyebrow>Payment received</Eyebrow>
        <h1 style={{ marginTop: 15 }}>One more step.</h1>
        <p className="sub" style={{ marginTop: 17 }}>
          Sign in or create an account with the same email you used at checkout
          to reach your portal and start your intake.
        </p>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap", marginTop: 30 }}>
          <Link className="btn btn-primary" href={`/auth/login?redirect=${encodeURIComponent(here)}`}>
            Sign in
          </Link>
          <Link className="btn btn-ghost" href={`/auth/signup?redirect=${encodeURIComponent(here)}`}>
            Create account
          </Link>
        </div>
      </div>
    </section>
  );
}
