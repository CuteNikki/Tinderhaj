import 'server-only';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail({ email, resetUrl }: { email: string; resetUrl: string }) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Tinderhaj <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your Tinderhaj password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your Tinderhaj password. Click the link below to choose a new one. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#111;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
