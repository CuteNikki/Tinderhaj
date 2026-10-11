import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { LOG_COLORS, log, who } from 'moderation/log';
import { KEYS } from 'utility/keys';
import { code } from 'utility/markdown';

/**
 * Someone changing their username or display name on Discord itself, which
 * isn't in the server's audit log. Nickname changes on the server are, so
 * they're logged from there.
 */
export default new Event({
  name: Events.UserUpdate,
  async execute(client, before, after) {
    const guild = client.guilds.cache.get(KEYS.DISCORD_GUILD_ID);
    if (!guild?.members.cache.has(after.id) || before.partial) return;

    const name = (value: string | null) => (value ? code(value) : '*none*');
    const changes = [
      before.username !== after.username && `**Old Username:** ${name(before.username)}\n**New Username:** ${name(after.username)}`,
      before.globalName !== after.globalName && `**Old Display name:** ${name(before.globalName)}\n**New Display name:** ${name(after.globalName)}`,
    ].filter(Boolean);
    if (!changes.length) return;
    await log(guild, 'Name changed', LOG_COLORS.join, [[who(after), ...changes].join('\n')]);
  },
});
