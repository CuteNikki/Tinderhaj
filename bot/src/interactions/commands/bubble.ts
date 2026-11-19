import { InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { showOwnPanel } from '@/bubbles/controls';
import { Command } from '@/classes/base/command';

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('bubble')
    .setDescription("Show the controls for the bubble you're in")
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    await showOwnPanel(interaction);
  },
});
