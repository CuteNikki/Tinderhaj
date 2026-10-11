import { REST, Routes } from 'discord.js';
import { pathToFileURL } from 'node:url';

import { Command } from 'classes/base/command';

import { getCommandFiles } from 'utility/files';
import { KEYS } from 'utility/keys';

/**
 * `bun run register`: registers every command in interactions/commands on the
 * Tinderhaj server, replacing what was there, so one that's gone from the
 * folder goes from Discord too. Run it when commands are added, removed or
 * changed, not on every start: Discord keeps them, and limits how often
 * they can be created.
 */
const commands = [];
for (const filePath of await getCommandFiles()) {
  const command = (await import(pathToFileURL(filePath).href)).default;
  if (command instanceof Command) commands.push(command.options.builder.toJSON());
}

// The application id is the start of the token, base64.
const applicationId = Buffer.from(KEYS.DISCORD_BOT_TOKEN.split('.')[0], 'base64').toString();
const rest = new REST().setToken(KEYS.DISCORD_BOT_TOKEN);
await rest.put(Routes.applicationGuildCommands(applicationId, KEYS.DISCORD_GUILD_ID), { body: commands });
console.log(
  `Registered ${commands.length} command${commands.length === 1 ? '' : 's'} on the server: ${commands.map((command) => `/${command.name}`).join(', ')}`,
);
