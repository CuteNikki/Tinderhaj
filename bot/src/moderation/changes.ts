import { PermissionsBitField, type AuditLogEvent, type Guild } from 'discord.js';

import { whoDid } from 'moderation/audit';
import { LOG_COLORS, log, quote, who } from 'moderation/log';
import { code, escapeMarkdown } from 'utility/markdown';

/**
 * Changes to the server, as log entries: what changed, from the event Discord
 * sent, and who did it, from the audit log. The bot's own changes are left out
 * (bubbles change channels all the time, and the site gives roles).
 */

/** A change worth a line or two, or nothing if it didn't change. */
export type Change = string | false | null | undefined;

/**
 * Logs a change made to the server, with who made it. Waits for the audit log
 * entry that says, so it's posted a few seconds after the change.
 */
export async function logChange(
  guild: Guild,
  label: string,
  options: { actions: AuditLogEvent | AuditLogEvent[]; targetId: string | null; what?: string; changes: Change[]; note?: string },
) {
  const changes = options.changes.filter((change): change is string => !!change);
  if (!changes.length && !options.what) return;

  const doer = await whoDid(options.actions, options.targetId);
  if (doer?.id === guild.client.user.id) return;

  await log(guild, label, LOG_COLORS.server, [
    [doer ? `**By:** ${who(doer)}` : "-# Who did it isn't in the audit log.", options.what && `**What:** ${options.what}`, options.note && `-# ${options.note}`]
      .filter(Boolean)
      .join('\n'),
    changes.join('\n'),
    doer?.reason ? quote(doer.reason) : '',
  ]);
}

/** A mention, with the name and id in small print under it, which still say what it was once it's deleted. */
export function mentionWithDetails(mention: string, name: string | null | undefined, id: string) {
  return `${mention}\n-# ${name ? `${code(name)} · ` : ''}${id}`;
}

/** A value as it reads best: none, yes or no, or as it is. */
export function show(value: unknown, asName = false): string {
  if (value === undefined || value === null || value === '') return '*none*';
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  if (typeof value === 'string') return asName ? code(value) : escapeMarkdown(value.length > 300 ? `${value.slice(0, 299)}…` : value);
  return String(value);
}

/** "**Old X:** a" and "**New X:** b" on lines of their own, if it changed. */
export function oldNew(label: string, before: unknown, after: unknown, options: { asName?: boolean; format?: (value: unknown) => string } = {}): Change {
  // Discord gives an empty text, like a topic never set, as null in one payload and "" in the next.
  const empty = (value: unknown) => value == null || value === '';
  if (before === after || (empty(before) && empty(after))) return null;
  const format = options.format ?? ((value: unknown) => show(value, options.asName));
  return `**Old ${label}:** ${format(before)}\n**New ${label}:** ${format(after)}`;
}

/** Permission names as Discord's settings call them, "ModerateMembers" as "Timeout Members". */
export function permissionNames(bits: bigint) {
  const SHOWN_AS: Record<string, string> = { ModerateMembers: 'Timeout Members', ManageGuild: 'Manage Server' };
  return new PermissionsBitField(bits).toArray().map((name) => SHOWN_AS[name] ?? name.split(/(?=[A-Z])/).join(' '));
}

/** Which permissions were added and which taken away, between two sets. */
export function permissionChanges(before: bigint, after: bigint, labels = { added: 'Allowed', removed: 'No longer allowed' }): Change[] {
  const added = permissionNames(after & ~before);
  const removed = permissionNames(before & ~after);
  return [added.length > 0 && `**${labels.added}:** ${added.join(', ')}`, removed.length > 0 && `**${labels.removed}:** ${removed.join(', ')}`];
}
