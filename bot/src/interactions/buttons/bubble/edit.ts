import { LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

import { Button } from 'classes/base/button';

import { bubbleLabel, LABEL_MAX } from 'bubbles/bubble';
import { controlledBubble } from 'bubbles/controls';

export default new Button({
  customId: 'bubble-edit',
  includeCustomId: true,
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const bubble = await controlledBubble(interaction);
    if (!bubble) return;

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(`bubble-edit:${bubble.channel.id}`)
        .setTitle('Name and limit')
        .addLabelComponents(
          new LabelBuilder()
            .setLabel('Name (empty for the default)')
            .setTextInputComponent(
              new TextInputBuilder()
                .setCustomId('name')
                .setValue(bubbleLabel(bubble.channel.name))
                .setMaxLength(LABEL_MAX)
                .setStyle(TextInputStyle.Short)
                .setRequired(false),
            ),
          new LabelBuilder().setLabel('User limit (empty for none)').setTextInputComponent(limitInput(bubble.channel.userLimit)),
        ),
    );
  },
});

/** The limit field: empty while there's no limit, rather than a 0 to clear first. Left out, not set to "", when empty. */
function limitInput(userLimit: number) {
  const input = new TextInputBuilder().setCustomId('limit').setMaxLength(2).setStyle(TextInputStyle.Short).setRequired(false);
  return userLimit ? input.setValue(String(userLimit)) : input;
}
