import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, oldNew } from 'moderation/changes';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.GuildStickerUpdate,
  async execute(_client, before, after) {
    if (!after.guild || after.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    const changes = [
      oldNew('Name', before.name, after.name, { asName: true }),
      oldNew('Description', before.description, after.description),
      oldNew('Related emoji', before.tags, after.tags),
    ];
    if (!changes.some(Boolean)) return;
    await logChange(after.guild, 'Sticker updated', {
      actions: AuditLogEvent.StickerUpdate,
      targetId: after.id,
      what: `${code(after.name)}\n-# ${after.id}`,
      changes,
    });
  },
});
