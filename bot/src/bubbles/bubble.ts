import {
  ChannelType,
  OverwriteType,
  PermissionFlagsBits,
  RateLimitError,
  time,
  TimestampStyles,
  type CategoryChannel,
  type Guild,
  type GuildMember,
  type OverwriteData,
  type RateLimitData,
  type VoiceChannel,
} from 'discord.js';

import type { Bubble as BubbleRecord } from 'generated/client';

import { queued } from 'bubbles/queue';
import { announce, postPanel, refreshPanel } from 'bubbles/panel';
import { prisma } from 'database/index';
import { KEYS } from 'utility/keys';
import { logger } from 'utility/logger';
import { escapeMarkdown, listOf, mentionList } from 'utility/markdown';

/**
 * Bubbles: voice channels of your own, blown by joining the join-to-create
 * channel and popped once everyone's left. The database says which channels
 * are bubbles, who owns each, and who it's open to; the channel's permissions
 * are always worked out from that and the category, never read back, so what
 * the panel shows and what Discord does can't drift apart. Owners get no
 * permissions to manage the channel themselves: everything goes through the
 * bot, which checks who's asking.
 */

export type Bubble = { channel: VoiceChannel; record: BubbleRecord };

/** Who's let in even while it's locked or hidden, who's kept out, and whether it's locked or hidden. */
export type Access = Pick<BubbleRecord, 'locked' | 'hidden' | 'allowed' | 'blocked'>;

/** How long an owner can be gone (a dropped connection, a quick hop elsewhere) before their bubble goes to someone still there. */
const OWNER_GRACE = 30_000;
/** How long between bubbles for one person, so hopping in and out of join-to-create can't flood the server with channels. */
const BLOW_COOLDOWN = 10_000;

/** Permissions given and taken by locking (Connect) and hiding (ViewChannel). */
const CONNECT = PermissionFlagsBits.Connect;
const VIEW = PermissionFlagsBits.ViewChannel;
/** What the owner, and anyone let in, needs to be in the bubble even while it's locked or hidden. */
const MEMBER =
  VIEW | CONNECT | PermissionFlagsBits.Speak | PermissionFlagsBits.Stream | PermissionFlagsBits.SendMessages | PermissionFlagsBits.ReadMessageHistory;
/** What the bot needs on every bubble, as a member overwrite so no role overwrite it changes can lock it out of its own channel. */
const BOT =
  VIEW |
  CONNECT |
  PermissionFlagsBits.ManageChannels |
  PermissionFlagsBits.MoveMembers |
  PermissionFlagsBits.SendMessages |
  PermissionFlagsBits.EmbedLinks |
  PermissionFlagsBits.ReadMessageHistory;
/** Roles with any of these are staff: never locked or hidden out, and able to change anyone's bubble. */
const STAFF = PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ModerateMembers;

/** The join-to-create channel, if it's set up and on this server. */
export function hubChannel(guild: Guild) {
  const hub = KEYS.DISCORD_CHANNEL_JOIN_TO_CREATE ? guild.channels.cache.get(KEYS.DISCORD_CHANNEL_JOIN_TO_CREATE) : undefined;
  return hub?.type === ChannelType.GuildVoice ? hub : undefined;
}

/**
 * What every bubble's name starts with, so they all look alike and like the
 * server's other channels. Owners only name what comes after it.
 */
export const NAME_PREFIX = '🫧︱';
/** The longest name an owner can give, after the prefix, within Discord's channel name limit. */
export const LABEL_MAX = 100 - NAME_PREFIX.length;

/** A bubble's name, from what its owner calls it. */
export function bubbleName(label: string) {
  return `${NAME_PREFIX}${label.slice(0, LABEL_MAX)}`;
}

/** What a bubble's owner calls it: its name without the prefix, also taken off if they typed it themselves. */
export function bubbleLabel(name: string) {
  let label = name.trim();
  while (label.startsWith(NAME_PREFIX)) label = label.slice(NAME_PREFIX.length).trim();
  return label;
}

/** The bubble a channel id is, if it's one and still there. */
export async function findBubble(guild: Guild, channelId: string | null | undefined): Promise<Bubble | null> {
  if (!channelId) return null;
  const channel = guild.channels.cache.get(channelId);
  if (channel?.type !== ChannelType.GuildVoice) return null;
  const record = await prisma.bubble.findUnique({ where: { channelId } });
  return record ? { channel, record } : null;
}

