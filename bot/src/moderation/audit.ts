import type { AuditLogEvent, GuildAuditLogsEntry } from 'discord.js';

/**
 * Who did something, for the log. Changes are logged from the events Discord
 * sends (which say exactly what changed), but those don't say who made them:
 * the audit log does, a moment later. So every audit log entry the bot gets
 * is kept for a minute, and an event waits a little for the one that matches it.
 */

/** How long entries are kept, and how long an event waits for its entry. */
const KEEP = 60_000;
const WAIT = 3_000;

const recent: GuildAuditLogsEntry[] = [];
const waiting = new Set<() => void>();

/** Keeps an audit log entry for a minute, and wakes whatever's waiting for one. */
export function rememberAuditEntry(entry: GuildAuditLogsEntry) {
  recent.push(entry);
  while (recent.length && Date.now() - recent[0].createdTimestamp > KEEP) recent.shift();
  for (const wake of waiting) wake();
}

/** Who did something: whoever's in the audit log for it, and why, if they gave a reason. */
export type Doer = { id: string; reason: string | null };

/**
 * Who made a change, from its audit log entry: one of `actions`, about
 * `targetId` (or about nothing in particular, for actions without one), made in
 * the last few seconds. Waits a little for it to arrive. Null if none does,
 * e.g. if the bot can't view the audit log, or Discord didn't record it.
 */
export async function whoDid(actions: AuditLogEvent | AuditLogEvent[], targetId: string | null): Promise<Doer | null> {
  const types = new Set<number>(Array.isArray(actions) ? actions : [actions]);
  const find = () =>
    [...recent]
      .reverse()
      .find((entry) => types.has(entry.action) && (targetId === null || entry.targetId === targetId) && Date.now() - entry.createdTimestamp < 10_000);

  const found = find();
  if (found) return { id: found.executorId!, reason: found.reason };

  return new Promise((resolve) => {
    const done = (entry?: GuildAuditLogsEntry) => {
      waiting.delete(check);
      clearTimeout(timer);
      resolve(entry ? { id: entry.executorId!, reason: entry.reason } : null);
    };
    const check = () => {
      const entry = find();
      if (entry) done(entry);
    };
    const timer = setTimeout(() => done(), WAIT);
    waiting.add(check);
  });
}

/**
 * Channels dragged to another place in the list, which Discord's audit log
 * records as an action it doesn't document: who did it, and how many channels,
 * but not which ones. moderation/channel-moves.ts works out which.
 */
export const CHANNELS_MOVED = 16 as AuditLogEvent;
