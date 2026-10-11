import { ContainerBuilder, MessageFlags, TextDisplayBuilder, type RepliableInteraction } from 'discord.js';

/** Accents in the server's role colours: Server Booster, Verified Shark Owner and Website Admin. */
export const COLORS = { bubble: 0x5fd4e6, info: 0x5aa8ee, error: 0xe8475f } as const;

/** A short message in a container, the way the server's other bot messages look. */
export function notice(text: string, accent: number = COLORS.info) {
  return new ContainerBuilder().setAccentColor(accent).addTextDisplayComponents(new TextDisplayBuilder().setContent(text));
}

/**
 * Answers an interaction with a notice, replying, filling in a deferred reply
 * or following up as it allows. Private (ephemeral) unless `everyone` is set,
 * or a deferred reply says otherwise; mentions in it never ping.
 */
export async function answer(interaction: RepliableInteraction, text: string, options: { accent?: number; everyone?: boolean } = {}) {
  const message = {
    components: [notice(text, options.accent)],
    flags: options.everyone ? MessageFlags.IsComponentsV2 : MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
    allowedMentions: { parse: [] },
  } as const;
  // After deferUpdate (which leaves `ephemeral` unset), the message is a panel or card that mustn't be overwritten.
  if (interaction.replied || (interaction.deferred && interaction.ephemeral === null)) return interaction.followUp(message);
  // A deferred reply was already made for everyone or not; this fills it in.
  if (interaction.deferred)
    return interaction.editReply({ components: message.components, flags: MessageFlags.IsComponentsV2, allowedMentions: message.allowedMentions });
  return interaction.reply(message);
}

/** answer() for something that went wrong. */
export function fail(interaction: RepliableInteraction, text: string) {
  return answer(interaction, text, { accent: COLORS.error });
}
