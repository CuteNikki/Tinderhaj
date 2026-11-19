import { showOwnPanel } from '@/bubbles/controls';
import { Button } from '@/classes/base/button';

/** My bubble, in the bubble controls channel. */
export default new Button({
  customId: 'bubble-controls',
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    await showOwnPanel(interaction);
  },
});
