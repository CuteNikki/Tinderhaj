import type { ButtonInteraction } from 'discord.js';

/** A button, found by its custom id. */
export class Button {
  constructor(
    public options: {
      /** The button's custom id, or with `includeCustomId`, what comes before a `:` and some data, e.g. `review-verify:<shark id>`. */
      customId: string;
      includeCustomId?: boolean;
      /** How long, in milliseconds, before someone can press it again. Defaults to 3 seconds. */
      cooldown?: number;
      execute: (interaction: ButtonInteraction) => unknown;
    },
  ) {}
}
