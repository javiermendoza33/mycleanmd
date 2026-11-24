import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cuvo, cuvoMode, type Answer } from "@/lib/cuvo";
import { upsertCustomer, addEvent, updateCare } from "@/lib/labo/crm";
import { getProgram } from "@/labo/content";
import { METHOD_CONSENT_TEXT } from "@/labo/method/sms";

/* POST: the last step of /start. Creates (or uses) the sign-in, the CRM customer, the Cuvo patient and consents, files
   the case ON HOLD, records the care row, then either sends the patient to Stripe (live price) or, in sandbox/mock,
   marks it paid and releases the hold. PHI goes to Cuvo; our tables keep the person, the ids and the money. */
type Body = { program: string; check: { state: string; age: string; sex: "male" | "female" }; account: { email: string; password: string }; about: { first_name: string; last_name: string; dob: string; phone: string; line1: string; city: string; postal_code: string }; consent: { telehealth: boolean; privacy: boolean; sms: boolean }; consent_version: string; question_set: { id: string; version: number } | null; answers: Answer[] };

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => null) as Body | null;
  if (!b || !b.program || !b.account?.email || !b.about?.first_name || !b.consent?.telehealth || !b.consent?.privacy) return NextResponse.json({ error: "Missing details." }, { status: 400 });
  const program = getProgram(b.program); if (!program) return NextResponse.json({ error: "Unknown program." }, { status: 400 });
  const email = b.account.email.trim().toLowerCase();
  const sb = await createClient(); const admin = createAdminClient();

  // 1 · the sign-in: the current session, or a new user (email confirmed: they just proved it by paying attention), or ask to sign in
  let { data: { user } } = await sb.auth.getUser();
  if (!user) {
    if ((b.account.password || "").length < 8) return NextResponse.json({ error: "Choose a password of 8 or more characters." }, { status: 400 });
    const { data: created, error } = await admin.auth.admin.createUser({ email, password: b.account.password, email_confirm: true, user_metadata: { first_name: b.about.first_name, last_name: b.about.last_name, brand: "method" } });
    if (error) { if (/already|exists|registered/i.test(error.message)) return NextResponse.json({ error: "There's already an account with that email. Sign in, then come back to Get started." }, { status: 409 }); return NextResponse.json({ error: error.message }, { status: 500 }); }
    const { error: e2 } = await sb.auth.signInWithPassword({ email, password: b.account.password }); if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });
    user = created.user;
  } else if (user.email && user.email.toLowerCase() !== email) return NextResponse.json({ error: `You're signed in as ${user.email}. Sign out to start as someone else.` }, { status: 409 });

  // 2 · the CRM customer (both brands share it)
  const customer = await upsertCustomer({ email, first_name: b.about.first_name, last_name: b.about.last_name, phone: b.about.phone, state: b.check.state, brand: "method", source: "method-start", user_id: user!.id, sms_consent: !!b.consent.sms, email_consent: true });

  // 3 · Cuvo: patient, consents, the case on hold
  const c = cuvo(); const mode = cuvoMode();
  let patientId: string, caseId: string;
  try {
    const patient = await c.createPatient({ external_id: user!.id, first_name: b.about.first_name, last_name: b.about.last_name, date_of_birth: b.about.dob, sex_at_birth: b.check.sex, email, phone: b.about.phone, address: { line1: b.about.line1, city: b.about.city, state: b.check.state, postal_code: b.about.postal_code, country: "US" } });
    patientId = patient.id;
    const [tele, priv] = await Promise.all([c.recordConsent(patientId, "telehealth", b.consent_version), c.recordConsent(patientId, "privacy", b.consent_version)]);
    const careIns = await admin.from("labo_care").insert({ customer_id: customer?.id, user_id: user!.id, program_slug: program.slug, cuvo_patient_id: patientId, cuvo_mode: mode, status: "awaiting_payment" }).select("id").single();
    if (careIns.error) return NextResponse.json({ error: careIns.error.message.includes("does not exist") ? "CRM tables not set up yet (run supabase-labo-crm.sql)." : careIns.error.message }, { status: 500 });
    const careId = careIns.data.id as string;
    const filed = await c.fileCase({ patient: patientId, question_set: b.question_set || undefined as never, answers: b.answers, requested_medications: [{ medication_id: program.slug === "glp-1-weight-management" ? "semaglutide-compounded" : program.slug === "testosterone-for-men" ? "testosterone-cypionate" : program.slug === "hormone-therapy-for-women" ? "estradiol-patch" : "peptide-protocol", quantity: 1, refills: 0, days_supply: 30 }], consent_ids: [tele.id, priv.id], external_id: careId, hold: true, metadata: { program: program.slug, brand: "method" } });
    caseId = filed.id;
    await updateCare(careId, { cuvo_case_id: caseId, status: "awaiting_payment" });
    await addEvent(customer?.id, "method", "enrolled", `Started ${program.name}`, { care: careId, case: caseId, mode });
    if (b.consent.sms) await addEvent(customer?.id, "method", "sms_consent", "SMS opt-in during Get started", { recorded_at: new Date().toISOString(), ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown", user_agent: req.headers.get("user-agent") ?? "unknown", source: `${req.nextUrl.origin}/start`, mobile: b.about.phone, disclosure: METHOD_CONSENT_TEXT });
    if (customer && !customer.cuvo_patient_id) await upsertCustomer({ email, brand: "method", cuvo_patient_id: patientId });

    // 4 · payment: Stripe when the program has a live price, else the sandbox pays itself
    const key = process.env.STRIPE_SECRET_KEY;
    if (key && program.stripePriceId && program.stripePriceId !== "PRICE_ID_NOT_SET") {
      const stripe = new Stripe(key); const origin = req.nextUrl.origin;
      const session = await stripe.checkout.sessions.create({ mode: "subscription", customer_email: email, line_items: [{ price: program.stripePriceId, quantity: 1 }], metadata: { kind: "method", careId, programSlug: program.slug, userId: user!.id }, client_reference_id: user!.id, success_url: `${origin}/portal/care/${careId}?paid=1`, cancel_url: `${origin}/start?program=${program.slug}` });
      await updateCare(careId, { stripe_checkout_session_id: session.id });
      return NextResponse.json({ url: session.url, careId });
    }
    await c.releaseHold(caseId);
    await updateCare(careId, { status: "filed", paid_at: new Date().toISOString() });
    await addEvent(customer?.id, "method", "case", "Case filed for clinician review (sandbox payment)", { case: caseId });
    return NextResponse.json({ url: `/portal/care/${careId}`, careId });
  } catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 502 }); }
}
