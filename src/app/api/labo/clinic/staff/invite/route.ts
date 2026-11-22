import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireStaff } from "@/lib/labo/clinic";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRACTICE } from "@/labo/content";

/** POST { id } — email a team member their sign-in steps (Nov 21 2026, Javier: "how can i email Monika as admin so
 *  she can login and use the portal"). Admin only. Same Resend sender as the contact form and bookings. The link
 *  points at the host the admin is using, so an invite sent from the sandbox lands on the sandbox. */
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

export async function POST(req: NextRequest) {
  const s = await requireStaff("admin"); if (!s) return NextResponse.json({ ok: false, error: "Admin only" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const id = String(b.id || ""); if (!id) return NextResponse.json({ ok: false, error: "id" }, { status: 400 });
  const db = createAdminClient();
  const { data: row } = await db.from("labo_staff").select("id,email,name,role,active").eq("id", id).maybeSingle();
  if (!row) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  if (!row.active) return NextResponse.json({ ok: false, error: "Reactivate them first" }, { status: 400 });
  const key = process.env.RESEND_API_KEY; if (!key) return NextResponse.json({ ok: false, error: "Email isn't configured (RESEND_API_KEY)" }, { status: 503 });
  const origin = req.nextUrl.origin, from = process.env.LABO_CONTACT_FROM ?? `${PRACTICE.name} <support@mycleantext.com>`;
  const first = row.name.split(" ")[0] || row.name, roleLabel = row.role === "admin" ? "an admin" : "a team member", by = s.staff.name || s.user.email;
  const html = `
<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#2C3539;line-height:1.55">
  <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6F7A73;margin:0 0 6px">${esc(PRACTICE.name)} · clinic portal</p>
  <h1 style="font-size:22px;margin:0 0 14px">Hi ${esc(first)}, you've been added as ${roleLabel}.</h1>
  <p>${esc(by)} added you to the ${esc(PRACTICE.name)} portal — the calendar, appointments, customers, orders and the skin-quiz answers all live there. Three steps:</p>
  <ol style="padding-left:20px">
    <li style="margin:8px 0"><b>Create your sign-in</b> at <a href="${origin}/auth/signup?redirect=%2Fclinic" style="color:#6F7A73">${origin}/auth/signup</a> using <b>this exact email</b> — <b>${esc(row.email)}</b> — and a password of your choice. (Already have one with this email? Just sign in.)</li>
    <li style="margin:8px 0">If a confirmation email arrives, click its link, then go to <a href="${origin}/auth/login?redirect=%2Fclinic" style="color:#6F7A73">${origin}/auth/login</a>.</li>
    <li style="margin:8px 0">Open <a href="${origin}/clinic" style="color:#6F7A73">${origin}/clinic</a>. ${row.role === "admin" ? "As an admin you also see Services &amp; prices and Team." : "You'll see Today, Calendar, Appointments, Customers and Hours &amp; time off."}</li>
  </ol>
  <p style="margin-top:18px"><a href="${origin}/auth/signup?redirect=%2Fclinic" style="display:inline-block;background:#6F7A73;color:#fff;text-decoration:none;padding:12px 18px;border-radius:6px;font-weight:600">Create my sign-in</a></p>
  <p style="font-size:13px;color:#909292;margin-top:22px">Access is tied to ${esc(row.email)}; signing up with a different address won't open the portal. Reply to this email if anything doesn't work.</p>
</div>`;
  try {
    await new Resend(key).emails.send({ from, to: row.email, replyTo: s.user.email, subject: `Your ${PRACTICE.name} portal sign-in`, html });
  } catch (e) { return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 }); }
  await db.from("labo_staff").update({ invited_at: new Date().toISOString() }).eq("id", id);
  return NextResponse.json({ ok: true });
}
