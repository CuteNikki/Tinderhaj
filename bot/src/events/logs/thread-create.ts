import { AuditLogEvent, ChannelType, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, mentionWithDetails } from 'moderation/changes';
import { KEYS } from 'utility/keys';

/** A thread, or a post in a forum, started. Discord also sends this for old threads the bot is let into, which are left out. */
export default new Event({
  name: Events.ThreadCreate,
  async execute(_client, thread, newlyCreated) {
    if (!newlyCreated || thread.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    const post = thread.parent?.type === ChannelType.GuildForum || thread.parent?.type === ChannelType.GuildMedia;
    await logChange(thread.guild, post ? 'Post created' : 'Thread created', {
      actions: AuditLogEvent.ThreadCreate,
      targetId: thread.id,
      what: mentionWithDetails(`${thread}`, thread.name, thread.id),
      changes: [thread.parentId && `**In:** <#${thread.parentId}>`, thread.type === ChannelType.PrivateThread && '**Private**'],
    });
  },
});
