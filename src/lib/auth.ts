import 'server-only';

import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError, createAuthMiddleware, getSessionFromCtx, isAPIError } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { twoFactor } from 'better-auth/plugins';
import type { DiscordProfile, GithubProfile, SocialProviders, TwitchProfile, TwitterProfile } from 'better-auth/social-providers';
import { randomInt } from 'crypto';

import {
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  PASSWORD_RESET_TOKEN_EXPIRATION,
  SESSION_EXPIRATION,
} from '@/constants/auth';
import { sendDeleteAccountEmail, sendEmailChangeConfirmation, sendPasswordResetEmail, sendTwoFactorCode, sendVerificationEmail } from '@/lib/email';
import { hashPassword, verifyPassword } from '@/lib/password-hasher';
import prisma from '@/lib/prisma';
import { SOCIAL_PROVIDERS, type SocialProviderId } from '@/lib/providers';
import { usernameSchema } from '@/lib/schemas';

/** Where the auth endpoints run. Passkeys only work on this site. */
const authURL = new URL(process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000');

/**
 * Where Better Auth keeps the devices that skip two-step sign-in ("Don't ask
 * again"), one verification row each, holding the user's id.
 */
export function trustedDevicesWhere(userId: string) {
  return {
    identifier: { startsWith: 'trust-device-' },
    value: userId,
  };
}

/** Makes every device ask for a code again at the next sign-in. */
export async function forgetTrustedDevices(userId: string) {
  await prisma.verification.deleteMany({ where: trustedDevicesWhere(userId) });
}

/**
 * Better Auth only knows a `name`, which is the username here. Checks it has
 * the same shape as everywhere else, and that nobody else has it.
 */
async function assertUsernameAvailable(name: unknown, ownUserId?: string) {
  const { success, data, error } = usernameSchema.safeParse(name);

  if (!success) {
    throw new APIError('BAD_REQUEST', { code: 'INVALID_USERNAME', message: error.issues[0]?.message ?? 'Username is invalid!' });
  }

  const taken = await prisma.user.findUnique({ where: { username: data }, select: { id: true } });

  if (taken && taken.id !== ownUserId) {
    throw new APIError('BAD_REQUEST', { code: 'USERNAME_TAKEN', message: 'Username is already in use!' });
  }
}

/**
 * Turns a name into a free username that fits the rules, e.g. "Nikki B." into
 * "nikki_b", or "nikki_b_4821" if that's taken. For people signing up with a
 * provider, whose name there rarely fits.
 */
async function availableUsername(wanted: string | null | undefined, email: string) {
  const slug = (value: string) =>
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, MAX_USERNAME_LENGTH);
  const isFree = async (username: string) => !(await prisma.user.findUnique({ where: { username }, select: { id: true } }));

  let base = slug(wanted ?? '');
  if (base.length < MIN_USERNAME_LENGTH) base = slug(email.split('@')[0]);
  if (base.length < MIN_USERNAME_LENGTH) base = 'shark';

  if (await isFree(base)) return base;

  for (;;) {
    const candidate = `${base.slice(0, MAX_USERNAME_LENGTH - 5)}_${randomInt(1000, 10000)}`;
    if (await isFree(candidate)) return candidate;
  }
}

