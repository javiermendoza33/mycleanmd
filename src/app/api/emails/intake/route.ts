import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { BRAND } from '@/lib/brand'

// Created per request, not at module scope. `new Resend()` throws when the key
// is absent, and module-scope construction runs during `next build` — which
// meant the whole app failed to build without the secret. A fresh clone could
// not be built at all.
function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

const FROM = `${BRAND.name} <onboarding@resend.dev>`
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'javier.mendoza@upm.ai'

const CARE_LABELS: Record<string, string> = {
  primary:     'Primary Care',
  mental:      'Mental Health',
  dermatology: 'Dermatology',
  urgent:      'Urgent Care',
  womens:      "Women's Health",
  weight:      'Weight Loss',
  male:        'Male Sexual Health',
  hair:        'Hair Loss',
  longevity:   'Longevity',
  menopause:   'Menopause',
  nutrition:   'Nutrition',
}

function patientHtml(name: string, careType: string, answers: Record<string, unknown>) {
  const label = CARE_LABELS[careType] ?? careType
  const rows = Object.entries(answers)
    .map(([k, v]) => {
      const displayVal = Array.isArray(v) ? v.join(', ') : String(v ?? '—')
      const displayKey = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      return `<tr>
        <td style="padding:10px 16px;font-size:13px;color:#6B7280;border-bottom:1px solid #F3F4F6;">${displayKey}</td>
        <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#1E2B5E;border-bottom:1px solid #F3F4F6;">${displayVal}</td>
      </tr>`
    })
    .join('')

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Intake Received</title></head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 24px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr><td style="background:#1E2B5E;padding:32px 40px;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#fff;">
            <em style="font-style:italic;font-weight:400;color:#7ECFCF;">Care</em>MD
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px 40px 32px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1E2B5E;">We received your intake, ${name}.</h1>
          <p style="margin:0 0 32px;font-size:15px;color:#6B7280;line-height:1.6;">
            Your <strong style="color:#1E2B5E;">${label}</strong> intake form has been submitted.
            A licensed provider will review your information and reach out within <strong style="color:#1E2B5E;">24 hours</strong>.
          </p>

          <p style="margin:0 0 12px;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Your answers</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #F3F4F6;border-radius:12px;overflow:hidden;">
            ${rows}
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid #F3F4F6;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
            Questions? Reply to this email or message your care team from the portal.<br>
            CareMD · Not for emergencies — call 911 for life-threatening conditions.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}

function adminHtml(patientName: string, patientEmail: string, careType: string, answers: Record<string, unknown>) {
  const label = CARE_LABELS[careType] ?? careType
  const rows = Object.entries(answers)
    .map(([k, v]) => {
      const displayVal = Array.isArray(v) ? v.join(', ') : String(v ?? '—')
      const displayKey = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      return `<tr>
        <td style="padding:10px 16px;font-size:13px;color:#6B7280;border-bottom:1px solid #F3F4F6;">${displayKey}</td>
        <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#1E2B5E;border-bottom:1px solid #F3F4F6;">${displayVal}</td>
      </tr>`
    })
    .join('')

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>New Intake Submission</title></head>
<body style="margin:0;padding:0;background:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 24px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <tr><td style="background:#1E2B5E;padding:32px 40px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#7ECFCF;">New Intake Submission</p>
          <h1 style="margin:0;font-size:20px;font-weight:700;color:#fff;">${label}</h1>
        </td></tr>

        <tr><td style="padding:32px 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
            <tr>
              <td style="font-size:13px;color:#6B7280;">Patient</td>
              <td style="font-size:13px;font-weight:600;color:#1E2B5E;text-align:right;">${patientName}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#6B7280;padding-top:6px;">Email</td>
              <td style="font-size:13px;color:#1E2B5E;text-align:right;padding-top:6px;">${patientEmail}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#6B7280;padding-top:6px;">Care type</td>
              <td style="font-size:13px;font-weight:600;color:#1E2B5E;text-align:right;padding-top:6px;">${label}</td>
            </tr>
          </table>

          <p style="margin:0 0 12px;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9CA3AF;">Answers</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #F3F4F6;border-radius:12px;overflow:hidden;">
            ${rows}
          </table>

          <div style="margin-top:28px;">
            <a href="https://xeebihealth.vercel.app/admin/submissions"
              style="display:inline-block;padding:12px 24px;background:#1E2B5E;color:#fff;font-size:14px;font-weight:600;border-radius:100px;text-decoration:none;">
              View in admin portal →
            </a>
          </div>
        </td></tr>

        <tr><td style="padding:20px 40px;border-top:1px solid #F3F4F6;">
          <p style="margin:0;font-size:12px;color:#9CA3AF;">CareMD Admin Alerts · xeebihealth.vercel.app</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}

export async function POST(req: NextRequest) {
  try {
    const { patientName, patientEmail, careType, answers } = await req.json()

    const label = CARE_LABELS[careType] ?? careType

    const resend = getResend()
    if (!resend) {
      // No key configured — say so plainly instead of throwing a 500 that looks
      // like the intake itself failed. The intake is already saved by this point.
      return NextResponse.json({ ok: false, error: 'Email not configured' }, { status: 503 })
    }

    const [patientResult, adminResult] = await Promise.all([
      // Confirmation to patient
      resend.emails.send({
        from: FROM,
        to: patientEmail,
        subject: `Your ${label} intake is confirmed — ${BRAND.name}`,
        html: patientHtml(patientName || 'there', careType, answers),
      }),
      // Alert to admin
      resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `New intake: ${label} — ${patientName || patientEmail}`,
        html: adminHtml(patientName || 'Unknown', patientEmail, careType, answers),
      }),
    ])

    return NextResponse.json({ ok: true, patientResult, adminResult })
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
