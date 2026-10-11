import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { LOG_COLORS, log, quote, who } from 'moderation/log';
import { KEYS } from 'utility/keys';

/** A message edited by whoever sent it. Bots' and webhooks' are left out, as are links getting their previews. */
export default new Event({
  name: Events.MessageUpdate,
  async execute(_client, before, after) {
    if (after.guildId !== KEYS.DISCORD_GUILD_ID || after.channelId === KEYS.DISCORD_CHANNEL_LOG) return;
    if (after.partial) after = await after.fetch().catch(() => after);
    if (after.partial || after.author.bot || after.webhookId || !after.guild) return;
    // Discord also sends an update when a link gets its preview, with the text unchanged.
    if (!before.partial && before.content === after.content) return;

    await log(after.guild, 'Message edited', LOG_COLORS.message, [
      `${who(after.author)} in ${after.url}`,
      'divider',
      `**Before**\n${before.partial ? "-# Sent before I started, so I don't know." : before.content ? quote(before.content) : '-# Only attachments.'}`,
      `**After**\n${after.content ? quote(after.content) : '-# Only attachments.'}`,
    ]);
  },
});
