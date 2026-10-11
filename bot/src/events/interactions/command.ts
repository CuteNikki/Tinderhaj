import { Events } from 'discord.js';

import { Event } from 'classes/base/event';

import { run } from 'utility/interactions';

export default new Event({
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    await run(client, interaction, interaction.commandName, command.options.cooldown, command.options.execute);
  },
});
