import { randomBytes } from "node:crypto";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { BOOKING, DEFAULT_HOURS, getMenuItem, priceLabel, INTAKE, type MenuItem } from "@/labo/clinic/booking";
import { CLINIC_SITE } from "@/labo/clinic/site";
import { PRACTICE } from "@/labo/content";

/** Server side of the clinic scheduler (sandbox, Nov 19 2026): hours → open slots minus what is already on the books
 *  (labo_bookings + the telehealth labo_visits, both Pacific), create with a re-check, cancel by token, confirmation emails. */
const PT = BOOKING.tz;
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export type Hours = Record<string, { on: boolean; from: string; to: string }>;
export type Booking = { id: string; service_slug: string; service_name: string; duration_min: number; starts_at: string; ends_at: string; status: string; first_name: string; last_name: string; email: string; phone: string; notes: string | null; intake: Record<string, string> | null; sms_consent: boolean; policy_consent: boolean; cancel_token: string; created_at: string };

export function ptToUtc(date: string, time = "00:00") {
  const [y, m, d] = date.split("-").map(Number); const [hh, mm] = time.split(":").map(Number);
  let t = Date.UTC(y, m - 1, d, hh, mm);
  for (let i = 0; i < 2; i++) {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: PT, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(t)).map((x) => [x.type, x.value]));
    t += Date.UTC(y, m - 1, d, hh, mm) - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  }
  return new Date(t);
}
export const todayPT = () => new Intl.DateTimeFormat("en-CA", { timeZone: PT }).format(new Date());
export const shiftDay = (date: string, n: number) => { const [y, m, d] = date.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10); };
export const fmtWhen = (iso: string) => new Intl.DateTimeFormat("en-US", { timeZone: PT, weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso)) + " PT";
const weekdayOf = (date: string) => DAYS[new Date(date + "T12:00:00Z").getUTCDay()];
const isDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);

const missing = (e: { code?: string; message?: string } | null | undefined) => !!e && (e.code === "42P01" || /does not exist|schema cache/i.test(e.message || ""));

export async function getHours(): Promise<Hours> {
  try {
    const { data } = await createAdminClient().from("labo_provider_settings").select("hours").eq("id", 1).maybeSingle();
    const h = data?.hours as Hours | undefined;
    return h && Object.keys(h).length ? h : DEFAULT_HOURS;
  } catch { return DEFAULT_HOURS; }
}

/** Busy intervals (UTC ms) between two instants, from both tables; a missing bookings table just means nothing booked yet. */
async function busy(fromIso: string, toIso: string): Promise<Array<[number, number]>> {
  const db = createAdminClient(); const out: Array<[number, number]> = [];
  const b = await db.from("labo_bookings").select("starts_at, ends_at").lt("starts_at", toIso).gt("ends_at", fromIso).not("status", "in", "(canceled)");
  if (b.error && !missing(b.error)) throw new Error(b.error.message);
  for (const r of b.data ?? []) out.push([+new Date(r.starts_at), +new Date(r.ends_at)]);
  const v = await db.from("labo_visits").select("scheduled_at, duration_min").gte("scheduled_at", fromIso).lt("scheduled_at", toIso).neq("status", "canceled");
  if (!v.error) for (const r of v.data ?? []) if (r.scheduled_at) { const s = +new Date(r.scheduled_at); out.push([s, s + (Number(r.duration_min) || 15) * 60_000]); }
  return out;
}

function dayStarts(date: string, hours: Hours, item: MenuItem, taken: Array<[number, number]>, now = Date.now()) {
  const h = hours[weekdayOf(date)]; if (!h?.on) return [] as string[];
  const open = +ptToUtc(date, h.from), close = +ptToUtc(date, h.to), dur = item.min * 60_000, buf = BOOKING.bufferMin * 60_000, step = BOOKING.stepMin * 60_000;
  const earliest = now + BOOKING.leadHours * 3_600_000; const out: string[] = [];
  for (let t = open; t + dur <= close; t += step) {
    if (t < earliest) continue;
    if (taken.some(([s, e]) => t < e + buf && t + dur + buf > s)) continue;
    out.push(new Date(t).toISOString());
  }
  return out;
}

