import 'server-only';

import { after } from 'next/server';

import { isBanned, notBannedWhere } from '@/lib/bans';
import prisma from '@/lib/prisma';
import { AccountRole } from '@/lib/roles';

/**
 * Roles on the Tinderhaj Discord server for what someone's done on the site,
 * given and taken back by the site's bot. Off unless DISCORD_BOT_TOKEN and
 * DISCORD_GUILD_ID are set; each role only once its id is set too. The bot
 * needs Manage Roles, and its own role above all of these.
 */

/** What earns each role, from what's known about the account. */
type Facts = { verifiedSharks: number; matched: boolean; moderator: boolean; admin: boolean };

export const DISCORD_ROLES = [
  { key: 'linked', env: 'DISCORD_ROLE_LINKED', label: 'Linked', about: 'Connected Discord to Tinderhaj', earned: () => true },
  {
    key: 'verified',
    env: 'DISCORD_ROLE_VERIFIED',
    label: 'Verified Shark Owner',
    about: 'Has a verified shark',
    earned: (facts: Facts) => facts.verifiedSharks > 0,
  },
  { key: 'matched', env: 'DISCORD_ROLE_MATCHED', label: 'Matched', about: 'One of their sharks has a match', earned: (facts: Facts) => facts.matched },
  {
    key: 'moderator',
    env: 'DISCORD_ROLE_MODERATOR',
    label: 'Site Moderator',
    // Admins moderate too, as on the site, so they have this as well as Site Admin.
    about: 'Moderates Tinderhaj',
    earned: (facts: Facts) => facts.moderator,
  },
  { key: 'admin', env: 'DISCORD_ROLE_ADMIN', label: 'Site Admin', about: 'Runs Tinderhaj', earned: (facts: Facts) => facts.admin },
] as const;

export type DiscordRoleKey = (typeof DISCORD_ROLES)[number]['key'];

/** The roles set up on this site, with their ids on the server. */
function configuredRoles() {
  return DISCORD_ROLES.flatMap((role) => {
    const id = process.env[role.env];
    return id ? [{ ...role, id }] : [];
  });
}

/** Whether the site gives roles at all. */
export function discordRolesEnabled() {
  return !!process.env.DISCORD_BOT_TOKEN && !!process.env.DISCORD_GUILD_ID && configuredRoles().length > 0;
}

/** The roles there are to earn, and whether this account has, for the account page. Worked out here, without asking Discord. */
export async function discordRoleList(userId: string) {
  const known = await facts(userId);
  return configuredRoles().map(({ key, label, about, earned }) => ({ key, label, about, earned: !!known && earned(known) }));
}