/** People in a bubble, leaving out bots. */
export function people(channel: VoiceChannel) {
  return channel.members.filter((member) => !member.user.bot);
}

/** Whether someone is staff: always let through locks and hides, never kept out, and able to change anyone's bubble. */
export function isStaff(member: GuildMember) {
  return member.permissions.any(STAFF);
}

/** Whether someone may change a bubble: its owner, or staff. */
export function canChange(member: GuildMember, bubble: Bubble) {
  return member.id === bubble.record.ownerId || isStaff(member);
}

/**
 * A bubble's permission overwrites: the category's, so it's open to whoever
 * the category is, then locked or hidden by denying @everyone and each role
 * the category names (a role allowing it would win over @everyone), except
 * staff roles, which are let through instead. Then the bot, the owner, and
 * whoever's let in or kept out, as members, which win over roles.
 */
export function overwrites(guild: Guild, category: CategoryChannel | null, ownerId: string, access: Access): OverwriteData[] {
  const list = new Map<string, { id: string; type: OverwriteType; allow: bigint; deny: bigint }>();
  const set = (id: string, type: OverwriteType, allow: bigint, deny: bigint) => {
    const current = list.get(id) ?? { id, type, allow: 0n, deny: 0n };
    list.set(id, { id, type, allow: (current.allow & ~deny) | allow, deny: (current.deny & ~allow) | deny });
  };

  for (const overwrite of category?.permissionOverwrites.cache.values() ?? [])
    set(overwrite.id, overwrite.type, overwrite.allow.bitfield, overwrite.deny.bitfield);

  const closed = (access.locked ? CONNECT : 0n) | (access.hidden ? VIEW : 0n);
  if (closed) {
    set(guild.roles.everyone.id, OverwriteType.Role, 0n, closed);
    const staff = new Set(guild.roles.cache.filter((role) => role.permissions.any(STAFF)).keys());
    for (const overwrite of [...list.values()]) {
      if (overwrite.type === OverwriteType.Role && overwrite.id !== guild.roles.everyone.id && !staff.has(overwrite.id))
        set(overwrite.id, OverwriteType.Role, 0n, closed);
    }
    for (const id of staff) set(id, OverwriteType.Role, closed, 0n);
  }

  set(guild.client.user.id, OverwriteType.Member, BOT, 0n);
  for (const id of access.allowed) set(id, OverwriteType.Member, VIEW | CONNECT, 0n);
  for (const id of access.blocked) set(id, OverwriteType.Member, 0n, VIEW | CONNECT);
  set(ownerId, OverwriteType.Member, MEMBER, 0n);
  return [...list.values()];
}

/** Puts a bubble's permissions in line with its record. */
async function applyAccess(bubble: Bubble) {
  await bubble.channel.permissionOverwrites.set(
    overwrites(bubble.channel.guild, bubble.channel.parent, bubble.record.ownerId, bubble.record),
    'Bubble access changed',
  );
}

/** Only ids of people on the server: Discord refuses overwrites for anyone else. */
async function onServer(guild: Guild, ids: string[]) {
  const found = await Promise.all(
    ids.map((id) =>
      guild.members.fetch(id).then(
        () => id,
        () => null,
      ),
    ),
  );
  return found.filter((id): id is string => !!id);
}

const lastBlown = new Map<string, number>();

/**
 * Blows a bubble for someone who's joined the join-to-create channel, set up
 * the way they left their last one, and takes them into it. Someone who
 * already has one goes back to it instead.
 */