export async function slotsForDay(date: string, slug: string) {
  const item = getMenuItem(slug); if (!item || !isDate(date)) return [];
  const [from, to] = [ptToUtc(date).toISOString(), ptToUtc(shiftDay(date, 1)).toISOString()];
  return dayStarts(date, await getHours(), item, await busy(from, to));
}

/** Which days of a month still have at least one slot — one query for the whole month. */
export async function openDays(month: string, slug: string) {
  const item = getMenuItem(slug); if (!item || !/^\d{4}-\d{2}$/.test(month)) return [];
  const first = month + "-01", next = month.slice(0, 4) + "-" + String(+month.slice(5) + 1).padStart(2, "0") + "-01";
  const nextMonth = +month.slice(5) === 12 ? String(+month.slice(0, 4) + 1) + "-01-01" : next;
  const hours = await getHours(); const taken = await busy(ptToUtc(first).toISOString(), ptToUtc(nextMonth).toISOString());
  const last = shiftDay(todayPT(), BOOKING.horizonDays); const days: string[] = [];
  for (let d = first; d < nextMonth && d <= last; d = shiftDay(d, 1)) if (dayStarts(d, hours, item, taken).length) days.push(d);
  return days;
}

export type NewBooking = { slug: string; startsAt: string; firstName: string; lastName: string; email: string; phone: string; notes?: string; intake?: Record<string, string>; smsConsent?: boolean; policyConsent?: boolean; origin: string };

export async function createBooking(b: NewBooking): Promise<{ ok: true; booking: Booking } | { ok: false; error: string; code?: string }> {
  const item = getMenuItem(b.slug); if (!item) return { ok: false, error: "Pick a service." };
  const first = b.firstName.trim().slice(0, 60), last = b.lastName.trim().slice(0, 60), email = b.email.trim().toLowerCase().slice(0, 120), phone = b.phone.replace(/[^\d+]/g, "").slice(0, 20);
  if (!first || !last) return { ok: false, error: "First and last name, please." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "That email doesn't look right." };
  if (phone.replace(/\D/g, "").length < 10) return { ok: false, error: "A mobile number we can reach you on, please." };
  if (!b.policyConsent) return { ok: false, error: "Please agree to the cancellation policy." };
  const start = new Date(b.startsAt); if (isNaN(+start)) return { ok: false, error: "Pick a time." };
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: PT }).format(start);
  const open = await slotsForDay(date, item.slug);
  if (!open.includes(start.toISOString())) return { ok: false, error: "That time was just taken — pick another.", code: "taken" };
  const ends = new Date(+start + item.min * 60_000);
  const row = { service_slug: item.slug, service_name: item.name, duration_min: item.min, starts_at: start.toISOString(), ends_at: ends.toISOString(), status: "booked", first_name: first, last_name: last, email, phone, notes: (b.notes || "").trim().slice(0, 1000) || null, intake: b.intake && Object.keys(b.intake).length ? b.intake : null, sms_consent: !!b.smsConsent, policy_consent: true, cancel_token: randomBytes(18).toString("base64url"), source: "web" };
  const { data, error } = await createAdminClient().from("labo_bookings").insert(row).select("*").single();
  if (error) return { ok: false, error: missing(error) ? "Online booking isn't switched on yet — text us and we'll book you by hand." : error.message, code: missing(error) ? "setup" : undefined };
  const booking = data as Booking;
  sendEmails(booking, item, b.origin).catch((e) => console.error("[booking email]", e));
  return { ok: true, booking };
}

export async function getBooking(id: string, token: string) {
  if (!id || !token) return null;
  const { data } = await createAdminClient().from("labo_bookings").select("*").eq("id", id).eq("cancel_token", token).maybeSingle();
  return (data as Booking | null) ?? null;
}

export async function cancelBooking(id: string, token: string) {
  const b = await getBooking(id, token); if (!b) return { ok: false as const, error: "We couldn't find that appointment." };
  if (b.status === "canceled") return { ok: true as const, booking: b };
  const { data, error } = await createAdminClient().from("labo_bookings").update({ status: "canceled", updated_at: new Date().toISOString() }).eq("id", id).select("*").single();
  if (error) return { ok: false as const, error: error.message };
  const booking = data as Booking;
  const key = process.env.RESEND_API_KEY;
  if (key) new Resend(key).emails.send({ from: FROM(), to: TO(), subject: `Canceled: ${booking.service_name} — ${booking.first_name} ${booking.last_name}`, html: `<p>${esc(booking.first_name)} ${esc(booking.last_name)} canceled ${esc(booking.service_name)} on ${esc(fmtWhen(booking.starts_at))}.</p>` }).catch(() => {});
  return { ok: true as const, booking };
}

