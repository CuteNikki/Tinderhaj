import { passkeyClient } from '@better-auth/passkey/client';
import { inferAdditionalFields, twoFactorClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from '@/lib/auth';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), twoFactorClient(), passkeyClient()],
});

/**
 * What to say when Better Auth turns something away for needing a recent
 * sign-in: adding a passkey or disconnecting a provider takes one from the
 * last day, so a stolen session that's been around a while can't. Null for
 * any other error.
 */
export function recentSignInMessage(error: object | null | undefined) {
  // Not every error the client gives has a code
  const code = error && 'code' in error ? error.code : undefined;
  return code === 'SESSION_NOT_FRESH' || code === 'SESSION_EXPIRED'
    ? 'For your safety, this needs a recent sign-in. Sign out and back in, then try again.'
    : null;
}
