import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { cannotModerate, dmNote, recordModeration, tellMember } from 'moderation/moderation';
import { answer, COLORS, fail } from 'utility/replies';

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn someone: it goes in their history, and they get a DM')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName('member').setDescription('Who to warn').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('What for. They see this.').setMaxLength(500).setRequired(true)),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const target = interaction.options.getMember('member');
    if (!target) return fail(interaction, "They're not on the server.");
    const problem = cannotModerate(interaction.member, target, { botActs: false });
    if (problem) return fail(interaction, problem);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const reason = interaction.options.getString('reason', true);
    const told = await tellMember(target.user, interaction.guild, 'WARN', reason);
    const record = await recordModeration(interaction.guild, { user: target.user, moderator: interaction.user, action: 'WARN', reason }, 'command');
    return answer(interaction, `Warned ${target} (case ${record.id}). ${dmNote(told)}`, { accent: COLORS.info });
  },
});
