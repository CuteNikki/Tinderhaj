/**
 * Settings from the environment, named as in the site's .env so both can
 * share one file. See the README's Discord bot section.
 */
function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not defined in the environment variables`);
  return value;
}

export const KEYS = {
  /** The same bot as the site's role sync, new sharks feed and review queue. */
  DISCORD_BOT_TOKEN: required('DISCORD_BOT_TOKEN'),
  /** The Tinderhaj server. Commands are registered there only. */
  DISCORD_GUILD_ID: required('DISCORD_GUILD_ID'),

  /** The site's database, which the bot reads directly and keeps its bubbles in. */
  DATABASE_URL: required('DATABASE_URL'),

  /** Where the site runs, for links to sharks. */
  SITE_URL: process.env.SITE_URL || 'https://tinderhaj.com',

  /** The voice channel to join to blow a bubble. Bubbles go in its category. Without it, join-to-create is off. */
  DISCORD_CHANNEL_JOIN_TO_CREATE: process.env.DISCORD_CHANNEL_JOIN_TO_CREATE,
  /** Optional: a text channel where the bot keeps a control panel for whichever bubble you're in. */
  DISCORD_CHANNEL_BUBBLE_CONTROLS: process.env.DISCORD_CHANNEL_BUBBLE_CONTROLS,

  /** The moderators' log: members, messages, moderation and changes to the server. Without it, nothing is logged. */
  DISCORD_CHANNEL_LOG: process.env.DISCORD_CHANNEL_LOG,
} as const;
