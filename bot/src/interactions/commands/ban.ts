import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { auditReason, cannotModerate, dmNote, recordModeration, tellMember } from 'moderation/moderation';
import { answer, COLORS, fail } from 'utility/replies';

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('ban')
    .setDescription("Ban someone, even if they already left, so they can't come back")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName('user').setDescription('Who to ban: someone here, or their user id').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('What for. They see this.').setMaxLength(500))
    .addIntegerOption((option) =>
      option
        .setName('delete_messages')
        .setDescription('Also delete what they sent lately')
        .addChoices(
          { name: "Don't delete any", value: 0 },
          { name: 'From the last hour', value: 60 * 60 },
          { name: 'From the last day', value: 24 * 60 * 60 },
          { name: 'From the last week', value: 7 * 24 * 60 * 60 },
        ),
    ),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const user = interaction.options.getUser('user', true);
    // Someone who's left can still be banned; only someone here has roles to compare.
    const target = interaction.options.getMember('user');
    if (target) {
      const problem = cannotModerate(interaction.member, target);
      if (problem) return fail(interaction, problem);
    }
    if (await interaction.guild.bans.fetch(user).catch(() => null)) return fail(interaction, `${user} is already banned.`);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const reason = interaction.options.getString('reason');
    // Told first: once they're banned, the bot can't reach them. Someone who's left can't be reached either way.
    const told = target ? await tellMember(user, interaction.guild, 'BAN', reason) : false;
    await interaction.guild.bans.create(user, {
      reason: auditReason(interaction.user, reason),
      deleteMessageSeconds: interaction.options.getInteger('delete_messages') ?? 0,
    });
    const record = await recordModeration(interaction.guild, { user, moderator: interaction.user, action: 'BAN', reason }, 'command');
    return answer(interaction, `Banned ${user} (case ${record.id}). ${target ? dmNote(told) : "They'd left already, so they weren't told."}`, {
      accent: COLORS.info,
    });
  },
});
