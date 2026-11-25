import 'server-only';

import nodemailer from 'nodemailer';

import { siteURL } from '@/lib/site-url';

/** A fact of what an email's about, as a row of its details: "Account", "@nikki". */
type Detail = { label: string; value: string };

/** An email as the site writes them: what it's about, its details, and maybe a button to a link. */
type Email = {
  to: string;
  subject: string;
  /** The heading over the text; the subject when not given */
  heading?: string;
  /** What it's about, each a paragraph */
  paragraphs: string[];
  /** A code to type in, shown big: the second step of signing in */
  code?: string;
  /** The facts of it, row by row: whose account, which shark, until when */
  details?: Detail[];
  /** A link to act on, as a button; the plain text writes its address out */
  action?: { label: string; url: string; destructive?: boolean };
  /** After the button, quieter: what to do if it wasn't them */
  note?: string;
  /** Small print under it all: who it's from and for */
  footer: string;
  /** For emails people can turn off: the page that does it, and where mail apps' own button posts (RFC 8058) */
  unsubscribe?: { page: string; oneClick: string };
};

/**
 * The site's light theme (see globals.css), as hex: most email clients don't
 * know oklch. Light only, as the email says it is, since clients that darken
 * email on their own would otherwise turn some of it and not the rest.
 */
const colors = {
  // The muted ground the site's cards sit on
  page: '#eef3f8',
  card: '#ffffff',
  primary: '#006cc8',
  primaryStrong: '#005aaf',
  foreground: '#071425',
  muted: '#4a5866',
  // A card's ring: the foreground at 10% on white
  ring: '#dfe6ee',
  border: '#e3eaf1',
  // Details and the code, a shade off the card
  tint: '#f3f7fb',
  destructive: '#c10007',
};

/** Geist where it's installed, as on the site, else the system's own */
const font =
  "font-family:Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";

const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!
  );

const text = (t: string) => escape(t).replaceAll('\n', '<br>');

