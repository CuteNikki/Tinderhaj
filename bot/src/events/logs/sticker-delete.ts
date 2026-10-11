import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange } from 'moderation/changes';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.GuildStickerDelete,
  async execute(_client, sticker) {
    if (!sticker.guild || sticker.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    await logChange(sticker.guild, 'Sticker deleted', {
      actions: AuditLogEvent.StickerDelete,
      targetId: sticker.id,
      what: `${code(sticker.name)}\n-# ${sticker.id}`,
      changes: [],
    });
  },
});
