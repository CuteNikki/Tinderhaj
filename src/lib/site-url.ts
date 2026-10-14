import 'server-only';

/**
 * Where the site runs, e.g. https://tinderhaj.com. Links in emails, provider
 * callbacks and passkeys all use it. Read when the server starts, unlike
 * NEXT_PUBLIC_ values, which are fixed when the app is built.
 *
 * BETTER_AUTH_URL wins. On Vercel, production uses the project's production
 * domain and previews their own address. Only local development may leave
 * it out entirely.
 */
function readSiteURL() {
  const { BETTER_AUTH_URL, VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL } = process.env;

  if (BETTER_AUTH_URL) return new URL(BETTER_AUTH_URL);
  if (VERCEL_ENV === 'production' && VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${VERCEL_PROJECT_PRODUCTION_URL}`);
  if (VERCEL_URL) return new URL(`https://${VERCEL_URL}`);
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') {
    throw new Error('BETTER_AUTH_URL is not set. Set it to the public address of the site, e.g. https://tinderhaj.com.');
  }
  return new URL('http://localhost:3000');
}

export const siteURL = readSiteURL();
