import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  UserSelectMenuBuilder,
  type Guild,
} from 'discord.js';

import type { Bubble } from 'bubbles/bubble';
import { prisma } from 'database/index';
import { KEYS } from 'utility/keys';
import { logger } from 'utility/logger';
import { COLORS, notice } from 'utility/replies';

/**
 * A bubble's control panel: what it's like right now and everything that
 * changes it, in one message at the top of its chat, edited whenever anything
 * does. The same panel can be shown to its owner anywhere (/bubble, or the
 * bubble controls channel), since every control says which bubble it's for.
 */

/** The panel for a bubble, as it is now. */
export function panel({ channel, record }: Bubble) {
  const id = channel.id;
  const here = channel.members.filter((member) => !member.user.bot);
  const others = here.filter((member) => member.id !== record.ownerId);

  const button = (action: string, label: string, emoji: string, style = ButtonStyle.Secondary) =>
    new ButtonBuilder().setCustomId(`bubble-${action}:${id}`).setLabel(label).setEmoji(emoji).setStyle(style);
  const heading = (text: string) => new TextDisplayBuilder().setContent(`-# ${text}`);
  const allowed = new UserSelectMenuBuilder().setCustomId(`bubble-allow:${id}`).setPlaceholder('Pick who to let in').setMinValues(0).setMaxValues(25);
  if (record.allowed.length) allowed.setDefaultUsers(record.allowed.slice(0, 25));
  const blocked = new UserSelectMenuBuilder().setCustomId(`bubble-block:${id}`).setPlaceholder('Pick who to keep out').setMinValues(0).setMaxValues(25);
  if (record.blocked.length) blocked.setDefaultUsers(record.blocked.slice(0, 25));
  // Always there, so the panel doesn't change shape when someone joins; greyed out until there's someone to pick.
  const someone = new StringSelectMenuBuilder().setCustomId(`bubble-member:${id}`);
  if (others.size) {
    someone
      .setPlaceholder('Kick, keep out or hand over')
      .addOptions(others.first(25).map((member) => ({ label: member.displayName.slice(0, 100), value: member.id })));
  } else {
    someone.setPlaceholder('Nobody else is here yet').addOptions({ label: 'Nobody', value: 'nobody' }).setDisabled(true);
  }

  const details = [
    '-# BUBBLE',
    `**Owner:** <@${record.ownerId}>${here.has(record.ownerId) ? '' : ' (stepped out)'}`,
    `**People:** ${here.size}${channel.userLimit ? ` of ${channel.userLimit}` : ''}`,
    `**Lock:** ${record.locked ? 'Closed' : 'Open'}`,
    `**Visibility:** ${record.hidden ? 'Hidden' : 'Shown'}`,
  ];

  const container = new ContainerBuilder()
    .setAccentColor(COLORS.bubble)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(details.join('\n')))
    .addActionRowComponents(
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        record.locked ? button('lock', 'Unlock', '🔓') : button('lock', 'Lock', '🔒'),
        record.hidden ? button('hide', 'Show', '👀') : button('hide', 'Hide', '🙈'),
        button('edit', 'Edit', '✏️'),
        button('pop', 'Pop', '🫧', ButtonStyle.Danger),
      ),
    )
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
    .addTextDisplayComponents(heading('LET IN'))
    .addActionRowComponents(new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(allowed))
    .addTextDisplayComponents(heading('KEPT OUT'))
    .addActionRowComponents(new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(blocked))
    .addTextDisplayComponents(heading('SOMEONE HERE'))
    .addActionRowComponents(new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(someone));

  // The owner's mention pings them when the panel is posted, so they find their controls. Edits keep it
  // allowed too: an edit that didn't would take the mention (and its notification) back, and edits never ping.
  return { components: [container], flags: MessageFlags.IsComponentsV2, allowedMentions: { users: [record.ownerId] } } as const;
}

/** Posts a new bubble's panel in its chat, and remembers it to keep it up to date. */
export async function postPanel(bubble: Bubble) {
  const message = await bubble.channel.send(panel(bubble)).catch((err) => {
    logger.error({ err }, 'Failed to post bubble panel');
    return null;
  });
  if (message) bubble.record = await prisma.bubble.update({ where: { channelId: bubble.channel.id }, data: { panelMessageId: message.id } });
}

