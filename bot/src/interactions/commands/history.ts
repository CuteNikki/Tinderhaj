import { ContainerBuilder, InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder, TextDisplayBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { prisma } from 'database/index';
import { LOG_COLORS, log, quote, when, who } from 'moderation/log';
import { ACTION_LABELS } from 'moderation/moderation';
import { answer, COLORS, fail } from 'utility/replies';

/** The most cases one look shows, newest first. Fewer if their reasons are long. */
const SHOWN = 20;
/** Room for the cases, leaving what the heading and the "older" line need out of a message's 4000 characters. */
const TEXT_ROOM = 3_600;

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('history')
    .setDescription("Someone's moderation history: warns, timeouts, kicks and bans")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((sub) =>
      sub
        .setName('view')
        .setDescription("See someone's history, newest first")
        .addUserOption((option) => option.setName('user').setDescription('Whose history: someone here, or their user id').setRequired(true)),
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription("Take a case out of someone's history, e.g. one made by mistake")
        .addIntegerOption((option) => option.setName('case').setDescription('Its case number').setRequired(true).setMinValue(1)),
    ),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;

    if (interaction.options.getSubcommand() === 'remove') {
      const id = interaction.options.getInteger('case', true);
      const record = await prisma.moderation.findUnique({ where: { id } });
      if (!record) return fail(interaction, `There's no case ${id}.`);
      await prisma.moderation.delete({ where: { id } });
      // Kept in the log, so a removal can't go unnoticed.
      await log(interaction.guild, `Case ${id} removed`, LOG_COLORS.moderation, [
        [
          `**${ACTION_LABELS[record.action]}** of <@${record.userId}>, by <@${record.moderatorId}> ${when(record.createdAt)}`,
          `**Removed by:** ${who(interaction.user)}`,
        ].join('\n'),
        record.reason ? quote(record.reason) : '',
      ]);
      return answer(interaction, `Removed case ${id} from <@${record.userId}>'s history.`, { accent: COLORS.info });
    }

    const user = interaction.options.getUser('user', true);
    const [records, total] = await Promise.all([
      prisma.moderation.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: SHOWN }),
      prisma.moderation.count({ where: { userId: user.id } }),
    ]);
    if (!total) return answer(interaction, `${user} has no history: nothing's been done about them.`, { accent: COLORS.info });

    // Newest first, for as long as they fit: a message holds 4000 characters in all, and 20 long reasons don't.
    const lines: string[] = [];
    let room = TEXT_ROOM;
    for (const record of records) {
      const line = [
        `\`#${record.id}\` **${ACTION_LABELS[record.action]}** ${when(record.createdAt)} by <@${record.moderatorId}>${record.until ? `, until ${when(record.until, 'f')}` : ''}`,
        record.reason ? quote(record.reason.length > 200 ? `${record.reason.slice(0, 199)}…` : record.reason) : '-# No reason given',
      ].join('\n');
      if (line.length + 2 > room) break;
      lines.push(line);
      room -= line.length + 2;
    }
    const container = new ContainerBuilder()
      .setAccentColor(LOG_COLORS.moderation)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`-# HISTORY\n## ${user.username}\n${who(user)} · ${total} case${total === 1 ? '' : 's'}`),
        new TextDisplayBuilder().setContent(lines.join('\n\n')),
      );
    if (total > lines.length) container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# And ${total - lines.length} older, not shown.`));
    return interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral, allowedMentions: { parse: [] } });
  },
});
