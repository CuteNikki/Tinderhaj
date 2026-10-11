import { InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { showOwnPanel } from 'bubbles/controls';

export default new Command({
  builder: new SlashCommandBuilder().setName('bubble').setDescription("Show the controls for the bubble you're in").setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    await showOwnPanel(interaction);
  },
});
