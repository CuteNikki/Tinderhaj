import { ChannelType, type Guild, type NonThreadGuildBasedChannel } from 'discord.js';

import { CHANNELS_MOVED } from 'moderation/audit';
import { logChange, mentionWithDetails, oldNew } from 'moderation/changes';
import { code } from 'utility/markdown';

/**
 * Channels dragged to another place in the list. Discord renumbers every
 * channel around one that's moved and sends an update for each, and its audit
 * log doesn't say which was moved either. So updates are gathered for a
 * moment, the order before and after is compared, and the channels that had
 * to move for one to become the other are the ones that were moved.
 */

/** Where each channel was before the updates being gathered, by id. */
const before = new Map<string, number>();
/** Channels that went to another category: the channel update logs that, so they're not logged as moved too. */
const recategorised = new Set<string>();
let timer: NodeJS.Timeout | undefined;

/** Notes a channel's place before an update that changed it, and settles the moves a moment after the last one. */
export function noteChannelMove(guild: Guild, channelId: string, oldPosition: number, newCategory: boolean) {
  if (!before.has(channelId)) before.set(channelId, oldPosition);
  if (newCategory) recategorised.add(channelId);
  clearTimeout(timer);
  timer = setTimeout(() => settleMoves(guild), 1_500);
}

/** Text-like channels are listed before voice-like ones in a category, so each is its own list. */
function listOf(channel: NonThreadGuildBasedChannel) {
  const voice = channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice;
  return `${channel.parentId ?? 'top'}:${channel.type === ChannelType.GuildCategory ? 'category' : voice ? 'voice' : 'text'}`;
}

/** The channels in `after` not in the longest run of channels both lists have in the same order. */
function moved(old: string[], now: string[]) {
  const table = Array.from({ length: old.length + 1 }, () => new Array<number>(now.length + 1).fill(0));
  for (let i = old.length - 1; i >= 0; i--)
    for (let j = now.length - 1; j >= 0; j--) table[i][j] = old[i] === now[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const kept = new Set<string>();
  for (let i = 0, j = 0; i < old.length && j < now.length;) {
    if (old[i] === now[j]) {
      kept.add(old[i]);
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) i++;
    else j++;
  }
  return now.filter((id) => !kept.has(id));
}

async function settleMoves(guild: Guild) {
  const positions = new Map(before);
  const skip = new Set(recategorised);
  before.clear();
  recategorised.clear();

  const channels = [...guild.channels.cache.values()].filter((channel): channel is NonThreadGuildBasedChannel => !channel.isThread());
  const lists = new Map<string, NonThreadGuildBasedChannel[]>();
  for (const channel of channels) lists.set(listOf(channel), [...(lists.get(listOf(channel)) ?? []), channel]);

  for (const list of lists.values()) {
    if (!list.some((channel) => positions.has(channel.id))) continue;
    const order = (position: (channel: NonThreadGuildBasedChannel) => number) =>
      [...list].sort((a, b) => position(a) - position(b) || (a.id < b.id ? -1 : 1)).map((channel) => channel.id);
    const old = order((channel) => positions.get(channel.id) ?? channel.rawPosition);
    const now = order((channel) => channel.rawPosition);

    for (const id of moved(old, now).filter((id) => !skip.has(id))) {
      const channel = guild.channels.cache.get(id) as NonThreadGuildBasedChannel;
      await logChange(guild, channel.type === ChannelType.GuildCategory ? 'Category moved' : 'Channel moved', {
        actions: CHANNELS_MOVED,
        targetId: null,
        what: mentionWithDetails(`${channel}`, channel.name, channel.id),
        changes: [oldNew('Position', old.indexOf(id) + 1, now.indexOf(id) + 1)],
        note: channel.parent ? `Counted within ${code(channel.parent.name)}` : 'Counted among the categories and channels outside them',
      });
    }
  }
}
