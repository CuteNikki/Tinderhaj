import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange } from 'moderation/changes';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.GuildStickerCreate,
  async execute(_client, sticker) {
    if (!sticker.guild || sticker.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    await logChange(sticker.guild, 'Sticker added', {
      actions: AuditLogEvent.StickerCreate,
      targetId: sticker.id,
      what: `${code(sticker.name)} · [picture](${sticker.url})\n-# ${sticker.id}`,
      changes: [],
    });
  },
});