/** A provider's client id and secret, when both are set. */
function credentials(id: SocialProviderId) {
  const clientId = process.env[`${id.toUpperCase()}_CLIENT_ID`];
  const clientSecret = process.env[`${id.toUpperCase()}_CLIENT_SECRET`];
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

/** Social providers with credentials set, so their buttons show. */
export const enabledProviders: SocialProviderId[] = SOCIAL_PROVIDERS.map((provider) => provider.id).filter((id) => credentials(id));

// Where providers have a handle, it makes a better username than a full name.
const providerOptions = {
  google: {},
  apple: { appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER },
  microsoft: {},
  github: { mapProfileToUser: (profile: GithubProfile) => ({ name: profile.login }) },
  discord: { mapProfileToUser: (profile: DiscordProfile) => ({ name: profile.username }) },
  twitter: { mapProfileToUser: (profile: TwitterProfile) => ({ name: profile.data.username }) },
  twitch: { mapProfileToUser: (profile: TwitchProfile) => ({ name: profile.preferred_username }) },
  facebook: {},
} satisfies Record<SocialProviderId, object>;

const socialProviders = Object.fromEntries(enabledProviders.map((id) => [id, { ...credentials(id), ...providerOptions[id] }])) as SocialProviders;

export const auth = betterAuth({
  baseURL: authURL.origin,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  session: {
    expiresIn: SESSION_EXPIRATION,
  },
  advanced: {
    cookiePrefix: 'tinderhaj',
  },
  // Apple sends people back with a form post from its own site.
  trustedOrigins: enabledProviders.includes('apple') ? ['https://appleid.apple.com'] : [],
  socialProviders,
  account: {
    // Provider tokens aren't used after sign-in, but shouldn't sit in the
    // database readable either.
    encryptOAuthTokens: true,
    accountLinking: {
      // Connecting happens while signed in, from the account page, so the
      // provider's email doesn't have to match. Signing in with a provider
      // only joins an existing account when both emails are verified.
      allowDifferentEmails: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Sign-up with a password already checked the username; this is for
        // providers. Their profile picture isn't used, so isn't kept.
        before: async (user) => ({ data: { ...user, name: await availableUsername(user.name, user.email), image: null } }),
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
    password: { hash: hashPassword, verify: verifyPassword },
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: PASSWORD_RESET_TOKEN_EXPIRATION,
    sendResetPassword: async ({ user, url }) => {
      // Not awaited, so the response time doesn't reveal whether the email exists.
      void sendPasswordResetEmail({ email: user.email, username: user.name, url }).catch((error) =>
        console.error('Failed to send password reset email', error),
      );
    },
  },
  emailVerification: {
    // Sent after signing up, and on request from the account page.
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24,
    sendVerificationEmail: async ({ user, url }) => {
      // During an email change, the last link goes to the new address, which
      // no account uses yet. It gets its own wording and landing message.
      const changing = !(await prisma.user.findUnique({ where: { email: user.email }, select: { id: true } }));

      void sendVerificationEmail({
        email: user.email,
        username: user.name,
        url: changing ? withCallback(url, '/verified?step=changed') : url,
        changing,
      }).catch((error) => console.error('Failed to send verification email', error));
    },
  },
  user: {
    // The column is `username`; Better Auth calls it `name`.
    fields: { name: 'username' },
    additionalFields: {
      role: { type: 'string', input: false, required: false, defaultValue: 'USER' },
    },
    changeEmail: {
      enabled: true,
      // Unverified addresses may have a typo, so they change right away and
      // get a new verification link.
      updateEmailWithoutVerification: true,
      // Verified addresses first confirm from the current address, so a
      // stolen session can't quietly take over the account.
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        void sendEmailChangeConfirmation({
          email: user.email,
          username: user.name,
          newEmail,
          url: withCallback(url, '/verified?step=confirmed'),
        }).catch((error) => console.error('Failed to send email change confirmation', error));
      },
    },
    deleteUser: {
      enabled: true,
      // Deleting always needs a link from the account's email, so a stolen
      // session or an unlocked computer isn't enough.
      sendDeleteAccountVerification: async ({ user, url, token }) => {
        const link = new URL('/account/delete', new URL(url).origin);
        link.searchParams.set('token', token);

        void sendDeleteAccountEmail({ email: user.email, username: user.name, url: link.toString() }).catch((error) =>
          console.error('Failed to send delete account email', error),
        );
      },
      deleteTokenExpiresIn: 60 * 60,
    },
  },
  rateLimit: {
    // On in production only, per IP address. Sign-in codes are emails, so
    // they get a tighter limit than the default 100 requests per 10 seconds.
    customRules: {
      '/two-factor/send-otp': { window: 60, max: 3 },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        await assertUsernameAvailable(ctx.body?.name);
      }
      if (ctx.path === '/update-user' && ctx.body?.name !== undefined) {
        const session = await getSessionFromCtx(ctx);
        await assertUsernameAvailable(ctx.body.name, session?.user.id);
      }
    }),
    // Turning two-step sign-in off forgets every trusted device, not just
    // this one as Better Auth does, so turning it back on asks everywhere.
    after: createAuthMiddleware(async (ctx) => {
      if (isAPIError(ctx.context.returned)) return;
      if (ctx.path === '/two-factor/disable') {
        const session = await getSessionFromCtx(ctx);
        if (session) await forgetTrustedDevices(session.user.id);
      }
    }),
  },
  plugins: [
    // Two-step sign-in, for signing in with a password: a code from an
    // authenticator app or by email, or a backup code. Passkeys are already
    // two steps, so they skip it.
    twoFactor({
      issuer: 'Tinderhaj',
      otpOptions: {
        period: 5,
        // Only a hash is kept, like a password.
        storeOTP: 'hashed',
        sendOTP: ({ user, otp }) => {
          void sendTwoFactorCode({ email: user.email, username: user.name, code: otp }).catch((error) => console.error('Failed to send sign-in code', error));
        },
      },
    }),
    passkey({
      rpID: authURL.hostname,
      rpName: 'Tinderhaj',
      origin: authURL.origin,
    }),
    // Must be last: lets server actions set auth cookies.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;

/** Changes where a Better Auth email link leads once it has been used. */
function withCallback(url: string, callbackURL: string) {
  const link = new URL(url);
  link.searchParams.set('callbackURL', callbackURL);
  return link.toString();
}