/** A table that's only for layout, which screen readers read past. */
const table = (style: string, rows: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;${style}">${rows}</table>`;

/** The logo and the name, above the card. Without images loaded, the name still shows. */
function brand() {
  return table(
    '',
    `<tr>
<td style="padding-right:10px;vertical-align:middle;"><img src="${new URL('/email-logo.png', siteURL)}" width="31" height="24" alt="" style="display:block;border:0;" /></td>
<td style="vertical-align:middle;${font}font-size:15px;font-weight:600;color:${colors.foreground};">Tinderhaj</td>
</tr>`
  );
}

/** Labels on the left, their values on the right, a line between each */
function details(rows: Detail[]) {
  const cells = rows.map(
    (row, i) => `<tr>
<td class="detail-label" valign="top" width="1%" style="width:1%;padding:10px 20px 10px 0;${i ? `border-top:1px solid ${colors.border};` : ''}${font}font-size:13px;line-height:1.5;color:${colors.muted};white-space:nowrap;">${escape(row.label)}</td>
<td class="detail-value" valign="top" style="padding:10px 0;${i ? `border-top:1px solid ${colors.border};` : ''}${font}font-size:13px;line-height:1.5;color:${colors.foreground};word-break:break-word;">${text(row.value)}</td>
</tr>`
  );
  return `<tr><td style="padding:20px 0 0;">${table(
    `width:100%;background:${colors.tint};border:1px solid ${colors.border};border-radius:12px;`,
    `<tr><td style="padding:2px 16px;">${table('width:100%;', cells.join(''))}</td></tr>`
  )}</td></tr>`;
}

/** A code to type in, big and spaced out, in the tint the details have */
function code(value: string) {
  return `<tr><td style="padding:20px 0 0;">${table(
    `width:100%;background:${colors.tint};border:1px solid ${colors.border};border-radius:12px;`,
    `<tr><td align="center" style="padding:16px 0 16px 8px;${font}font-size:30px;line-height:1.2;font-weight:700;letter-spacing:8px;font-variant-numeric:tabular-nums;color:${colors.primaryStrong};">${escape(value)}</td></tr>`
  )}</td></tr>`;
}

/** Round, as the site's buttons are. In a table cell, so Outlook paints the whole button and not only behind its label */
function button(action: NonNullable<Email['action']>) {
  const color = action.destructive ? colors.destructive : colors.primary;
  return `<tr><td style="padding:24px 0 0;">${table(
    '',
    `<tr><td style="background:${color};border-radius:9999px;">
<a href="${escape(action.url)}" style="display:inline-block;padding:10px 20px;${font}font-size:14px;line-height:20px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:9999px;">${escape(action.label)}</a>
</td></tr>`
  )}</td></tr>`;
}

/** The email as plain text, a part for each part of the HTML */
function plain(email: Email) {
  return [
    email.heading ?? email.subject,
    ...email.paragraphs,
    ...(email.code ? [email.code] : []),
    ...(email.details?.length
      ? [email.details.map((d) => `${d.label}: ${d.value}`).join('\n')]
      : []),
    ...(email.action ? [`${email.action.label}:\n${email.action.url}`] : []),
    ...(email.note ? [email.note] : []),
    [
      '--',
      email.footer,
      ...(email.unsubscribe ? [`Unsubscribe: ${email.unsubscribe.page}`] : []),
      siteURL.host,
    ].join('\n'),
  ].join('\n\n');
}

/** The email as plain text, and as HTML in the site's colours. */
function render(email: Email) {
  const paragraphs = email.paragraphs.map(
    (p, i) =>
      `<tr><td style="padding:${i ? 12 : 8}px 0 0;${font}font-size:14px;line-height:1.6;color:${colors.foreground};">${text(p)}</td></tr>`
  );
  const card = table(
    `width:100%;background:${colors.card};border:1px solid ${colors.ring};border-radius:16px;`,
    `<tr><td class="card" style="padding:28px 28px 32px;">${table(
      'width:100%;',
      `<tr><td style="${font}font-size:20px;line-height:1.3;font-weight:600;color:${colors.foreground};">${escape(email.heading ?? email.subject)}</td></tr>
${paragraphs.join('\n')}
${email.code ? code(email.code) : ''}
${email.details?.length ? details(email.details) : ''}
${email.action ? button(email.action) : ''}
${email.note ? `<tr><td style="padding:20px 0 0;${font}font-size:13px;line-height:1.6;color:${colors.muted};">${text(email.note)}</td></tr>` : ''}`
    )}</td></tr>`
  );
  const unsubscribe = email.unsubscribe
    ? ` <a href="${escape(email.unsubscribe.page)}" style="color:${colors.muted};">unsubscribe</a>.`
    : '';
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>${escape(email.subject)}</title>
<style>
/* On a phone: less padding, and each detail's label over its value. Clients
   that drop this get the wide layout, which still works, only tighter. */
@media (max-width: 480px) {
  .card { padding: 22px 20px 24px !important; }
  .detail-label, .detail-value { display: block !important; width: auto !important; }
  .detail-label { padding: 10px 0 0 !important; white-space: normal !important; }
  .detail-value { padding: 2px 0 10px !important; border-top: 0 !important; }
}
</style>
</head>
<body style="margin:0;padding:0;background:${colors.page};">
<div style="display:none;max-height:0;overflow:hidden;">${escape(email.paragraphs[0] ?? '')}</div>
${table(
  `width:100%;background:${colors.page};`,
  `<tr><td align="center" style="padding:32px 16px;">${table(
    'width:100%;max-width:520px;',
    `<tr><td style="padding:0 4px 16px;">${brand()}</td></tr>
<tr><td>${card}</td></tr>
<tr><td style="padding:16px 4px 0;${font}font-size:12px;line-height:1.6;color:${colors.muted};">${text(email.footer)}${unsubscribe}<br><a href="${escape(siteURL.origin)}" style="color:${colors.muted};">${escape(siteURL.host)}</a></td></tr>`
  )}</td></tr>`
)}
</body>
</html>`;
  return { text: plain(email), html };
}

/** The small print under an email, as dash's says who sent it */
const sentTo = (username: string) => `Sent by Tinderhaj to @${username}.`;

async function sendEmail(email: Email) {
  // The mail server, e.g. smtps://no-reply%40example.com:password@mail.example.com
  const url = process.env.SMTP_URL;
  if (!url) throw new Error('Set SMTP_URL to send emails.');

  await nodemailer.createTransport(url).sendMail({
    from: process.env.EMAIL_FROM ?? 'Tinderhaj <no-reply@tinderhaj.com>',
    to: email.to,
    subject: email.subject,
    ...render(email),
    headers: {
      // A unique value stops Gmail from grouping emails with the same subject
      // into one conversation, where it hides the repeated text behind "…".
      'X-Entity-Ref-ID': crypto.randomUUID(),
      // Mail apps show their own Unsubscribe button for these, which posts to
      // the one-click address without opening anything (RFC 8058).
      ...(email.unsubscribe && {
        'List-Unsubscribe': `<${email.unsubscribe.oneClick}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      }),
    },
  });
}

