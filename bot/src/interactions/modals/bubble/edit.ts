import { Modal } from 'classes/base/modal';

import { bubbleLabel, bubbleName, changeBubble } from 'bubbles/bubble';
import { controlledBubble, showChanged } from 'bubbles/controls';
import { fail } from 'utility/replies';

export default new Modal({
  customId: 'bubble-edit',
  includeCustomId: true,
  async execute(interaction) {
    if (!interaction.inCachedGuild() || !interaction.isFromMessage()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;

    const limit = interaction.fields.getTextInputValue('limit').trim();
    if (!/^\d{1,2}$/.test(limit)) return fail(interaction, 'The limit needs to be a number up to 99, or 0 for no limit.');

    await interaction.deferUpdate();
    // Left empty, it goes back to the owner's display name (not whoever's changing it, if that's staff).
    const owner = await interaction.guild.members.fetch(bubble.record.ownerId).catch(() => null);
    const label = bubbleLabel(interaction.fields.getTextInputValue('name')) || owner?.displayName || bubbleLabel(bubble.channel.name);
    await showChanged(interaction, bubble, await changeBubble(bubble, interaction.member, { name: bubbleName(label), userLimit: Number(limit) }));
  },
});
