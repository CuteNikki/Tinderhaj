import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, oldNew } from 'moderation/changes';
import { who } from 'moderation/log';
import { KEYS } from 'utility/keys';
import { listOf } from 'utility/markdown';

/**
 * Someone's nickname or roles changed. Roles the site gives (the bot does
 * that) are left out, like all its own changes. Timeouts are moderation, kept
 * as cases from the audit log; boosts are logged by boost.ts.
 */
export default new Event({
  name: Events.GuildMemberUpdate,
  async execute(_client, before, after) {
    if (after.guild.id !== KEYS.DISCORD_GUILD_ID || before.partial) return;
    const given = after.roles.cache.filter((role) => !before.roles.cache.has(role.id)).map((role) => `${role}`);
    const taken = before.roles.cache.filter((role) => !after.roles.cache.has(role.id)).map((role) => `${role}`);
    const changes = [
      oldNew('Nickname', before.nickname, after.nickname, { asName: true }),
      given.length > 0 && `**Roles given:** ${listOf(given)}`,
      taken.length > 0 && `**Roles taken:** ${listOf(taken)}`,
    ];
    if (!changes.some(Boolean)) return;

    await logChange(after.guild, 'Member updated', {
      actions: [AuditLogEvent.MemberUpdate, AuditLogEvent.MemberRoleUpdate],
      targetId: after.id,
      what: who(after),
      changes,
    });
  },
});
