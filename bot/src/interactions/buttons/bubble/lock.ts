import { Button } from 'classes/base/button';

import { changeBubble } from 'bubbles/bubble';
import { controlledBubble, showChanged } from 'bubbles/controls';

export default new Button({
  customId: 'bubble-lock',
  includeCustomId: true,
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;
    await interaction.deferUpdate();
    await showChanged(interaction, bubble, await changeBubble(bubble, interaction.member, { locked: !bubble.record.locked }));
  },
});