class DiscordError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** One call to Discord as the bot, waiting out a rate limit once if it hits one. */
async function discord(method: 'GET' | 'PUT' | 'DELETE', path: string, retried = false): Promise<Response> {
  const response = await fetch(`https://discord.com/api/v10${path}`, {
    method,
    headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`, 'X-Audit-Log-Reason': 'Tinderhaj role sync' },
    signal: AbortSignal.timeout(8000),
  });
  if (response.status === 429 && !retried) {
    const { retry_after: wait = 1 } = (await response.json().catch(() => ({}))) as { retry_after?: number };
    await new Promise((resolve) => setTimeout(resolve, Math.min(wait, 5) * 1000));
    return discord(method, path, true);
  }
  return response;
}

/** The roles someone has on the server, or null if they aren't on it. */
async function memberRoles(discordId: string) {
  const response = await discord('GET', `/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordId}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new DiscordError(response.status, `Reading member ${discordId}: ${await response.text()}`);
  return new Set(((await response.json()) as { roles: string[] }).roles);
}

/** Gives `want` of the site's roles and takes back the rest, leaving roles the site doesn't manage alone. */
async function setRoles(discordId: string, have: Set<string>, want: Set<string>) {
  const guild = process.env.DISCORD_GUILD_ID;
  for (const { id } of configuredRoles()) {
    const method = want.has(id) && !have.has(id) ? 'PUT' : !want.has(id) && have.has(id) ? 'DELETE' : null;
    if (!method) continue;
    const response = await discord(method, `/guilds/${guild}/members/${discordId}/roles/${id}`);
    // 403: the bot lacks Manage Roles, or its role sits below this one.
    if (!response.ok) throw new DiscordError(response.status, `${method} role ${id} for ${discordId}: ${await response.text()}`);
  }
}

/** What's known about an account, for the roles it's earned. */
async function facts(userId: string): Promise<Facts | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, banned: true, banExpires: true } });
  // A banned account earns nothing while it lasts.
  if (!user || isBanned(user)) return null;

  // Sharks others can see, as on the hearts page (see liveProfileWhere; not imported, as that module reaches auth, which imports this one).
  const live = { status: 'VERIFIED' as const, user: notBannedWhere() };
  const [verifiedSharks, sent, received] = await Promise.all([
    prisma.profile.count({ where: { userId, status: 'VERIFIED' } }),
    prisma.heart.findMany({
      where: { from: { userId, status: 'VERIFIED' }, to: { ...live, userId: { not: userId } } },
      select: { fromProfileId: true, toProfileId: true },
    }),
    prisma.heart.findMany({
      where: { to: { userId, status: 'VERIFIED' }, from: { ...live, userId: { not: userId } } },
      select: { fromProfileId: true, toProfileId: true },
    }),
  ]);
  const back = new Set(received.map((heart) => `${heart.toProfileId}:${heart.fromProfileId}`));

  return {
    verifiedSharks,
    matched: sent.some((heart) => back.has(`${heart.fromProfileId}:${heart.toProfileId}`)),
    moderator: user.role === AccountRole.MODERATOR || user.role === AccountRole.ADMIN,
    admin: user.role === AccountRole.ADMIN,
  };
}

export type DiscordSync =
  | { status: 'off' }
  /** No Discord account connected. */
  | { status: 'unlinked' }
  /** Connected, but not on the server, so there's nobody to give roles to. */
  | { status: 'not-member' }
  | { status: 'synced'; roles: string[] }
  | { status: 'failed' };

/** Brings someone's roles on the server in line with what they've earned on the site, now. */
export async function syncDiscordRoles(userId: string): Promise<DiscordSync> {
  if (!discordRolesEnabled()) return { status: 'off' };

  const account = await prisma.account.findFirst({ where: { userId, providerId: 'discord' }, select: { accountId: true } });
  if (!account) return { status: 'unlinked' };

  try {
    const have = await memberRoles(account.accountId);
    if (!have) return { status: 'not-member' };

    const known = await facts(userId);
    const earned = known ? configuredRoles().filter((role) => role.earned(known)) : [];
    await setRoles(account.accountId, have, new Set(earned.map((role) => role.id)));
    return { status: 'synced', roles: earned.map((role) => role.label) };
  } catch (error) {
    console.error('Discord role sync failed', error);
    return { status: 'failed' };
  }
}

/** Takes back every role the site gave, from a Discord account that's no longer connected (or an account being deleted). */
export async function clearDiscordRoles(discordId: string) {
  if (!discordRolesEnabled()) return;
  try {
    const have = await memberRoles(discordId);
    if (have) await setRoles(discordId, have, new Set());
  } catch (error) {
    console.error('Discord role clear failed', error);
  }
}

/**
 * Syncs after the response has gone out, for things that change what someone's
 * earned (a shark verified, a match, a ban), so a slow Discord never holds them up.
 */
export function syncDiscordRolesLater(...userIds: string[]) {
  if (!discordRolesEnabled()) return;
  after(async () => {
    for (const userId of new Set(userIds)) await syncDiscordRoles(userId);
  });
}

/** clearDiscordRoles, after the response has gone out. */
export function clearDiscordRolesLater(discordId: string) {
  if (!discordRolesEnabled()) return;
  after(() => clearDiscordRoles(discordId));
}
