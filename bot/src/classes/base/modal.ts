import type { ModalSubmitInteraction } from 'discord.js';

/** A modal's submit, found by its custom id like a button. */
export class Modal {
  constructor(
    public options: {
      /** The modal's custom id, or with `includeCustomId`, what comes before a `:` and some data. */
      customId: string;
      includeCustomId?: boolean;
      /** How long, in milliseconds, before someone can submit it again. Defaults to 3 seconds. */
      cooldown?: number;
      execute: (interaction: ModalSubmitInteraction) => unknown;
    },
  ) {}
}
