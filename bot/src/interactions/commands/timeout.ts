import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { when } from 'moderation/log';
import { auditReason, cannotModerate, dmNote, recordModeration, tellMember } from 'moderation/moderation';
import { answer, COLORS, fail } from 'utility/replies';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** How long a timeout can be, up to Discord's longest. */
const DURATIONS = [
  { name: '1 minute', value: MINUTE },
  { name: '5 minutes', value: 5 * MINUTE },
  { name: '10 minutes', value: 10 * MINUTE },
  { name: '30 minutes', value: 30 * MINUTE },
  { name: '1 hour', value: HOUR },
  { name: '6 hours', value: 6 * HOUR },
  { name: '12 hours', value: 12 * HOUR },
  { name: '1 day', value: DAY },
  { name: '3 days', value: 3 * DAY },
  { name: '1 week', value: 7 * DAY },
  { name: '2 weeks', value: 14 * DAY },
  { name: '4 weeks', value: 28 * DAY },
];

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription("Time someone out: they can read, but can't talk, for a while")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName('member').setDescription('Who to time out').setRequired(true))
    .addIntegerOption((option) =>
      option
        .setName('duration')
        .setDescription('For how long')
        .setRequired(true)
        .addChoices(...DURATIONS),
    )
    .addStringOption((option) => option.setName('reason').setDescription('What for. They see this.').setMaxLength(500)),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    // Checked before anything's said to them, so nobody's told they were timed out when they weren't.
    if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ModerateMembers)) return fail(interaction, 'I need Timeout Members to do that.');
    const target = interaction.options.getMember('member');
    if (!target) return fail(interaction, "They're not on the server.");
    const problem = cannotModerate(interaction.member, target);
    if (problem) return fail(interaction, problem);
    // Discord never lets anyone with Administrator be timed out.
    if (!target.moderatable) return fail(interaction, `${target} can't be timed out, as they're an administrator.`);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const reason = interaction.options.getString('reason');
    const until = new Date(Date.now() + interaction.options.getInteger('duration', true));
    const told = await tellMember(target.user, interaction.guild, 'TIMEOUT', reason, until);
    await target.timeout(until.getTime() - Date.now(), auditReason(interaction.user, reason));
    const record = await recordModeration(interaction.guild, { user: target.user, moderator: interaction.user, action: 'TIMEOUT', reason, until }, 'command');
    return answer(interaction, `Timed out ${target} until ${when(until, 'f')} (case ${record.id}). ${dmNote(told)}`, { accent: COLORS.info });
  },
});
