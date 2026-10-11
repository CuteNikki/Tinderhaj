import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { findByCustomId, run } from 'utility/interactions';

export default new Event({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isAnySelectMenu()) return;

    const selectMenu = findByCustomId(client.selectMenus, interaction.customId);
    if (!selectMenu) return;

    // Prefixed, since select menus, buttons, modals and commands can share a name.
    await run(client, interaction, `sel_${selectMenu.options.customId}`, selectMenu.options.cooldown, selectMenu.options.execute);
  },
});
