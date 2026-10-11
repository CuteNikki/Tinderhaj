import type { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

/** A slash command: its builder, and what happens when someone uses it. */
export class Command {
  constructor(
    public options: {
      /** The command, as registered with Discord. */
      builder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
      /** How long, in milliseconds, before someone can use it again. Defaults to 3 seconds. */
      cooldown?: number;
      execute: (interaction: ChatInputCommandInteraction) => unknown;
    },
  ) {}
}
