import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || 'LEVELACE <hello@security.ilevelace.com>'
const TO = process.env.EMAIL_TO || 'hello@ilevelace.com'

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
export async function sendContactEmail(data: {
  firstName: string
  lastName: string
  email: string
  company?: string
  product?: string
  message: string
}) {
  // Notify team
  await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `New inquiry from ${data.firstName} ${data.lastName}`,
    html: `
      <div style="font-family:monospace;background:#050608;color:#f0f2f7;padding:32px;border-radius:8px;">
        <h2 style="color:#f5a623;margin-bottom:24px;">▶ New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#6b7591;padding:8px 0;width:140px;">Name</td><td>${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="color:#6b7591;padding:8px 0;">Email</td><td>${data.email}</td></tr>
          <tr><td style="color:#6b7591;padding:8px 0;">Company</td><td>${data.company || '—'}</td></tr>
          <tr><td style="color:#6b7591;padding:8px 0;">Product</td><td>${data.product || '—'}</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#111419;border-left:3px solid #f5a623;border-radius:4px;">
          <p style="color:#6b7591;margin:0 0 8px 0;">Message</p>
          <p style="margin:0;">${data.message}</p>
        </div>
        <p style="color:#3d4560;font-size:12px;margin-top:24px;">LEVELACE SENTINEL LLC — ilevelace.com</p>
      </div>
    `,
  })

  // Auto-reply to sender
  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: 'We received your message — LEVELACE',
    html: `
      <div style="font-family:monospace;background:#050608;color:#f0f2f7;padding:32px;border-radius:8px;">
        <h2 style="color:#f5a623;">▶ Message Received</h2>
        <p>Hi ${data.firstName},</p>
        <p>We've received your inquiry and will get back to you within 24 business hours.</p>
        <p style="color:#6b7591;">If your matter is urgent, email us directly at <a href="mailto:support@security.ilevelace.com" style="color:#f5a623;">support@security.ilevelace.com</a>.</p>
        <hr style="border-color:#1e2330;margin:24px 0;">
        <p style="color:#3d4560;font-size:12px;">LEVELACE SENTINEL LLC · ilevelace.com</p>
      </div>
    `,
  })
}

// ─── WELCOME EMAIL ────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(user: { email: string; name?: string | null }) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: 'Welcome to LEVELACE',
    html: `
      <div style="font-family:monospace;background:#050608;color:#f0f2f7;padding:32px;border-radius:8px;">
        <h2 style="color:#f5a623;">▶ Welcome to LEVELACE SENTINEL</h2>
        <p>Hi ${user.name || 'there'},</p>
        <p>Your account has been created. You can now access your dashboard and start using the Fraud Risk platform.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#f5a623;color:#050608;text-decoration:none;border-radius:4px;font-weight:700;">
          Go to Dashboard →
        </a>
        <hr style="border-color:#1e2330;margin:24px 0;">
        <p style="color:#3d4560;font-size:12px;">LEVELACE SENTINEL LLC · support@security.ilevelace.com</p>
      </div>
    `,
  })
}

// ─── SUBSCRIPTION CONFIRMATION ────────────────────────────────────────────────
export async function sendSubscriptionEmail(user: { email: string; name?: string | null }, plan: string) {
  await resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `Subscription activated — ${plan} Plan`,
    html: `
      <div style="font-family:monospace;background:#050608;color:#f0f2f7;padding:32px;border-radius:8px;">
        <h2 style="color:#f5a623;">✓ Subscription Activated</h2>
        <p>Hi ${user.name || 'there'},</p>
        <p>Your <strong>${plan}</strong> plan is now active. All features are unlocked and ready to use.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display:inline-block;margin-top:16px;padding:12px 24px;background:#f5a623;color:#050608;text-decoration:none;border-radius:4px;font-weight:700;">
          Open Dashboard →
        </a>
        <hr style="border-color:#1e2330;margin:24px 0;">
        <p style="color:#3d4560;font-size:12px;">Questions? billing@security.ilevelace.com · LEVELACE SENTINEL LLC</p>
      </div>
    `,
  })
}
