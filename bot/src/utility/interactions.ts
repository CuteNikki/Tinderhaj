import {
  Collection,
  time,
  TimestampStyles,
  type AnySelectMenuInteraction,
  type ButtonInteraction,
  type ChatInputCommandInteraction,
  type ModalSubmitInteraction,
} from 'discord.js';

import type { ExtendedClient } from 'classes/base/client';

import { logger } from 'utility/logger';
import { fail } from 'utility/replies';

/** A button, modal or select menu by its custom id: exactly, or by what comes before a `:` for one with `includeCustomId`. */
export function findByCustomId<T extends { options: { customId: string; includeCustomId?: boolean } }>(items: Collection<string, T>, customId: string) {
  return items.get(customId) ?? items.find((item) => item.options.includeCustomId && customId.startsWith(`${item.options.customId}:`));
}

/**
 * Runs a command, button, modal or select menu for someone: waits out its cooldown, and
 * if it throws, logs it and tells them something went wrong.
 */
export async function run<T extends ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction>(
  client: ExtendedClient,
  interaction: T,
  /** What the cooldown is kept under, e.g. `btn_bubble-lock`, since a command and a button can share a name. */
  key: string,
  cooldown: number | undefined,
  execute: (interaction: T) => unknown,
) {
  const amount = cooldown ?? 3_000;
  // A cooldown of 0 is none at all, not one that still catches two uses in the same millisecond.
  if (amount > 0) {
    if (!client.cooldowns.has(key)) client.cooldowns.set(key, new Collection());
    const timestamps = client.cooldowns.get(key)!;
    const now = Date.now();
    const until = (timestamps.get(interaction.user.id) ?? 0) + amount;

    if (now <= until) {
      await fail(interaction, `Slow down a little! You can do that again ${time(Math.round(until / 1_000), TimestampStyles.RelativeTime)}.`).catch((err) =>
        logger.debug({ err }, 'Error while replying to interaction'),
      );
      return;
    }
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), amount);
  }

  try {
    await execute(interaction);
  } catch (err) {
    logger.error({ err, key }, 'Error while running interaction');
    await fail(interaction, 'Something went wrong. Please try again in a moment.').catch((err) => logger.debug({ err }, 'Error while replying to interaction'));
  }
}
