import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { auditReason, cannotModerate, dmNote, recordModeration, tellMember } from 'moderation/moderation';
import { answer, COLORS, fail } from 'utility/replies';

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Remove someone from the server')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName('member').setDescription('Who to kick').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('What for. They see this.').setMaxLength(500)),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    // Checked before anything's said to them, so nobody's told they were kicked when they weren't.
    if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.KickMembers)) return fail(interaction, 'I need Kick Members to do that.');
    const target = interaction.options.getMember('member');
    if (!target) return fail(interaction, "They're not on the server.");
    const problem = cannotModerate(interaction.member, target);
    if (problem) return fail(interaction, problem);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const reason = interaction.options.getString('reason');
    // Told first: once they're gone, the bot can't reach them.
    const told = await tellMember(target.user, interaction.guild, 'KICK', reason);
    await target.kick(auditReason(interaction.user, reason));
    const record = await recordModeration(interaction.guild, { user: target.user, moderator: interaction.user, action: 'KICK', reason }, 'command');
    return answer(interaction, `Kicked ${target} (case ${record.id}). ${dmNote(told)}`, { accent: COLORS.info });
  },
});
