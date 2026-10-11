import { Button } from 'classes/base/button';

import { changeBubble, isStaff } from 'bubbles/bubble';
import { controlledBubble } from 'bubbles/controls';
import { COLORS, notice } from 'utility/replies';

/** Keep out, after picking someone here: taken out, and they can't see or join it again. */
export default new Button({
  customId: 'bubble-keepout',
  includeCustomId: true,
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;

    const id = interaction.customId.split(':')[2];
    const member = await interaction.guild.members.fetch(id).catch(() => null);
    if (id === bubble.record.ownerId) return interaction.update({ components: [notice("The owner can't be kept out.", COLORS.error)] });
    if (member && isStaff(member)) return interaction.update({ components: [notice("Staff can join any bubble, so they can't be kept out.", COLORS.error)] });

    await interaction.deferUpdate();
    await changeBubble(bubble, interaction.member, { blocked: [...new Set([...bubble.record.blocked, id])] });
    await interaction.editReply({ components: [notice(`<@${id}> is kept out of this bubble now.`, COLORS.bubble)], allowedMentions: { parse: [] } });
  },
});
