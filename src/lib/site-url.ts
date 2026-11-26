import 'server-only';

/**
 * Where the site runs, e.g. https://tinderhaj.com. Links in emails, provider
 * callbacks and passkeys all use it. Read when the server starts, unlike
 * NEXT_PUBLIC_ values, which are fixed when the app is built.
 *
 * It comes from BETTER_AUTH_URL, which only local development may leave out.
 */
function readSiteURL() {
  const { BETTER_AUTH_URL } = process.env;

  if (BETTER_AUTH_URL) return new URL(BETTER_AUTH_URL);
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    throw new Error(
      'BETTER_AUTH_URL is not set. Set it to the public address of the site, e.g. https://tinderhaj.com.'
    );
  }
  return new URL('http://localhost:3000');
}

export const siteURL = readSiteURL();
