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
} from 'discord.js';

import { Command } from 'classes/base/command';

import { KEYS } from 'utility/keys';
import { COLORS } from 'utility/replies';

/** What a moderator checks a profile against, as on the site's guidelines page (src/app/guidelines/page.tsx). Keep the two in step. */
const RULES = [
  {
    title: 'A shark, not a person',
    copy: 'Every profile is a plush. You can be in a picture with it, but the shark is the star, and its avatar is the shark.',
  },
  { title: 'Your own pictures', copy: "Photos you took of a shark that's yours. No store photos, and nothing taken from someone else's post." },
  { title: 'Kind and safe for everyone', copy: 'Nothing sexual, hateful, violent or mean, in pictures or in words. Discovery is for all ages.' },
  { title: 'Nothing that finds you', copy: 'No addresses, phone numbers, emails or social handles. For location, a town or a country is plenty.' },
  { title: 'One profile per shark', copy: "No copies of the same shark, and no passing off someone else's shark as yours." },
  { title: 'No ads or spam', copy: "No selling, shop links or referral codes. A shark's profile is about the shark." },
];

const site = (path: string) => new URL(path, KEYS.SITE_URL).href;
const link = (label: string, path: string, emoji: string) => new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(label).setEmoji(emoji).setURL(site(path));

export default new Command({
  builder: new SlashCommandBuilder()
    .setName('guidelines')
    .setDescription("Tinderhaj's guidelines for sharks, for everyone here to see")
    .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    const container = new ContainerBuilder()
      .setAccentColor(COLORS.info)
      .addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('# Guidelines for sharks\nWhat moderators look for, so your shark sails through review.'),
          )
          .setThumbnailAccessory(new ThumbnailBuilder().setURL(site('/blahajThink.webp')).setDescription('A Blåhaj, thinking')),
      )
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(RULES.map((rule) => `**${rule.title}**\n${rule.copy}`).join('\n\n')))
      // With room around it, so the rules don't crowd the review steps.
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
      // Just the steps: what happens when the rules are broken, and reporting, are on the page the first button opens.
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '**Draft** → **Pending Review** → **Verified**\n-# A moderator checks every profile by hand, and again after each edit.',
        ),
      );
    // Below the card rather than in it, so the card is only the guidelines.
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      link('Read the guidelines', '/guidelines', '📖'),
      link('Create a profile', '/dashboard/profiles/new', '✨'),
    );

    return interaction.reply({ components: [container, buttons], flags: MessageFlags.IsComponentsV2, allowedMentions: { parse: [] } });
  },
});
