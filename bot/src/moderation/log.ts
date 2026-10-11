import { ContainerBuilder, MessageFlags, SeparatorBuilder, TextDisplayBuilder, type Guild, type Message } from 'discord.js';

import { KEYS } from 'utility/keys';
import { logger } from 'utility/logger';

/**
 * The moderators' log, one channel (DISCORD_CHANNEL_LOG) for everything:
 * members coming and going, messages edited and deleted, moderation, voice,
 * and changes to the server. Each entry is a small card: a label in small caps,
 * then what happened, in the server's role colours by kind.
 */

export const LOG_COLORS = {
  /** Shark Friend. */
  join: 0x8cc8ff,
  leave: 0x7a8494,
  /** Verified Shark Owner. */
  message: 0x5aa8ee,
  /** Website Admin. */
  deleted: 0xe8475f,
  /** Website Moderator. */
  moderation: 0xff9f6b,
  /** Server Booster. */
  voice: 0x5fd4e6,
  /** Matched. */
  server: 0xf28bb0,
} as const;

/** One part of an entry: text, or a line between parts. */
export type LogPart = string | 'divider';

/**
 * Posts an entry in the log, if there is one. Mentions in it never ping.
 * Discord fits 4000 characters in a message, so very long parts are cut.
 */
export async function log(guild: Guild, label: string, accent: number, parts: LogPart[], files: LogFile[] = []) {
  if (!KEYS.DISCORD_CHANNEL_LOG) return;
  const channel = guild.channels.cache.get(KEYS.DISCORD_CHANNEL_LOG);
  if (!channel?.isSendable()) return;

  const container = new ContainerBuilder().setAccentColor(accent).addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${label.toUpperCase()}`));
  let room = 3_800;
  for (const part of parts) {
    if (part === 'divider') {
      container.addSeparatorComponents(new SeparatorBuilder());
      continue;
    }
    if (!part || room <= 0) continue;
    const text = part.length > room ? `${part.slice(0, room - 1)}…` : part;
    room -= text.length;
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(text));
  }

  const entry = await channel
    .send({ components: [container], flags: MessageFlags.IsComponentsV2, allowedMentions: { parse: [] } })
    .catch((err) => logger.error({ err }, 'Failed to post in the log'));
  if (!entry || !files.length) return;

  // Files go in a reply of their own, as plain attachments. On a message made of components, a file only shows
  // as a download card, in it or under it; a plain one gets Discord's preview, so it can be read where it is.
  await entry
    .reply({
      files: files.map((file) => ({ attachment: Buffer.from(file.text, 'utf8'), name: file.name })),
      allowedMentions: { parse: [], repliedUser: false },
    })
    .catch((err) => logger.error({ err }, 'Failed to attach a file in the log'));
}

/** A text file to attach to a log entry, e.g. what a purge deleted. */
export type LogFile = { name: string; text: string };

/**
 * Deleted messages as a text file, oldest first, with when, who and what each
 * said, and links to what was attached, so moderators can read it all later.
 */
export function transcript(messages: Message[], heading: string): LogFile {
  const time = (date: Date) => date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  const lines = [...messages]
    .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
    .flatMap((message) => [
      `[${time(message.createdAt)}] ${message.author.username} (${message.author.id})${message.author.bot ? ' [bot]' : ''}`,
      ...(message.content ? message.content.split('\n').map((line) => `    ${line}`) : []),
      ...message.attachments.map((file) => `    Attachment: ${file.name} ${file.url}`),
      ...message.stickers.map((sticker) => `    Sticker: ${sticker.name}`),
      ...(message.embeds.length ? [`    ${message.embeds.length} embed${message.embeds.length === 1 ? '' : 's'}`] : []),
      '',
    ]);
  return { name: `deleted-messages-${Date.now()}.txt`, text: [heading, '', ...lines].join('\n') };
}

/**
 * Messages a purge is deleting, so the bulk delete that follows isn't logged
 * a second time: the purge's own entry says who did it and has the file.
 */
export const purging = new Set<string>();

/** Someone, as a mention. */
export function who(user: { id: string }) {
  return `<@${user.id}>`;
}

/** A Discord timestamp, shown in each reader's own time: relative, or the full date and time. */
export function when(date: Date | number, style: 'R' | 'f' = 'R') {
  return `<t:${Math.floor(new Date(date).getTime() / 1000)}:${style}>`;
}

/** Text as a quote, so whatever it says can't break out of the entry. */
export function quote(text: string) {
  return text
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n');
}
