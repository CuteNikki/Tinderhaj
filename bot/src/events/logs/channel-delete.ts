import { AuditLogEvent, ChannelType, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, mentionWithDetails } from 'moderation/changes';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

/** A channel deleted. Bubbles popped by the bot are left out, like all its own changes. */
export default new Event({
  name: Events.ChannelDelete,
  async execute(_client, channel) {
    if (channel.isDMBased() || channel.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    const category = channel.type === ChannelType.GuildCategory;
    await logChange(channel.guild, category ? 'Category deleted' : 'Channel deleted', {
      actions: AuditLogEvent.ChannelDelete,
      targetId: channel.id,
      what: mentionWithDetails(`${channel}`, channel.name, channel.id),
      changes: [channel.parent && `**Category:** ${code(channel.parent.name)}`],
    });
  },
});
