import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { performance } from 'node:perf_hooks';

import type { Button } from 'classes/base/button';
import type { Command } from 'classes/base/command';
import type { Modal } from 'classes/base/modal';
import type { SelectMenu } from 'classes/base/select';

import { isRenameLimit } from 'bubbles/bubble';
import { loadButtons, loadCommands, loadEvents, loadModals, loadSelectMenus } from 'loaders/index';
import { KEYS } from 'utility/keys';
import { logger } from 'utility/logger';

/** The bot: a client that knows its commands, buttons and modals, loaded from their folders. */
export class ExtendedClient extends Client {
  /** Commands by name. */
  commands = new Collection<string, Command>();
  /** Buttons by custom id. */
  buttons = new Collection<string, Button>();
  /** Modals by custom id. */
  modals = new Collection<string, Modal>();
  /** Select menus by custom id. */
  selectMenus = new Collection<string, SelectMenu>();
  /** For each command, button or modal, when each person last used it. */
  cooldowns = new Collection<string, Collection<string, number>>();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        // Privileged, turned on in the Developer Portal: joins and leaves, and what messages said, for the log.
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        // Audit log entries, for who did what to the server.
        GatewayIntentBits.GuildModeration,
        // Emojis, stickers, invites and events made, changed and deleted, for the log.
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildScheduledEvents,
      ],
      // Deletes and edits of messages from before the bot started, and leaves of members it never saw, still arrive.
      partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User],
      // Rather than wait minutes in a queue, tell the owner a bubble can't be renamed again yet.
      rest: { rejectOnRateLimit: isRenameLimit },
    });
    this.initialize();
  }

  private async initialize() {
    const startTime = performance.now();
    await Promise.all([loadCommands(this), loadEvents(this), loadButtons(this), loadModals(this), loadSelectMenus(this)]);
    logger.info(`Loaded everything in ${Math.floor(performance.now() - startTime)}ms!`);

    await this.login(KEYS.DISCORD_BOT_TOKEN);
  }
}
