// The generated enum is a plain object, safe to use in the browser too.
import { AccountRole } from '@/generated/enums';

export { AccountRole };

/** Highest first, as the roles page lists them. */
export const ROLES = [AccountRole.ADMIN, AccountRole.MODERATOR, AccountRole.USER] as const;

export const ROLE_LABELS: Record<AccountRole, string> = {
  ADMIN: 'Admin',
  MODERATOR: 'Moderator',
  USER: 'User',
};

export const ROLE_DESCRIPTIONS: Record<AccountRole, string> = {
  ADMIN: 'Reviews profiles and changes roles.',
  MODERATOR: 'Reviews profiles and sees who has which role.',
  USER: 'Creates and manages their own profiles.',
};

/** Checks a role that comes from outside the type system, e.g. a URL or form. */
export function isRole(value: unknown): value is AccountRole {
  return ROLES.includes(value as AccountRole);
}

export function isAdmin(role: string | null | undefined) {
  return role === AccountRole.ADMIN;
}

/**
 * Who can ban whom: moderators ban users, admins also ban moderators, and
 * nobody bans an admin. Nobody bans themselves either; callers check that.
 */
export function canBan(actorRole: string | null | undefined, targetRole: AccountRole) {
  if (targetRole === AccountRole.ADMIN) return false;
  if (actorRole === AccountRole.ADMIN) return true;
  return actorRole === AccountRole.MODERATOR && targetRole === AccountRole.USER;
}

/** Admins sign others out, send them password resets and delete them, never another admin's account. */
export function canManageAccount(actorRole: string | null | undefined, targetRole: AccountRole) {
  return isAdmin(actorRole) && targetRole !== AccountRole.ADMIN;
}
