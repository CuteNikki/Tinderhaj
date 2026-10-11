import { Button } from 'classes/base/button';

import { popBubble } from 'bubbles/bubble';
import { controlledBubble } from 'bubbles/controls';
import { announce } from 'bubbles/panel';
import { logger } from 'utility/logger';

export default new Button({
  customId: 'bubble-pop',
  includeCustomId: true,
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;

    await interaction.deferUpdate();
    await announce(bubble, `🫧 ${interaction.member} popped this bubble. It's going away in a moment.`);
    // A moment for everyone in it to read that first.
    setTimeout(() => popBubble(bubble).catch((err) => logger.error({ err }, 'Failed to pop bubble')), 3_000);
  },
});
