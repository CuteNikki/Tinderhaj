import type { AnySelectMenuInteraction } from 'discord.js';

/** A select menu, found by its custom id like a button. */
export class SelectMenu {
  constructor(
    public options: {
      /** The select menu's custom id, or with `includeCustomId`, what comes before a `:` and some data. */
      customId: string;
      includeCustomId?: boolean;
      /** How long, in milliseconds, before someone can use it again. Defaults to 3 seconds. */
      cooldown?: number;
      execute: (interaction: AnySelectMenuInteraction) => unknown;
    },
  ) {}
}
