import { Events, type Message } from 'discord.js';

import { Event } from 'classes/base/event';

import { LOG_COLORS, log, purging, quote, transcript, who } from 'moderation/log';
import { KEYS } from 'utility/keys';

/** How many of the deleted messages are shown in the entry itself; all of them are in the file. */
const SHOWN = 5;

/**
 * Many messages deleted at once, e.g. by a ban that deletes what someone sent
 * lately, with a file of everything they said. A /purge logs itself instead,
 * with who did it.
 */
export default new Event({
  name: Events.MessageBulkDelete,
  async execute(_client, messages, channel) {
    if (channel.guildId !== KEYS.DISCORD_GUILD_ID || channel.id === KEYS.DISCORD_CHANNEL_LOG) return;
    if (messages.some((message) => purging.has(message.id))) return;

    // Only what the bot saw being sent: the rest it can only count.
    const known = [...messages.filter((message): message is Message<true> => !message.partial).values()];
    const lines = known
      .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
      .slice(0, SHOWN)
      .map((message) => `${who(message.author)}\n${quote(message.content || '*no text*')}`);
    await log(
      channel.guild,
      'Messages deleted',
      LOG_COLORS.deleted,
      [
        `**${messages.size}** messages in ${channel}`,
        'divider',
        lines.join('\n'),
        known.length > lines.length ? `-# The rest are in the file.` : '',
        messages.size > known.length ? `-# ${messages.size - known.length} were sent before I started, so I don't know what they said.` : '',
      ],
      known.length ? [transcript(known, `${messages.size} messages deleted from #${channel.name} (${channel.id}) on ${new Date().toISOString()}`)] : [],
    );
  },
});
