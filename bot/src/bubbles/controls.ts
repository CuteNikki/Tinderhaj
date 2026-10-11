import { MessageFlags, type AnySelectMenuInteraction, type ButtonInteraction, type ChatInputCommandInteraction, type ModalSubmitInteraction } from 'discord.js';

import { canChange, findBubble, hubChannel, tryAgain, type Bubble } from 'bubbles/bubble';
import { panel } from 'bubbles/panel';
import { fail } from 'utility/replies';

type Control = ButtonInteraction<'cached'> | AnySelectMenuInteraction<'cached'> | ModalSubmitInteraction<'cached'>;

/**
 * The bubble a control is for, from its custom id (`bubble-lock:<channel id>`),
 * if whoever used it may change it. Otherwise answers why not.
 */
export async function controlledBubble(interaction: Control) {
  const bubble = await findBubble(interaction.guild, interaction.customId.split(':')[1]);
  if (!bubble) {
    await fail(interaction, 'This bubble has popped.');
    return null;
  }
  if (!canChange(interaction.member, bubble)) {
    await fail(interaction, `Only <@${bubble.record.ownerId}> can change this bubble.`);
    return null;
  }
  return bubble;
}

/**
 * After a change made from a panel (deferred with deferUpdate): shows that
 * panel as it is now, and says so if Discord wouldn't rename the bubble yet.
 * The panel in the bubble's chat catches up on its own.
 */
export async function showChanged(interaction: Control, bubble: Bubble, result: { retryAt: Date } | void) {
  if (result) await fail(interaction, tryAgain(result.retryAt));
  await interaction.editReply(panel(bubble));
}

/** /bubble, and My bubble in the controls channel: the panel for the bubble you're in, just for you. */
export async function showOwnPanel(interaction: ButtonInteraction<'cached'> | ChatInputCommandInteraction<'cached'>) {
  const bubble = await findBubble(interaction.guild, interaction.member.voice.channelId);
  if (!bubble) {
    const hub = hubChannel(interaction.guild);
    return fail(interaction, `You're not in a bubble right now.${hub ? ` Join ${hub} to get a voice channel of your own.` : ''}`);
  }
  if (!canChange(interaction.member, bubble)) return fail(interaction, `This is <@${bubble.record.ownerId}>'s bubble, so only they can change it.`);
  const { components, allowedMentions } = panel(bubble);
  return interaction.reply({ components, allowedMentions, flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
}
