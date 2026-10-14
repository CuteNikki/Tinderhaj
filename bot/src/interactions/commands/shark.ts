import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  InteractionContextType,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  type User,
} from 'discord.js';

import { Command } from 'classes/base/command';

import { prisma } from 'database/index';
import { KEYS } from 'utility/keys';
import { escapeMarkdown } from 'utility/markdown';
import { COLORS, fail } from 'utility/replies';
import { warmSharedImage } from 'utility/warm';

/** Accounts that aren't banned right now, as notBannedWhere() on the site. */
const notBanned = () => ({ OR: [{ banned: false }, { banExpires: { lte: new Date() } }] });
/** Sharks others can see, as liveProfileWhere() on the site: verified, from accounts that aren't banned. */
const live = () => ({ status: 'VERIFIED' as const, user: notBanned() });
/** As on the site (src/constants/auth.ts). */
const MAX_USERNAME_LENGTH = 32;
/** What a username can be, as usernameSchema on the site. */
const USERNAME = new RegExp(`^[a-z0-9_]{3,${MAX_USERNAME_LENGTH}}$`);
const SHARK = { id: true, displayName: true, user: { select: { username: true } } } as const;
/** What a shark's row in someone's lineup shows. */
const LINEUP = { ...SHARK, avatarUrl: true, pronouns: true, size: true, unit: true, location: true } as const;
/** How many sharks a lineup shows before the rest are left to their page: the profile limit today, kept apart so a higher one doesn't make the card endless. */
const LINEUP_ROWS = 5;

/** A shark's page on the site, which Discord shows as its card. */
function sharkLink(shark: { id: string; user: { username: string } }) {
  return new URL(`/u/${shark.user.username}/${shark.id}`, KEYS.SITE_URL).href;
}

type LineupShark = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  pronouns: string | null;
  size: number | null;
  unit: string;
  location: string | null;
};

/**
 * Someone's sharks in one card, as on their page on the site: each with its
 * avatar, its details and a link to its own page. With `member`, whose
 * Discord account they are.
 */
function lineup(username: string, sharks: LineupShark[], member?: User) {
  const count = sharks.length === 1 ? '1 shark' : `${sharks.length} sharks`;
  const container = new ContainerBuilder()
    .setAccentColor(COLORS.info)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## @${escapeMarkdown(username)}'s sharks\n-# ${member ? `${member} · ` : ''}${count} on Tinderhaj`),
    )
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large));

  for (const shark of sharks.slice(0, LINEUP_ROWS)) {
    const details = [shark.pronouns, shark.size != null && `${shark.size}${shark.unit.toLowerCase()}`, shark.location]
      .filter(Boolean)
      .map((detail) => escapeMarkdown(String(detail)));
    // A line each, beside the avatar, which is taller than the name and one line of details.
    const text = new TextDisplayBuilder().setContent(
      [`**[${escapeMarkdown(shark.displayName)}](${sharkLink({ id: shark.id, user: { username } })})**`, ...details].join('\n'),
    );
    // Only web addresses, since Discord refuses the whole message over a thumbnail it can't load.
    const avatar = shark.avatarUrl && /^https?:\/\//.test(shark.avatarUrl) ? shark.avatarUrl : null;
    if (avatar) {
      container.addSectionComponents(
        new SectionBuilder().addTextDisplayComponents(text).setThumbnailAccessory(new ThumbnailBuilder().setURL(avatar).setDescription(shark.displayName)),
      );
    } else {
      container.addTextDisplayComponents(text);
    }
  }

  return container.addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large)).addActionRowComponents(
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(sharks.length > LINEUP_ROWS ? `See all ${sharks.length}` : sharks.length === 1 ? 'Meet them' : 'Meet them all')
        .setEmoji('🦈')
        .setURL(new URL(`/u/${username}`, KEYS.SITE_URL).href),
      // Also widens the card, which a single button leaves narrow.
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Discover more sharks').setEmoji('🔍').setURL(new URL('/discovery', KEYS.SITE_URL).href),
    ),
  );
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
    .addSubcommand((sub) =>
      sub
        .setName('user')
        .setDescription("Someone's sharks, by their Tinderhaj username")
        .addStringOption((option) =>
          option
            .setName('username')
            .setDescription('Their username on Tinderhaj, with or without the @')
            .setRequired(true)
            .setMaxLength(MAX_USERNAME_LENGTH + 1),
        ),
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

    if (interaction.options.getSubcommand() === 'user') {
      // As typed, so "@Nikki" finds nikki: usernames are lowercase on the site.
      const username = interaction.options.getString('username', true).trim().replace(/^@/, '').toLowerCase();
      await interaction.deferReply();
      // A banned account, or a name that can't be a username, shows as having no sharks, which doesn't tell anyone it's banned.
      const account = USERNAME.test(username)
        ? await prisma.user.findFirst({
            where: { username, ...notBanned() },
            select: { username: true, profiles: { where: { status: 'VERIFIED' }, select: LINEUP, orderBy: { verifiedAt: 'asc' } } },
          })
        : null;
      if (!account?.profiles.length) {
        return interaction.editReply({ content: `@${escapeMarkdown(username)} has no sharks to show.`, allowedMentions: { parse: [] } });
      }
      // Without their Discord account, so a username can't be used to find someone here.
      return interaction.editReply({
        components: [lineup(account.username, account.profiles)],
        flags: MessageFlags.IsComponentsV2,
        allowedMentions: { parse: [] },
      });
    }

    const user = interaction.options.getUser('member') ?? interaction.user;
    const self = user.id === interaction.user.id;
    // A banned account shows as not connected, which doesn't tell anyone it's banned.
    const account = await prisma.account.findFirst({
      where: { providerId: 'discord', accountId: user.id, user: notBanned() },
      select: { userId: true, user: { select: { username: true } } },
    });
    // Said the same either way for someone else, so this doesn't tell anyone whether they've connected.
    if (!account && self) return fail(interaction, 'Connect Discord to Tinderhaj first, under Sign-in methods in your account settings.');

    await interaction.deferReply();
    const sharks = account
      ? await prisma.profile.findMany({ where: { ...live(), userId: account.userId }, select: LINEUP, orderBy: { verifiedAt: 'asc' } })
      : [];
    if (!account || !sharks.length) {
      return interaction.editReply({
        content: self ? "You don't have a shark on Tinderhaj yet." : `${user} has no sharks to show.`,
        allowedMentions: { parse: [] },
      });
    }
    return interaction.editReply({
      components: [lineup(account.user.username, sharks, user)],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [] },
    });
  },
});
