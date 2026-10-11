import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { findByCustomId, run } from 'utility/interactions';

export default new Event({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isButton()) return;

    const button = findByCustomId(client.buttons, interaction.customId);
    if (!button) return;

    // Prefixed, since buttons, modals and commands can share a name.
    await run(client, interaction, `btn_${button.options.customId}`, button.options.cooldown, button.options.execute);
  },
});
