import { AuditLogEvent, Events, GuildVerificationLevel, GuildExplicitContentFilter } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, oldNew } from 'moderation/changes';
import { KEYS } from 'utility/keys';

/** The server's own settings changed: its name, pictures, safety settings and special channels. */
export default new Event({
  name: Events.GuildUpdate,
  async execute(_client, before, after) {
    if (after.id !== KEYS.DISCORD_GUILD_ID) return;
    const channel = (id: unknown) => (id ? `<#${id}>` : '*none*');
    const set = (value: unknown) => (value ? 'set' : '*none*');
    const changes = [
      oldNew('Name', before.name, after.name, { asName: true }),
      oldNew('Description', before.description, after.description),
      oldNew('Icon', before.icon, after.icon, { format: set }),
      oldNew('Banner', before.banner, after.banner, { format: set }),
      oldNew('Invite background', before.splash, after.splash, { format: set }),
      oldNew('Vanity link', before.vanityURLCode, after.vanityURLCode, { asName: true }),
      oldNew('Verification level', before.verificationLevel, after.verificationLevel, {
        format: (value) => GuildVerificationLevel[value as number] ?? String(value),
      }),
      oldNew('Explicit image filter', before.explicitContentFilter, after.explicitContentFilter, {
        format: (value) => GuildExplicitContentFilter[value as number] ?? String(value),
      }),
      oldNew('Inactive channel', before.afkChannelId, after.afkChannelId, { format: channel }),
      oldNew('Inactive after', before.afkTimeout, after.afkTimeout, { format: (value) => `${Number(value) / 60} minutes` }),
      oldNew('System messages channel', before.systemChannelId, after.systemChannelId, { format: channel }),
      oldNew('Rules channel', before.rulesChannelId, after.rulesChannelId, { format: channel }),
      oldNew('Community updates channel', before.publicUpdatesChannelId, after.publicUpdatesChannelId, { format: channel }),
      oldNew('Owner', before.ownerId, after.ownerId, { format: (value) => `<@${value}>` }),
    ];
    if (!changes.some(Boolean)) return;
    await logChange(after, 'Server updated', { actions: AuditLogEvent.GuildUpdate, targetId: after.id, changes });
  },
});
