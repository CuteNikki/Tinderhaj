import 'server-only';

import { Resend } from 'resend';

async function sendEmail(email: { to: string; subject: string; heading: string; body: string; text: string }) {
  // Created here, not at import, so builds work without the API key.
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'Tinderhaj <onboarding@resend.dev>',
    to: email.to,
    subject: email.subject,
    text: email.text,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>${email.heading}</h2>
        ${email.body}
      </div>
    `,
    // A unique value stops Gmail from grouping emails with the same subject
    // into one conversation, where it hides the repeated text behind "…".
    headers: { 'X-Entity-Ref-ID': crypto.randomUUID() },
  });

  if (error) throw new Error(`Resend: ${error.message}`);
}

function button(url: string, label: string) {
  return `<p><a href="${url}" style="display:inline-block;padding:10px 20px;background:#111;color:#fff;border-radius:6px;text-decoration:none;">${label}</a></p>`;
}

export async function sendPasswordResetEmail({ email, username, url }: { email: string; username: string; url: string }) {
  await sendEmail({
    to: email,
    subject: 'Reset your Tinderhaj password',
    heading: 'Reset your password',
    body: `
      <p>Hi @${escapeHtml(username)}, we received a request to reset your Tinderhaj password. Click the link below to choose a new one. This link expires in 1 hour.</p>
      ${button(url, 'Reset Password')}
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
    text: `Hi @${username},\n\nWe received a request to reset your Tinderhaj password. Open this link to choose a new one:\n\n${url}\n\nThis link expires in 1 hour. If you didn't request this, you can safely ignore this email.`,
  });
}

export async function sendVerificationEmail({
  email,
  username,
  url,
  changing,
}: {
  email: string;
  username: string;
  url: string;
  /** True for the last step of changing an email address. */
  changing: boolean;
}) {
  const ignore = changing
    ? "If you didn't ask to change your email, you can safely ignore this email."
    : "If you didn't create an account, you can safely ignore this email.";

  await sendEmail({
    to: email,
    subject: changing ? 'Confirm your new email for Tinderhaj' : 'Verify your email for Tinderhaj',
    heading: changing ? 'Confirm your new email' : 'Verify your email',
    body: `
      <p>Hi @${escapeHtml(username)}, please confirm this is your email address by clicking the link below. This link expires in 24 hours.</p>
      ${button(url, 'Verify Email')}
      <p>${ignore}</p>
    `,
    text: `Hi @${username},\n\nPlease confirm this is your email address by opening this link:\n\n${url}\n\nThis link expires in 24 hours. ${ignore}`,
  });
}

/** First step of changing a verified email: sent to the current address. */
export async function sendEmailChangeConfirmation({ email, username, newEmail, url }: { email: string; username: string; newEmail: string; url: string }) {
  await sendEmail({
    to: email,
    subject: 'Confirm your email change for Tinderhaj',
    heading: 'Confirm your email change',
    body: `
      <p>Hi @${escapeHtml(username)}, someone (hopefully you) asked to change the email address of your Tinderhaj account to <strong>${escapeHtml(newEmail)}</strong>. Click the link below to confirm, and we'll send one last link to the new address. This link expires in 24 hours.</p>
      ${button(url, 'Confirm Change')}
      <p>If you didn't ask for this, ignore this email and consider changing your password.</p>
    `,
    text: `Hi @${username},\n\nSomeone (hopefully you) asked to change the email address of your Tinderhaj account to ${newEmail}. Open this link to confirm, and we'll send one last link to the new address:\n\n${url}\n\nThis link expires in 24 hours. If you didn't ask for this, ignore this email and consider changing your password.`,
  });
}

export async function sendDeleteAccountEmail({ email, username, url }: { email: string; username: string; url: string }) {
  await sendEmail({
    to: email,
    subject: 'Confirm deleting your Tinderhaj account',
    heading: 'Delete your account',
    body: `
      <p>Hi @${escapeHtml(username)}, someone (hopefully you) asked to delete your Tinderhaj account, along with all of its profiles. Open the link below in the browser where you're signed in to confirm. This link expires in 1 hour.</p>
      ${button(url, 'Delete Account')}
      <p>If you didn't ask for this, ignore this email and consider changing your password.</p>
    `,
    text: `Hi @${username},\n\nSomeone (hopefully you) asked to delete your Tinderhaj account, along with all of its profiles. Open this link in the browser where you're signed in to confirm:\n\n${url}\n\nThis link expires in 1 hour. If you didn't ask for this, ignore this email and consider changing your password.`,
  });
}

/** The code for the second step of signing in, for accounts using email codes. */
export async function sendTwoFactorCode({ email, username, code }: { email: string; username: string; code: string }) {
  await sendEmail({
    to: email,
    subject: `${code} is your Tinderhaj sign-in code`,
    heading: 'Your sign-in code',
    body: `
      <p>Hi @${escapeHtml(username)}, your code to finish signing in is:</p>
      <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p>
      <p>It expires in 5 minutes. If you didn't just sign in, someone may know your password: change it in your account settings.</p>
    `,
    text: `Hi @${username},\n\nYour code to finish signing in is:\n\n${code}\n\nIt expires in 5 minutes. If you didn't just sign in, someone may know your password: change it in your account settings.`,
  });
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
