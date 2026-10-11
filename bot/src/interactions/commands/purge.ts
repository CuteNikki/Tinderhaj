import { InteractionContextType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import { Command } from 'classes/base/command';

import { LOG_COLORS, log, purging, transcript, who } from 'moderation/log';
import { answer, COLORS, fail } from 'utility/replies';

/** Discord deletes messages in bulk up to this old, and no older. */
const BULK_LIMIT = 14 * 24 * 60 * 60 * 1000;

export default new Command({
  // Enough to stop it being sent twice by accident.
  cooldown: 5_000,
  builder: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete many messages in this channel at once')
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) => option.setName('amount').setDescription('How many to delete').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption((option) => option.setName('member').setDescription("Only theirs, from this channel's last 100 messages")),
  async execute(interaction) {
    if (!interaction.inCachedGuild()) return;
    const channel = interaction.channel;
    if (!channel || !('bulkDelete' in channel)) return fail(interaction, "Messages can't be purged here.");
    if (!channel.permissionsFor(interaction.guild.members.me!).has(PermissionFlagsBits.ManageMessages))
      return fail(interaction, 'I need Manage Messages in this channel to do that.');

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const amount = interaction.options.getInteger('amount', true);
    const member = interaction.options.getUser('member');

    const recent = await channel.messages.fetch({ limit: 100 });
    const wanted = [...recent.values()].filter((message) => !member || message.author.id === member.id).slice(0, amount);
    // Ones too old for a bulk delete are left, and said so.
    const fresh = wanted.filter((message) => Date.now() - message.createdTimestamp < BULK_LIMIT);
    const tooOld = wanted.length - fresh.length;
    if (!fresh.length)
      return fail(interaction, tooOld ? "Those are all older than 2 weeks, which Discord doesn't let bots delete in bulk." : 'There was nothing to delete.');

    for (const message of fresh) purging.add(message.id);
    const deleted = await channel.bulkDelete(fresh, true).finally(() => setTimeout(() => fresh.forEach((message) => purging.delete(message.id)), 60_000));
    const file = transcript(
      fresh.filter((message) => deleted.has(message.id)),
      `${deleted.size} messages purged from #${channel.name} (${channel.id}) by ${interaction.user.username} (${interaction.user.id}) on ${new Date().toISOString()}`,
    );
    await log(
      interaction.guild,
      'Messages purged',
      LOG_COLORS.deleted,
      [
        [`**By:** ${who(interaction.user)}`, `**Where:** ${channel}`, `**How many:** ${deleted.size}`, member && `**Only from:** ${who(member)}`]
          .filter(Boolean)
          .join('\n'),
      ],
      [file],
    );

    const note = tooOld ? ` ${tooOld} older than 2 weeks ${tooOld === 1 ? 'was' : 'were'} left, as Discord doesn't let bots delete those in bulk.` : '';
    return answer(interaction, `Deleted ${deleted.size} message${deleted.size === 1 ? '' : 's'}${member ? ` from ${member}` : ''}.${note}`, {
      accent: COLORS.info,
    });
  },
});