const pending = new Map<string, NodeJS.Timeout>();

/**
 * Brings a bubble's panel up to date, a moment after the last change, so a
 * few people joining at once edit it once. Posts it again if someone deleted it.
 */
export function refreshPanel(bubble: Bubble) {
  clearTimeout(pending.get(bubble.channel.id));
  pending.set(
    bubble.channel.id,
    setTimeout(async () => {
      pending.delete(bubble.channel.id);
      try {
        // Read again, in case the bubble changed or popped since.
        const record = await prisma.bubble.findUnique({ where: { channelId: bubble.channel.id } });
        if (!record || !bubble.channel.guild.channels.cache.has(bubble.channel.id)) return;
        const current = { channel: bubble.channel, record };
        // Not posted yet: blowBubble is posting it right now, and posting here too would make two.
        if (!record.panelMessageId) return;
        await bubble.channel.messages.edit(record.panelMessageId, panel(current)).catch(async (err) => {
          logger.debug({ err }, 'Bubble panel gone, posting it again');
          await postPanel(current);
        });
      } catch (err) {
        logger.error({ err }, 'Failed to refresh bubble panel');
      }
    }, 1_000),
  );
}

/** A note in a bubble's chat for everyone there, e.g. who owns it now. Mentions in it only ping those in `ping`. */
export async function announce(bubble: Bubble, text: string, ping: string[] = []) {
  await bubble.channel
    .send({ components: [notice(text, COLORS.bubble)], flags: MessageFlags.IsComponentsV2, allowedMentions: { users: ping } })
    .catch((err) => logger.error({ err }, 'Failed to post in bubble'));
}

/**
 * Keeps one message in the bubble controls channel with a button that shows
 * you the panel for the bubble you're in: edits the bot's own message there,
 * or posts it.
 */
export async function ensureControlsMessage(guild: Guild, hubId: string) {
  if (!KEYS.DISCORD_CHANNEL_BUBBLE_CONTROLS) return;
  const channel = await guild.channels.fetch(KEYS.DISCORD_CHANNEL_BUBBLE_CONTROLS).catch(() => null);
  if (!channel?.isTextBased()) {
    logger.warn('DISCORD_CHANNEL_BUBBLE_CONTROLS is not a text channel on the server');
    return;
  }

  // For someone who's never seen one: what a bubble is, how to get one, and what they can do with it.
  const section = (text: string) => new TextDisplayBuilder().setContent(text);
  const components = [
    new ContainerBuilder()
      .setAccentColor(COLORS.bubble)
      .addTextDisplayComponents(
        section(
          [
            '-# BUBBLES',
            '## A voice channel of your own',
            `Join <#${hubId}> and you get a voice channel just for you, called a bubble, and you're moved straight into it. It's yours to set up however you like, for as long as you're there.`,
          ].join('\n'),
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
      .addTextDisplayComponents(
        section(
          [
            '**What you can do with it**',
            '- Give it a name, and limit how many people can be in it',
            '- Lock it, so only people you let in can join',
            '- Hide it, so only people you let in can see it',
            '- Let friends in, keep someone out, kick someone, or hand it to someone else',
          ].join('\n'),
        ),
        section(
          [
            '**Where to change it**',
            "There's a panel at the top of your bubble's chat. While you're in your bubble, the button below or `/bubble` shows it too.",
          ].join('\n'),
        ),
        section(
          [
            '**When you leave**',
            "If you're gone for a little while, it goes to someone who's still there. Once everyone has left, it pops and disappears. Your next one starts with the same name and settings.",
          ].join('\n'),
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
      .addActionRowComponents(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder().setCustomId('bubble-controls').setLabel('Open my bubble controls').setEmoji('🫧').setStyle(ButtonStyle.Primary),
        ),
      ),
  ];
  const recent = await channel.messages.fetch({ limit: 50 }).catch(() => null);
  const existing = recent?.find((message) => message.author.id === guild.client.user.id && message.flags.has(MessageFlags.IsComponentsV2));
  if (existing) await existing.edit({ components, allowedMentions: { parse: [] } });
  else await channel.send({ components, flags: MessageFlags.IsComponentsV2, allowedMentions: { parse: [] } });
}
