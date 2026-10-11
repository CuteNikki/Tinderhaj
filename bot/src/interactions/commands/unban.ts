import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { auditReason, recordModeration } from 'moderation/moderation';
import { answer, COLORS, fail } from 'utility/replies';

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Let someone who was banned join again')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName('user').setDescription('Who to unban: their user id').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Why').setMaxLength(500)),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const user = interaction.options.getUser('user', true);
    if (!(await interaction.guild.bans.fetch(user).catch(() => null))) return fail(interaction, `${user} isn't banned.`);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const reason = interaction.options.getString('reason');
    await interaction.guild.bans.remove(user, auditReason(interaction.user, reason));
    const record = await recordModeration(interaction.guild, { user, moderator: interaction.user, action: 'UNBAN', reason }, 'command');
    // They aren't told: the bot shares no server with them to send a DM from.
    return answer(interaction, `Unbanned ${user} (case ${record.id}).`, { accent: COLORS.info });
  },
});
