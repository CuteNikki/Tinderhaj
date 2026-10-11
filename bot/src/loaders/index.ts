import type { ClientEvents } from 'discord.js';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';

import { Button } from 'classes/base/button';
import type { ExtendedClient } from 'classes/base/client';
import { Command } from 'classes/base/command';
import { Event } from 'classes/base/event';
import { Modal } from 'classes/base/modal';
import { SelectMenu } from 'classes/base/select';

import { getButtonFiles, getCommandFiles, getEventFiles, getModalFiles, getSelectFiles } from 'utility/files';
import { logger, table } from 'utility/logger';

/**
 * Imports each file's default export from a folder, logs a table of what was
 * found, and hands back the ones that are what the folder should hold.
 */
async function loadFolder<T>(kind: string, files: string[], isValid: (value: unknown) => value is T, describe: (value: T) => string) {
  const startTime = performance.now();
  const tableData: { file: string; name: string; valid: string }[] = [];
  const loaded: T[] = [];

  await Promise.all(
    files.map(async (filePath) => {
      const file = filePath.split('/').slice(-2).join('/');
      const value = (await import(pathToFileURL(filePath).href)).default;
      if (isValid(value)) {
        loaded.push(value);
        tableData.push({ file, name: describe(value), valid: '✅' });
      } else {
        tableData.push({ file, name: 'undefined', valid: '❌' });
        logger.warn(`${kind} file ${filePath} doesn't export a ${kind}`);
      }
    }),
  );

  logger.info(`Loaded ${loaded.length} ${kind}${loaded.length === 1 ? '' : 's'} in ${Math.floor(performance.now() - startTime)}ms\n${table(tableData)}`);
  return loaded;
}

export async function loadCommands(client: ExtendedClient) {
  client.commands.clear();
  const commands = await loadFolder(
    'command',
    await getCommandFiles(),
    (value) => value instanceof Command,
    (command) => command.options.builder.name,
  );
  for (const command of commands) client.commands.set(command.options.builder.name, command);
}

export async function loadButtons(client: ExtendedClient) {
  client.buttons.clear();
  const buttons = await loadFolder(
    'button',
    await getButtonFiles(),
    (value) => value instanceof Button,
    (button) => button.options.customId,
  );
  for (const button of buttons) client.buttons.set(button.options.customId, button);
}

export async function loadModals(client: ExtendedClient) {
  client.modals.clear();
  const modals = await loadFolder(
    'modal',
    await getModalFiles(),
    (value) => value instanceof Modal,
    (modal) => modal.options.customId,
  );
  for (const modal of modals) client.modals.set(modal.options.customId, modal);
}

export async function loadSelectMenus(client: ExtendedClient) {
  client.selectMenus.clear();
  const selects = await loadFolder(
    'select menu',
    await getSelectFiles(),
    (value) => value instanceof SelectMenu,
    (select) => select.options.customId,
  );
  for (const select of selects) client.selectMenus.set(select.options.customId, select);
}

export async function loadEvents(client: ExtendedClient) {
  client.removeAllListeners();
  const events = await loadFolder(
    'event',
    await getEventFiles(),
    (value): value is Event<keyof ClientEvents> => value instanceof Event,
    (event) => `${event.options.rest ? 'rest:' : ''}${event.options.name}`,
  );
  for (const event of events) {
    const handler = (...args: ClientEvents[keyof ClientEvents]) => event.options.execute(client, ...args);
    // Both kinds of event are told apart by `rest`, so this cast only loses what the Event class already checked.
    const emitter = (event.options.rest ? client.rest : client) as unknown as NodeJS.EventEmitter;
    emitter[event.options.once ? 'once' : 'on'](event.options.name, handler as (...args: unknown[]) => void);
  }
}