export function blowBubble(member: GuildMember): Promise<void> {
  return queued(`member:${member.id}`, async () => {
    const hub = hubChannel(member.guild);
    if (!hub || member.voice.channelId !== hub.id) return;

    for (const own of await prisma.bubble.findMany({ where: { ownerId: member.id } })) {
      const channel = member.guild.channels.cache.get(own.channelId);
      if (channel?.type === ChannelType.GuildVoice) {
        await member.voice.setChannel(channel, 'Back to their bubble');
        return;
      }
    }

    const wait = (lastBlown.get(member.id) ?? 0) + BLOW_COOLDOWN - Date.now();
    if (wait > 0) {
      // Still there once the cooldown's over, they get it then.
      setTimeout(() => blowBubble(member).catch((err) => logger.error({ err }, 'Failed to blow bubble')), wait);
      return;
    }
    lastBlown.set(member.id, Date.now());

    const settings = await prisma.bubbleSettings.findUnique({ where: { userId: member.id } });
    const access: Access = {
      locked: settings?.locked ?? false,
      hidden: settings?.hidden ?? false,
      allowed: await onServer(member.guild, settings?.allowed ?? []),
      blocked: await onServer(member.guild, settings?.blocked ?? []),
    };
    const channel = await member.guild.channels.create({
      name: bubbleName(settings?.name ?? member.displayName),
      type: ChannelType.GuildVoice,
      parent: hub.parentId,
      userLimit: settings?.userLimit ?? 0,
      permissionOverwrites: overwrites(member.guild, hub.parent, member.id, access),
      reason: `Bubble for ${member.user.tag}`,
    });
    const record = await prisma.bubble.create({ data: { channelId: channel.id, ownerId: member.id, ...access } });

    try {
      // They may have left while it was being made.
      if (member.voice.channelId !== hub.id) throw new Error('Left before their bubble was ready');
      await member.voice.setChannel(channel, 'Into their new bubble');
    } catch (err) {
      logger.debug({ err }, 'Popping a bubble nobody got into');
      await popBubble({ channel, record });
      return;
    }
    await postPanel({ channel, record });
  });
}

const ownerAway = new Map<string, NodeJS.Timeout>();

/**
 * After someone comes or goes: pops a bubble that's empty, and gives one whose
 * owner has been gone a little while to someone still there. Also run for
 * every bubble on start, for whatever happened while the bot was away.
 */
export function settleBubble(channel: VoiceChannel, ownerGrace = OWNER_GRACE): Promise<void> {
  return queued(`bubble:${channel.id}`, async () => {
    const bubble = await findBubble(channel.guild, channel.id);
    if (!bubble) return;
    const here = people(channel);

    if (!here.size) {
      await popBubble(bubble);
      return;
    }
    if (here.has(bubble.record.ownerId)) {
      clearTimeout(ownerAway.get(channel.id));
      ownerAway.delete(channel.id);
    } else if (!ownerGrace) {
      const [oldOwnerId, newOwner] = [bubble.record.ownerId, here.first()!];
      await handOver(bubble, newOwner.id);
      await announce(bubble, `<@${oldOwnerId}> left a while ago, so this bubble is ${newOwner}'s now.`, [newOwner.id]);
      return;
    } else if (!ownerAway.has(channel.id)) {
      ownerAway.set(
        channel.id,
        setTimeout(() => {
          ownerAway.delete(channel.id);
          settleBubble(channel, 0).catch((err) => logger.error({ err }, 'Failed to hand over bubble'));
        }, ownerGrace),
      );
    }
    refreshPanel(bubble);
  });
}

/** Deletes a bubble and forgets it. */
export async function popBubble(bubble: Bubble) {
  clearTimeout(ownerAway.get(bubble.channel.id));
  ownerAway.delete(bubble.channel.id);
  await prisma.bubble.deleteMany({ where: { channelId: bubble.channel.id } });
  await bubble.channel.delete('Bubble popped').catch((err) => logger.debug({ err }, 'Bubble was already gone'));
}

/** Forgets a bubble someone deleted by hand. */
export async function forgetBubble(channelId: string) {
  clearTimeout(ownerAway.get(channelId));
  ownerAway.delete(channelId);
  await prisma.bubble.deleteMany({ where: { channelId } });
}

/** Gives a bubble to someone else. */
export async function handOver(bubble: Bubble, newOwnerId: string) {
  bubble.record = await prisma.bubble.update({
    where: { channelId: bubble.channel.id },
    // The new owner is let in as owner, not on the list, and can't keep themselves out.
    data: {
      ownerId: newOwnerId,
      allowed: bubble.record.allowed.filter((id) => id !== newOwnerId),
      blocked: bubble.record.blocked.filter((id) => id !== newOwnerId),
    },
  });
  await applyAccess(bubble);
  refreshPanel(bubble);
}

/**
 * A change someone made to a bubble from its panel. Saved as the owner's
 * settings for next time when it's the owner who made it. Returns when it can
 * be tried again if Discord won't rename it yet.
 */
