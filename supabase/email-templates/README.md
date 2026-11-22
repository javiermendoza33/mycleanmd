# Branded Supabase Auth emails (The Labo Clinic)

Javier, Nov 21 2026: "can we brand this" — the sign-up confirmation arrived as a plain "Supabase Auth
<noreply@mail.app.supabase.io>" message. Two settings fix it. **Both were applied on Nov 21 2026 via the Management API** (`PATCH /v1/projects/<ref>/config/auth`
with a 7-day project-scoped access token — the MCP connector has no Auth-config tool, and the scoped token needs
**Project Settings: Read-write** as well as Auth Config, or the write 403s with `project_admin_write`). The dashboard
steps below are the manual equivalent for the next change. Project: **mycleanmd** (`hprtecdhqozcytihmqvg`, org MyCleanText).

## 1 · Templates (paste, ~3 minutes)

`python3 supabase/email-templates/build.py` regenerates the files. Then in **Supabase → Authentication → Emails**
(older UI: Email Templates), for each template below: paste the `.subject.txt` line into **Subject heading** and the
whole `.html` file into **Message body (source)**, Save.

| Supabase template | File |
|---|---|
| Confirm sign up | `confirm-signup.html` / `.subject.txt` |
| Reset password | `reset-password.html` / `.subject.txt` |
| Magic link | `magic-link.html` / `.subject.txt` |

The brand name is a conditional on the sign-up metadata — the Labo sign-up page sends `brand: "labo"` — so Labo
members see **The Labo Clinic / thelabomethod.com / the Eastlake address**, and anyone who signs up on mycleanmd.com
still sees MyCleanMD. (Same project, one template, both brands.)

## 2 · Sender (custom SMTP through Resend) — ON since Nov 21 2026

Without it, Supabase sends from its shared address and adds its own "Opt out" footer. **Authentication →
Emails → SMTP Settings → Enable Custom SMTP:**

| Field | Value |
|---|---|
| Sender email | `support@mycleantext.com` (the domain already verified in Resend — thelabomethod.com has no MX/DKIM yet) |
| Sender name | `The Labo Clinic` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | the Resend API key (the same `RESEND_API_KEY` the site uses; never paste it anywhere else) |

Then **Rate limits → Email sent**: raise from the default 2/hour (Supabase lifts the cap once custom SMTP is on).

Later, to send as `hello@thelabomethod.com`: verify thelabomethod.com in Resend (DKIM + MX records at GoDaddy),
then change Sender email here. The sender name is global to the project — MyCleanMD sign-ups would also say
"The Labo Clinic" until that brand gets its own project.

## Test

Sign up on https://thelabomethod.com/membership with a fresh address → the confirmation should arrive from
"The Labo Clinic <support@mycleantext.com>" with the clay button; tap it → lands on /portal.
