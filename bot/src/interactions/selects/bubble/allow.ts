import { SelectMenu } from 'classes/base/select';

import { changeBubble } from 'bubbles/bubble';
import { controlledBubble, showChanged } from 'bubbles/controls';

/** Let in: shows who is, and picking sets the whole list, so leaving someone out takes them off it. */
export default new SelectMenu({
  customId: 'bubble-allow',
  includeCustomId: true,
  // Picking people is quick, several in a row; changes to a bubble wait their turn anyway (see queued).
  cooldown: 0,
  async execute(interaction) {
    if (!interaction.inCachedGuild() || !interaction.isUserSelectMenu()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;

    await interaction.deferUpdate();
    const allowed = interaction.users.filter((user) => !user.bot).map((user) => user.id);
    await showChanged(interaction, bubble, await changeBubble(bubble, interaction.member, { allowed }));
  },
});