export function changeBubble(bubble: Bubble, by: GuildMember, change: Partial<Access> & { name?: string; userLimit?: number }) {
  return queued(`bubble:${bubble.channel.id}`, async (): Promise<{ retryAt: Date } | void> => {
    const { name, userLimit, ...access } = change;
    const before = { name: bubble.channel.name, userLimit: bubble.channel.userLimit, ...bubble.record };

    if ((name !== undefined && name !== bubble.channel.name) || (userLimit !== undefined && userLimit !== bubble.channel.userLimit)) {
      try {
        await bubble.channel.edit({ name, userLimit, reason: `Bubble changed by ${by.user.tag}` });
      } catch (err) {
        if (err instanceof RateLimitError) return { retryAt: new Date(Date.now() + err.timeToReset) };
        throw err;
      }
    }

    if (Object.keys(access).length) {
      // Nobody's both let in and kept out, and the owner is neither.
      const allowed = (access.allowed ?? bubble.record.allowed).filter((id) => id !== bubble.record.ownerId && !access.blocked?.includes(id));
      const blocked = (access.blocked ?? bubble.record.blocked).filter((id) => id !== bubble.record.ownerId && !access.allowed?.includes(id));
      bubble.record = await prisma.bubble.update({ where: { channelId: bubble.channel.id }, data: { ...access, allowed, blocked } });
      await applyAccess(bubble);
      // Anyone kept out who's still here has to go.
      for (const id of blocked) {
        const member = bubble.channel.members.get(id);
        if (member) await member.voice.disconnect('Kept out of a bubble').catch((err) => logger.error({ err }, 'Failed to remove kept out member'));
      }
    }

    if (by.id === bubble.record.ownerId) {
      const owner = bubble.channel.members.get(by.id) ?? by;
      const settings = {
        // Saved without the prefix, and not at all while it's still their display name, so it follows a new one.
        name: bubbleLabel(bubble.channel.name) === owner.displayName ? null : bubbleLabel(bubble.channel.name),
        userLimit: bubble.channel.userLimit,
        locked: bubble.record.locked,
        hidden: bubble.record.hidden,
        allowed: bubble.record.allowed,
        blocked: bubble.record.blocked,
      };
      await prisma.bubbleSettings.upsert({ where: { userId: by.id }, create: { userId: by.id, ...settings }, update: settings });
    }
    refreshPanel(bubble);

    const changes = describeChanges(before, { name: bubble.channel.name, userLimit: bubble.channel.userLimit, ...bubble.record });
    if (changes.length) await announce(bubble, `${by} ${listOf(changes)}.`);
  });
}

/** What changed about a bubble, as things someone did to it, for everyone in it to see. */
export function describeChanges(before: Access & { name: string; userLimit: number }, after: Access & { name: string; userLimit: number }) {
  const changes: string[] = [];
  const added = (from: string[], to: string[]) => to.filter((id) => !from.includes(id));

  if (after.name !== before.name) changes.push(`renamed this bubble to **${escapeMarkdown(bubbleLabel(after.name))}**`);
  if (after.userLimit !== before.userLimit) changes.push(after.userLimit ? `set the limit to ${after.userLimit}` : 'removed the limit');
  if (after.locked !== before.locked) changes.push(after.locked ? 'locked this bubble' : 'unlocked this bubble');
  if (after.hidden !== before.hidden) changes.push(after.hidden ? 'hid this bubble' : 'showed this bubble again');

  const letIn = added(before.allowed, after.allowed);
  const keptOut = added(before.blocked, after.blocked);
  // Moving someone from one list to the other is said once, as where they went.
  const noLongerLetIn = added(after.allowed, before.allowed).filter((id) => !keptOut.includes(id));
  const letBackIn = added(after.blocked, before.blocked).filter((id) => !letIn.includes(id));
  if (letIn.length) changes.push(`let in ${mentionList(letIn)}`);
  if (keptOut.length) changes.push(`kept out ${mentionList(keptOut)}`);
  if (noLongerLetIn.length) changes.push(`stopped letting in ${mentionList(noLongerLetIn)}`);
  if (letBackIn.length) changes.push(`stopped keeping out ${mentionList(letBackIn)}`);
  return changes;
}

/**
 * For the REST manager: Discord only lets a channel be renamed a couple of
 * times every ten minutes, and waiting that out would leave the owner looking
 * at a spinner. Such a wait throws a RateLimitError instead, for changeBubble.
 */
export function isRenameLimit(data: RateLimitData) {
  return data.method.toUpperCase() === 'PATCH' && data.route.startsWith('/channels/') && data.timeToReset > 5_000;
}

/** "Try again in …", for a bubble Discord won't rename yet. */
export function tryAgain(retryAt: Date) {
  return `Discord only lets a bubble be renamed so often. Try again ${time(retryAt, TimestampStyles.RelativeTime)}.`;
}
