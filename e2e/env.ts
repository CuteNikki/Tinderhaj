export const PORT = 3100;
export const BASE_URL = `http://localhost:${PORT}`;

/** Where the server sends emails during tests: the stand-in for Resend in global-setup.ts. */
export const MAIL_PORT = 3199;
export const MAIL_URL = `http://127.0.0.1:${MAIL_PORT}`;

/** Every account the tests make has an email here, so they're easy to clear away. */
export const EMAIL_DOMAIN = 'e2e.test';

/**
 * The tests' own database. Not DATABASE_URL: Bun and Next both read .env,
 * which usually points at the one for development.
 */
export function databaseURL() {
  const url = process.env.E2E_DATABASE_URL;
  if (!url) throw new Error('Set E2E_DATABASE_URL to a database the tests may fill with accounts, with the migrations applied.');
  return url;
}
