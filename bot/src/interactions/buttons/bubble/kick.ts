import { Button } from 'classes/base/button';

import { controlledBubble } from 'bubbles/controls';
import { announce } from 'bubbles/panel';
import { COLORS, notice } from 'utility/replies';

/** Kick, after picking someone here: out for now, but they can come back. */
export default new Button({
  customId: 'bubble-kick',
  includeCustomId: true,
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;

    const member = bubble.channel.members.get(interaction.customId.split(':')[2]);
    if (!member) return interaction.update({ components: [notice("They've left already.", COLORS.bubble)] });

    await member.voice.disconnect(`Kicked from a bubble by ${interaction.user.tag}`);
    await interaction.update({
      components: [notice(`Kicked ${member}. To keep them from coming back, use Keep out.`, COLORS.bubble)],
      allowedMentions: { parse: [] },
    });
    await announce(bubble, `${interaction.member} kicked ${member}.`);
  },
});
