import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { LOG_COLORS, log, purging, quote, who } from 'moderation/log';
import { KEYS } from 'utility/keys';
import { escapeMarkdown, listOf } from 'utility/markdown';

/**
 * A message deleted. Who deleted it isn't said here: if it was someone else,
 * the audit log has it, and that's logged too.
 */
export default new Event({
  name: Events.MessageDelete,
  async execute(_client, message) {
    if (message.guildId !== KEYS.DISCORD_GUILD_ID || message.channelId === KEYS.DISCORD_CHANNEL_LOG || !message.guild) return;
    if (message.author?.bot || message.webhookId) return;
    // A /purge of one message deletes it alone rather than in bulk; the purge's own entry already says so.
    if (purging.has(message.id)) return;

    // Sent before the bot started, so it never saw it: only where it was is known.
    if (message.partial) {
      await log(message.guild, 'Message deleted', LOG_COLORS.deleted, [
        `A message in <#${message.channelId}>\n-# Sent before I started, so I don't know who sent it or what it said.`,
      ]);
      return;
    }

    const files = message.attachments.map((file) => escapeMarkdown(file.name));
    await log(message.guild, 'Message deleted', LOG_COLORS.deleted, [
      `${who(message.author)} in <#${message.channelId}>`,
      'divider',
      message.content ? quote(message.content) : '',
      files.length ? `**Attachments:** ${listOf(files)}` : '',
      message.stickers.size ? `**Stickers:** ${listOf(message.stickers.map((sticker) => escapeMarkdown(sticker.name)))}` : '',
    ]);
  },
});
