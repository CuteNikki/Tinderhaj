import { SelectMenu } from 'classes/base/select';

import { changeBubble, isStaff } from 'bubbles/bubble';
import { controlledBubble, showChanged } from 'bubbles/controls';

/** Kept out: like Let in, the whole list. Anyone newly kept out who's in the bubble is taken out of it. */
export default new SelectMenu({
  customId: 'bubble-block',
  includeCustomId: true,
  // Picking people is quick, several in a row; changes to a bubble wait their turn anyway (see queued).
  cooldown: 0,
  async execute(interaction) {
    if (!interaction.inCachedGuild() || !interaction.isUserSelectMenu()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;

    await interaction.deferUpdate();
    // Staff are always let through, so keeping them out wouldn't do anything.
    const blocked = interaction.members.filter((member) => !member.user.bot && !isStaff(member)).map((member) => member.id);
    await showChanged(interaction, bubble, await changeBubble(bubble, interaction.member, { blocked }));
  },
});
