import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';

import { SelectMenu } from 'classes/base/select';

import { controlledBubble } from 'bubbles/controls';
import { COLORS, notice } from 'utility/replies';

/** Someone here: asks what to do about them, just for whoever picked. */
export default new SelectMenu({
  customId: 'bubble-member',
  includeCustomId: true,
  // Picking people is quick, several in a row; changes to a bubble wait their turn anyway (see queued).
  cooldown: 0,
  async execute(interaction) {
    if (!interaction.inCachedGuild() || !interaction.isStringSelectMenu()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;

    const target = interaction.values[0];
    const button = (action: string, label: string, style: ButtonStyle) =>
      new ButtonBuilder().setCustomId(`bubble-${action}:${bubble.channel.id}:${target}`).setLabel(label).setStyle(style);
    await interaction.reply({
      components: [
        notice(`What about <@${target}>?`, COLORS.bubble).addActionRowComponents(
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            button('handover', 'Hand over the bubble', ButtonStyle.Primary),
            button('kick', 'Kick', ButtonStyle.Secondary),
            button('keepout', 'Keep out', ButtonStyle.Danger),
          ),
        ),
      ],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
      allowedMentions: { parse: [] },
    });
  },
});
