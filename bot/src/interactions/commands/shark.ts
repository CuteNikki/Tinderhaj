import { InteractionContextType, SlashCommandBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { prisma } from 'database/index';
import { KEYS } from 'utility/keys';
import { escapeMarkdown } from 'utility/markdown';
import { fail } from 'utility/replies';
import { warmSharedImage } from 'utility/warm';

/** Accounts that aren't banned right now, as notBannedWhere() on the site. */
const notBanned = () => ({ OR: [{ banned: false }, { banExpires: { lte: new Date() } }] });
/** Sharks others can see, as liveProfileWhere() on the site: verified, from accounts that aren't banned. */
const live = () => ({ status: 'VERIFIED' as const, user: notBanned() });
const SHARK = { id: true, displayName: true, user: { select: { username: true } } } as const;

/** A shark's page on the site, which Discord shows as its card. */
function sharkLink(shark: { id: string; user: { username: string } }) {
  return new URL(`/u/${shark.user.username}/${shark.id}`, KEYS.SITE_URL).href;
}

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('shark')
    .setDescription('Show sharks from Tinderhaj')
    .setContexts(InteractionContextType.Guild)
    .addSubcommand((sub) =>
      sub
        .setName('member')
        .setDescription("Someone's sharks, if they've connected Discord to Tinderhaj")
        .addUserOption((option) => option.setName('member').setDescription('Whose sharks to show. Leave it out for your own.')),
    )
    .addSubcommand((sub) => sub.setName('random').setDescription('A random shark from Tinderhaj')),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'random') {
      await interaction.deferReply();
      const count = await prisma.profile.count({ where: live() });
      const shark = count
        ? await prisma.profile.findFirst({ where: live(), select: SHARK, orderBy: { id: 'asc' }, skip: Math.floor(Math.random() * count) })
        : null;
      if (!shark) return interaction.editReply('No sharks on Tinderhaj yet!');
      await warmSharedImage(sharkLink(shark));
      // Only the link: Discord shows it as the shark's card.
      return interaction.editReply({ content: `🦈 Say hi to **${escapeMarkdown(shark.displayName)}**!\n${sharkLink(shark)}`, allowedMentions: { parse: [] } });
    }

    const user = interaction.options.getUser('member') ?? interaction.user;
    const self = user.id === interaction.user.id;
    // A banned account shows as not connected, which doesn't tell anyone it's banned.
    const account = await prisma.account.findFirst({
      where: { providerId: 'discord', accountId: user.id, user: notBanned() },
      select: { userId: true },
    });
    // Said the same either way for someone else, so this doesn't tell anyone whether they've connected.
    if (!account && self) return fail(interaction, 'Connect Discord to Tinderhaj first, under Sign-in methods in your account settings.');

    await interaction.deferReply();
    const sharks = account
      ? await prisma.profile.findMany({ where: { ...live(), userId: account.userId }, select: SHARK, orderBy: { verifiedAt: 'asc' } })
      : [];
    if (!sharks.length) {
      return interaction.editReply({
        content: self ? "You don't have a shark on Tinderhaj yet." : `${user} has no sharks to show.`,
        allowedMentions: { parse: [] },
      });
    }
    await Promise.all(sharks.map((shark) => warmSharedImage(sharkLink(shark))));
    return interaction.editReply({
      content: [`🦈 ${self ? 'Your' : `${user}'s`} shark${sharks.length === 1 ? '' : 's'}:`, ...sharks.map(sharkLink)].join('\n'),
      allowedMentions: { parse: [] },
    });
  },
});
