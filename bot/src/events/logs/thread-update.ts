import { AuditLogEvent, Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { logChange, mentionWithDetails, oldNew } from 'moderation/changes';
import { KEYS } from 'utility/keys';

/**
 * A thread renamed, closed, locked or retagged. One closing because nobody
 * spoke in it for a while has nobody who closed it, which the entry says.
 */
export default new Event({
  name: Events.ThreadUpdate,
  async execute(_client, before, after) {
    if (after.guild.id !== KEYS.DISCORD_GUILD_ID) return;
    const tagName = (id: string) =>
      after.parent && 'availableTags' in after.parent ? (after.parent.availableTags.find((tag) => tag.id === id)?.name ?? id) : id;
    const tags = (ids: unknown) => ((ids as string[]).length ? (ids as string[]).map(tagName).join(', ') : '*none*');
    const changes = [
      oldNew('Name', before.name, after.name, { asName: true }),
      oldNew('Closed', before.archived, after.archived),
      oldNew('Locked', before.locked, after.locked),
      oldNew('Slowmode', before.rateLimitPerUser, after.rateLimitPerUser, { format: (value) => (value ? `${value} seconds` : 'off') }),
      before.appliedTags.join() !== after.appliedTags.join() && oldNew('Tags', before.appliedTags, after.appliedTags, { format: tags }),
    ];
    if (!changes.some(Boolean)) return;
    await logChange(after.guild, 'Thread updated', {
      actions: AuditLogEvent.ThreadUpdate,
      targetId: after.id,
      what: mentionWithDetails(`${after}`, after.name, after.id),
      changes,
    });
  },
});
