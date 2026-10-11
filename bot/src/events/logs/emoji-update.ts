import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, oldNew } from 'moderation/changes';
import { KEYS } from 'utility/keys';

export default new Event({
  name: Events.GuildEmojiUpdate,
  async execute(_client, before, after) {
    if (after.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    const changes = [oldNew('Name', before.name, after.name, { asName: true })];
    if (!changes.some(Boolean)) return;
    await logChange(after.guild, 'Emoji updated', { actions: AuditLogEvent.EmojiUpdate, targetId: after.id, what: `${after}\n-# ${after.id}`, changes });
  },
});