export async function sendPasswordResetEmail({
  email,
  username,
  url,
}: {
  email: string;
  username: string;
  url: string;
}) {
  await sendEmail({
    to: email,
    subject: 'Reset your Tinderhaj password',
    heading: 'Reset your password',
    paragraphs: [
      `Hi @${username}, we received a request to reset your Tinderhaj password. Choose a new one with the button below.`,
    ],
    details: [
      { label: 'Account', value: `@${username}` },
      { label: 'Link expires', value: 'In 1 hour' },
    ],
    action: { label: 'Reset password', url },
    note: "If you didn't ask for this, you can safely ignore this email. Your password stays as it is.",
    footer: sentTo(username),
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
  await sendEmail({
    to: email,
    subject: changing
      ? 'Confirm your new email for Tinderhaj'
      : 'Verify your email for Tinderhaj',
    heading: changing ? 'Confirm your new email' : 'Verify your email',
    paragraphs: [
      `Hi @${username}, please confirm this is your email address with the button below.`,
    ],
    details: [
      { label: 'Account', value: `@${username}` },
      { label: 'Email', value: email },
      { label: 'Link expires', value: 'In 24 hours' },
    ],
    action: { label: changing ? 'Confirm email' : 'Verify email', url },
    note: changing
      ? "If you didn't ask to change your email, you can safely ignore this email."
      : "If you didn't create an account, you can safely ignore this email.",
    footer: sentTo(username),
  });
}

/** First step of changing a verified email: sent to the current address. */
export async function sendEmailChangeConfirmation({
  email,
  username,
  newEmail,
  url,
}: {
  email: string;
  username: string;
  newEmail: string;
  url: string;
}) {
  await sendEmail({
    to: email,
    subject: 'Confirm your email change for Tinderhaj',
    heading: 'Confirm your email change',
    paragraphs: [
      `Hi @${username}, someone (hopefully you) asked to change the email address of your Tinderhaj account. Confirm with the button below, and we'll send one last link to the new address.`,
    ],
    details: [
      { label: 'Account', value: `@${username}` },
      { label: 'New email', value: newEmail },
      { label: 'Link expires', value: 'In 24 hours' },
    ],
    action: { label: 'Confirm change', url },
    note: "If you didn't ask for this, ignore this email and consider changing your password.",
    footer: sentTo(username),
  });
}

export async function sendDeleteAccountEmail({
  email,
  username,
  url,
}: {
  email: string;
  username: string;
  url: string;
}) {
  await sendEmail({
    to: email,
    subject: 'Confirm deleting your Tinderhaj account',
    heading: 'Delete your account',
    paragraphs: [
      `Hi @${username}, someone (hopefully you) asked to delete your Tinderhaj account. Open the button below in the browser where you're signed in to confirm.`,
    ],
    details: [
      { label: 'Account', value: `@${username}` },
      {
        label: 'Deletes',
        value: 'The account, all of its sharks, and their hearts and matches',
      },
      { label: 'Link expires', value: 'In 1 hour' },
    ],
    action: { label: 'Delete account', url, destructive: true },
    note: "If you didn't ask for this, ignore this email and consider changing your password.",
    footer: sentTo(username),
  });
}

/** The code for the second step of signing in, for accounts using email codes. */
export async function sendTwoFactorCode({
  email,
  username,
  code,
}: {
  email: string;
  username: string;
  code: string;
}) {
  await sendEmail({
    to: email,
    subject: `${code} is your Tinderhaj sign-in code`,
    heading: 'Your sign-in code',
    paragraphs: [
      `Hi @${username}, here's your code to finish signing in. It expires in 5 minutes.`,
    ],
    code,
    note: "If you didn't just sign in, someone may know your password: change it in your account settings.",
    footer: sentTo(username),
  });
}

/**
 * One of their sharks is verified: live in discovery, for the first time or
 * again after an edit. Can be turned off, so it has unsubscribe links.
 */
export async function sendSharkVerifiedEmail({
  email,
  username,
  shark,
  url,
  again,
  unsubscribe,
}: {
  email: string;
  username: string;
  shark: string;
  url: string;
  again: boolean;
  unsubscribe: { page: string; oneClick: string };
}) {
  await sendEmail({
    to: email,
    subject: again
      ? `Your changes to ${shark} are live`
      : `${shark} is verified on Tinderhaj`,
    heading: again ? `${shark} is back in discovery` : `${shark} is verified!`,
    paragraphs: [
      again
        ? `Hi @${username}, your changes to ${shark} passed review and are live now.`
        : `Hi @${username}, ${shark} passed review and is live now. Other sharks can find ${shark} in discovery and send hearts.`,
    ],
    details: [
      { label: 'Shark', value: shark },
      { label: 'Owner', value: `@${username}` },
      { label: 'Status', value: 'Verified, in discovery' },
    ],
    action: { label: `See ${shark}`, url },
    footer: `${sentTo(username)} Turn these off in Settings, or`,
    unsubscribe,
  });
}