const FROM = () => process.env.LABO_CONTACT_FROM ?? `${PRACTICE.name} <support@mycleantext.com>`;
const TO = () => process.env.LABO_BOOKING_EMAIL ?? process.env.LABO_CONTACT_EMAIL ?? "javier.mendoza@upm.ai";
const esc = (s: string) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

async function sendEmails(b: Booking, item: MenuItem, origin: string) {
  const key = process.env.RESEND_API_KEY; if (!key) return;
  const resend = new Resend(key); const when = fmtWhen(b.starts_at); const manage = `${origin}/booking/manage?id=${b.id}&t=${b.cancel_token}`;
  const loc = CLINIC_SITE.locations[0];
  const wrap = (body: string) => `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#161412;background:#F8F4EE;padding:28px 26px;border-radius:8px">
    <div style="font-weight:800;font-size:22px;color:#C8432A;letter-spacing:-.02em">${esc(PRACTICE.name)}</div>${body}
    <p style="font-size:12px;color:#7A726A;margin-top:28px">${esc(loc.address1)}, ${esc(loc.address2)} · ${esc(CLINIC_SITE.phoneDisplay)}</p></div>`;
  const intakeRows = Object.entries(b.intake ?? {}).map(([k, v]) => { const q = INTAKE.find((i) => i.key === k)?.label ?? k; return `<tr><td style="padding:4px 14px 4px 0;color:#7A726A;vertical-align:top">${esc(q)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`; }).join("");
  await Promise.all([
    resend.emails.send({ from: FROM(), to: b.email, subject: `You're booked: ${item.name} · ${when}`, html: wrap(`
      <h2 style="font-weight:800;font-size:26px;letter-spacing:-.02em;margin:22px 0 8px">See you ${esc(when)}.</h2>
      <p style="font-size:16px;line-height:1.5">${esc(item.name)} · ${item.min} min · ${esc(priceLabel(item))}<br>with ${esc(PRACTICE.provider.replace("NP-C", "CANS, FNP-C"))}</p>
      <p style="font-size:15px;line-height:1.5"><b>${esc(loc.name)}</b><br>${esc(loc.address1)}, ${esc(loc.address2)}<br><span style="color:#7A726A">${esc(loc.note)}</span></p>
      <p style="font-size:14px;line-height:1.5;background:#FFFFFF;border:1px solid #1F1B18;padding:14px 16px;border-radius:6px">Please reschedule or cancel at least ${BOOKING.cancelHours} hours before your appointment; later cancellations and no-shows carry a ${BOOKING.cancelFee} fee. Skip retinol, exfoliants and alcohol the night before injectables or laser.</p>
      <p><a href="${manage}" style="display:inline-block;background:#C8432A;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:700">Manage or cancel</a></p>
      <p style="font-size:14px">Questions? Text or call ${esc(CLINIC_SITE.phoneDisplay)}.</p>`) }),
    resend.emails.send({ from: FROM(), to: TO(), replyTo: b.email, subject: `New booking: ${item.name} — ${b.first_name} ${b.last_name} · ${when}`, html: wrap(`
      <h2 style="font-weight:800;font-size:22px;margin:22px 0 8px">${esc(b.first_name)} ${esc(b.last_name)} booked ${esc(item.name)}</h2>
      <p style="font-size:15px;line-height:1.6">${esc(when)} · ${item.min} min<br>${esc(b.email)} · ${esc(b.phone)}<br>Texts: ${b.sms_consent ? "opted in" : "no"}${b.notes ? `<br>Notes: ${esc(b.notes)}` : ""}</p>
      ${intakeRows ? `<table style="font-size:14px;border-collapse:collapse">${intakeRows}</table>` : ""}
      <p style="font-size:13px;color:#7A726A">Booking ${b.id}</p>`) }),
  ]);
}
