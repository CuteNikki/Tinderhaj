import { AuditLogEvent, ChannelType, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, mentionWithDetails } from 'moderation/changes';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

export default new Event({
  name: Events.ChannelCreate,
  async execute(_client, channel) {
    if (channel.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    const category = channel.type === ChannelType.GuildCategory;
    await logChange(channel.guild, category ? 'Category created' : 'Channel created', {
      actions: AuditLogEvent.ChannelCreate,
      targetId: channel.id,
      what: mentionWithDetails(`${channel}`, channel.name, channel.id),
      changes: [channel.parent && `**Category:** ${code(channel.parent.name)}`],
    });
  },
});
