import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONSENT_TEXT } from "@/labo/clinic/sms";
import { PRACTICE } from "@/labo/content";

/**
 * SMS consent record for member sign-ups (Nov 22 2026, Javier: "add the phone number as option… which is our
 * compliance area"). The sign-up page stores phone + sms_consent on the profile (via user metadata → the
 * handle_new_user trigger, and a client upsert). This route adds what only the server can see — the IP, the user
 * agent, the exact disclosure text and the timestamp — and emails the practice inbox the same record, mirroring
 * the contact form. It only ever ANNOTATES a consent the member already gave (sms_consent = true, no record yet);
 * it cannot create or flip consent, so it needs no session.
 */
const FROM = process.env.LABO_CONTACT_FROM ?? `${PRACTICE.name} <support@mycleantext.com>`;
const TO = process.env.LABO_CONTACT_EMAIL ?? "javier.mendoza@upm.ai";

export async function POST(req: NextRequest) {
  let body: { email?: string } = {};
  try { body = await req.json(); } catch { /* fallthrough */ }
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: false }, { status: 400 });

  let admin;
  try { admin = createAdminClient(); } catch { return NextResponse.json({ ok: false, error: "not configured" }, { status: 503 }); }
  const { data: p, error } = await admin.from("profiles").select("id,full_name,email,phone,sms_consent,sms_consent_at,sms_consent_meta").eq("email", email).maybeSingle();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
  // No profile yet (trigger still running), no consent, or already recorded → nothing to do; say so quietly.
  if (!p || !p.sms_consent || p.sms_consent_meta) return NextResponse.json({ ok: true, recorded: false });

  const meta = {
    recorded_at: new Date().toISOString(),
    ip: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown",
    user_agent: req.headers.get("user-agent") ?? "unknown",
    source: "member sign-up (thelabomethod.com/auth/signup)",
    disclosure: CONSENT_TEXT,
  };
  await admin.from("profiles").update({ sms_consent_meta: meta, sms_consent_at: p.sms_consent_at ?? meta.recorded_at }).eq("id", p.id);

  const key = process.env.RESEND_API_KEY;
  if (key) {
    const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
    const rows: [string, string][] = [
      ["Member", p.full_name || "—"], ["Email", p.email ?? email], ["Mobile", p.phone ?? "—"],
      ["SMS consent", "YES — box ticked at sign-up"], ["Consent recorded", meta.recorded_at], ["IP", meta.ip], ["Browser", meta.user_agent],
    ];
    try {
      await new Resend(key).emails.send({
        from: FROM, to: TO, subject: `[${PRACTICE.name}] New member SMS opt-in: ${p.full_name || email}`,
        html: `<div style="font-family:system-ui,sans-serif;color:#132238"><h2 style="margin:0 0 12px">New member SMS opt-in</h2><table style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#858D99">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`).join("")}</table><p style="margin-top:16px;font-size:12px;color:#858D99">Disclosure shown at sign-up:</p><p style="font-size:12px;color:#3C495B">${esc(CONSENT_TEXT)}</p></div>`,
      });
    } catch (e) { console.error("member consent email failed", e); }
  }
  return NextResponse.json({ ok: true, recorded: true });
}
