import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { auditReason, cannotModerate, recordModeration } from 'moderation/moderation';
import { answer, COLORS, fail } from 'utility/replies';

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription("End someone's timeout early")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName('member').setDescription('Whose timeout to end').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Why').setMaxLength(500)),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const target = interaction.options.getMember('member');
    if (!target) return fail(interaction, "They're not on the server.");
    if (!target.isCommunicationDisabled()) return fail(interaction, `${target} isn't timed out.`);
    const problem = cannotModerate(interaction.member, target);
    if (problem) return fail(interaction, problem);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const reason = interaction.options.getString('reason');
    await target.timeout(null, auditReason(interaction.user, reason));
    const record = await recordModeration(interaction.guild, { user: target.user, moderator: interaction.user, action: 'UNTIMEOUT', reason }, 'command');
    return answer(interaction, `Ended ${target}'s timeout (case ${record.id}).`, { accent: COLORS.info });
  },
});
