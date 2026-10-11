import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { findByCustomId, run } from 'utility/interactions';

export default new Event({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isModalSubmit()) return;

    const modal = findByCustomId(client.modals, interaction.customId);
    if (!modal) return;

    // Prefixed, since buttons, modals and commands can share a name.
    await run(client, interaction, `mdl_${modal.options.customId}`, modal.options.cooldown, modal.options.execute);
  },
});
