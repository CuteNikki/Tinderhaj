import { Button } from 'classes/base/button';

import { handOver } from 'bubbles/bubble';
import { controlledBubble } from 'bubbles/controls';
import { announce } from 'bubbles/panel';
import { COLORS, notice } from 'utility/replies';

/** Hand over, after picking someone here. */
export default new Button({
  customId: 'bubble-handover',
  includeCustomId: true,
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;

    const member = bubble.channel.members.get(interaction.customId.split(':')[2]);
    // Someone who isn't there would own a bubble they can't look after.
    if (!member) return interaction.update({ components: [notice("They've left, so they can't have it.", COLORS.error)] });
    if (member.id === bubble.record.ownerId) {
      return interaction.update({ components: [notice(`It's ${member}'s already.`, COLORS.bubble)], allowedMentions: { parse: [] } });
    }

    await interaction.deferUpdate();
    const from = await handOver(bubble, interaction.member, member.id);
    if (!from) return interaction.editReply({ components: [notice('This bubble changed hands or popped in the meantime.', COLORS.error)] });
    await interaction.editReply({ components: [notice(`It's ${member}'s bubble now.`, COLORS.bubble)], allowedMentions: { parse: [] } });
    // Says who did it: staff can hand over anyone's bubble, including to themselves.
    const by = interaction.user.id;
    const text =
      by === from
        ? `<@${from}> handed this bubble to ${member}.`
        : by === member.id
          ? `${member} took over this bubble from <@${from}>.`
          : `<@${by}> gave this bubble to ${member}, from <@${from}>.`;
    // Pings the new owner, so they know the controls are theirs now.
    await announce(bubble, text, [member.id]);
  },
});
