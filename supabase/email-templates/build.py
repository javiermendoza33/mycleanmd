#!/usr/bin/env python3
"""Supabase Auth email templates for The Labo Clinic (Nov 21 2026, Javier: "can we brand this" — the default
"Confirm your email address" mail from noreply@mail.app.supabase.io).

One table-based, inline-styled layout (paper #F6F8FA, clay #1E6B7B, system sans — web fonts are unreliable in mail)
rendered into one HTML file per Auth template. The Supabase project is shared with MyCleanMD, so the brand name is a
Go-template conditional on the sign-up metadata: the Labo sign-up page sends `brand: "labo"` in `options.data`, and
the template reads `{{ .Data.brand }}`. Variables Supabase fills: {{ .ConfirmationURL }}, {{ .Email }}, {{ .SiteURL }}.

    python3 supabase/email-templates/build.py        # writes confirm-signup.html, reset-password.html, magic-link.html

Then paste each file's contents into Supabase → Authentication → Emails → that template (see README.md).
"""
from pathlib import Path

BRAND = '{{ if eq .Data.brand "labo" }}The Labo Clinic{{ else }}MyCleanMD{{ end }}'
SITE = '{{ if eq .Data.brand "labo" }}thelabomethod.com{{ else }}mycleanmd.com{{ end }}'
SITE_URL = '{{ if eq .Data.brand "labo" }}https://thelabomethod.com{{ else }}https://mycleanmd.com{{ end }}'
ADDRESS = '{{ if eq .Data.brand "labo" }}1512 Eastlake Ave E, Seattle, WA 98102 · 877-756-4286{{ else }}Telehealth for Washington residents{{ end }}'

LAYOUT = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>__TITLE__</title>
</head>
<body style="margin:0;padding:0;background:#F6F8FA;-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F6F8FA;">__PREVIEW__</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F8FA;">
  <tr><td align="center" style="padding:36px 16px 48px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
      <tr><td style="padding:0 6px 18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:19px;font-weight:800;letter-spacing:-.02em;color:#1E6B7B;">__BRAND__</td></tr>
      <tr><td style="background:#FFFFFF;border:1px solid #D5DDE6;border-radius:8px;padding:38px 40px 34px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#132238;">
        <p style="margin:0 0 10px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#1E6B7B;font-weight:600;">__KICKER__</p>
        <h1 style="margin:0 0 14px;font-size:26px;line-height:1.2;letter-spacing:-.02em;font-weight:800;color:#132238;">__HEADLINE__</h1>
        <p style="margin:0 0 22px;font-size:16px;line-height:1.55;color:#3C495B;">__BODY__</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:6px;background:#1E6B7B;">
          <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:6px;">__CTA__</a>
        </td></tr></table>
        <p style="margin:22px 0 0;font-size:13px;line-height:1.55;color:#858D99;">__AFTER__</p>
        <p style="margin:18px 0 0;font-size:12px;line-height:1.5;color:#858D99;word-break:break-all;">If the button doesn't work, copy this link into your browser:<br><a href="{{ .ConfirmationURL }}" style="color:#1E6B7B;">{{ .ConfirmationURL }}</a></p>
      </td></tr>
      <tr><td style="padding:22px 6px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#858D99;">
        __BRAND__ · __ADDRESS__<br>
        <a href="__SITE_URL__" style="color:#858D99;">__SITE__</a> · This message was sent to {{ .Email }} because an account was requested with this address. If that wasn't you, you can ignore it — nothing happens without the link.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
"""

TEMPLATES = {
    "confirm-signup": dict(
        subject="Confirm your email — " + BRAND,
        TITLE="Confirm your email", PREVIEW="One tap to open your member portal.",
        KICKER="Welcome", HEADLINE="Confirm your email to open your portal.",
        BODY="Thanks for joining __BRAND__. Confirm this address and your private portal opens — your visits, your plan, messages and requests in one place.",
        CTA="Confirm my email", AFTER="The link is good for a limited time. Didn't create an account? Ignore this email.",
    ),
    "reset-password": dict(
        subject="Reset your password — " + BRAND,
        TITLE="Reset your password", PREVIEW="Choose a new password for your portal.",
        KICKER="Account", HEADLINE="Let's set a new password.",
        BODY="We received a request to reset the password for your __BRAND__ account. Use the button to choose a new one.",
        CTA="Choose a new password", AFTER="If you didn't ask for this, you can ignore it — your password stays as it is.",
    ),
    "magic-link": dict(
        subject="Your sign-in link — " + BRAND,
        TITLE="Your sign-in link", PREVIEW="Tap to sign in to your portal.",
        KICKER="Sign in", HEADLINE="Here's your sign-in link.",
        BODY="Tap the button to sign in to your __BRAND__ portal. No password needed.",
        CTA="Sign me in", AFTER="The link works once and expires soon. If you didn't request it, ignore this email.",
    ),
}

out = Path(__file__).parent
for name, t in TEMPLATES.items():
    html = LAYOUT
    for k, v in t.items():
        if k == "subject": continue
        html = html.replace("__" + k + "__", v)
    html = html.replace("__BRAND__", BRAND).replace("__SITE_URL__", SITE_URL).replace("__SITE__", SITE).replace("__ADDRESS__", ADDRESS)
    (out / f"{name}.html").write_text(html)
    (out / f"{name}.subject.txt").write_text(t["subject"] + "\n")
    print(f"wrote {name}.html ({len(html)} chars) · subject: {t['subject']}")
