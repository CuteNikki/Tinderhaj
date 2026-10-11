import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange } from 'moderation/changes';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.GuildEmojiDelete,
  async execute(_client, emoji) {
    if (emoji.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    // Gone, so shown by name and a link to its picture rather than itself.
    await logChange(emoji.guild, 'Emoji deleted', {
      actions: AuditLogEvent.EmojiDelete,
      targetId: emoji.id,
      what: `${code(`:${emoji.name}:`)} · [picture](${emoji.imageURL()})\n-# ${emoji.id}`,
      changes: [],
    });
  },
});
