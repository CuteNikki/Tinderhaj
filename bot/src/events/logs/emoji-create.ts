import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange } from 'moderation/changes';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.GuildEmojiCreate,
  async execute(_client, emoji) {
    if (emoji.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    await logChange(emoji.guild, 'Emoji added', {
      actions: AuditLogEvent.EmojiCreate,
      targetId: emoji.id,
      what: `${emoji} ${code(`:${emoji.name}:`)}\n-# ${emoji.id}`,
      changes: [],
    });
  },
});
