import {
  BanIcon,
  BotOffIcon,
  CameraIcon,
  CircleCheckIcon,
  ClockIcon,
  CopyXIcon,
  EyeOffIcon,
  FilePenLineIcon,
  type LucideIcon,
  MailIcon,
  SmileIcon,
  UndoIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { CONTACT_EMAIL } from '@/constants/contact';
import { guidelinesMetadata } from '@/constants/metadata';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { IconCard } from '@/components/common/icon-card';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';
import { Section } from '@/components/sections/section';

export const metadata: Metadata = guidelinesMetadata;

/** What a moderator checks a profile against. */
const RULES: { title: string; copy: string; icon: LucideIcon }[] = [
  {
    title: 'A shark, not a person',
    copy: 'Every profile is a plush. You can be in a picture with it, but the shark is the star, and its avatar is the shark.',
    icon: SmileIcon,
  },
  {
    title: 'Your own pictures',
    copy: 'Photos you took of a shark that’s yours. No store photos, and nothing taken from someone else’s post.',
    icon: CameraIcon,
  },
  {
    title: 'Kind and safe for everyone',
    copy: 'Nothing sexual, hateful, violent or mean, in pictures or in words. Discovery is for all ages.',
    icon: CircleCheckIcon,
  },
  {
    title: 'Nothing that finds you',
    copy: 'No addresses, phone numbers, emails or social handles. For location, a town or a country is plenty.',
    icon: EyeOffIcon,
  },
  {
    title: 'One profile per shark',
    copy: 'No copies of the same shark, and no passing off someone else’s shark as yours.',
    icon: CopyXIcon,
  },
  {
    title: 'No ads or spam',
    copy: 'No selling, shop links or referral codes. A shark’s profile is about the shark.',
    icon: BotOffIcon,
  },
];

/** A profile's way through review, as named on the profiles page. */
const REVIEW: { title: string; copy: string; icon: LucideIcon }[] = [
  { title: 'Draft', copy: 'Saved, and only you can see it. Send it in when it’s ready.', icon: FilePenLineIcon },
  { title: 'Pending Review', copy: 'Waiting for a moderator, who looks at every profile by hand.', icon: ClockIcon },
  { title: 'Verified', copy: 'In discovery for everyone to find. Editing it sends it back to draft, to be checked again.', icon: CircleCheckIcon },
];

/** What happens when a shark or its owner breaks the rules above. */
const CONSEQUENCES: { title: string; copy: string; icon: LucideIcon }[] = [
  {
    title: 'Sent back',
    copy: 'A profile that isn’t quite right is rejected, with the parts that need fixing marked and often a note. Fix them and send it in again.',
    icon: UndoIcon,
  },
  {
    title: 'Banned',
    copy: 'Breaking the rules on purpose, or again and again, can get an account banned, for a day up to until it’s lifted, with the reason given.',
    icon: BanIcon,
  },
  {
    title: 'Seen something wrong?',
    copy: `A shark that breaks these, or a ban you think was a mistake: write to ${CONTACT_EMAIL} and a person will look.`,
    icon: MailIcon,
  },
];

export default function GuidelinesPage() {
  return (
    <>
      <div data-water='band' className='flex flex-1 flex-col px-4 pt-28 pb-18 sm:px-5 lg:px-8'>
        <div className='container mx-auto max-w-7xl'>
          <Stagger id='page-header' variant='sink' className='mb-24'>
            <Eyebrow>Guidelines</Eyebrow>
            <PageTitle>Guidelines for sharks</PageTitle>
            <PageNote>What moderators look for, so your shark sails through review.</PageNote>
          </Stagger>

          <ScrollReveal delay={CONTENT_DELAY}>
            <Eyebrow as='h2' className='mb-4'>
              What we look for
            </Eyebrow>
          </ScrollReveal>
          <Stagger
            as='ul'
            itemAs='li'
            variant='card'
            gap={STAGGER / 2}
            delay={CONTENT_DELAY}
            className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
            itemClassName='h-full'
          >
            {RULES.map((rule) => (
              <IconCard key={rule.title} {...rule} heading='h3' />
            ))}
          </Stagger>
          <ScrollReveal delay={CONTENT_DELAY + STAGGER * 3}>
            <p className='text-muted-foreground mt-6 text-sm text-pretty'>
              These go along with the community rules in the{' '}
              <Link href='/terms' className='text-foreground font-medium underline'>
                Terms of Service
              </Link>
              , which apply too.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <Section eyebrow='Review' title='From draft' highlight='to discovery.' note='Every shark goes through the same three steps.'>
        <Stagger as='ul' itemAs='li' variant='card' gap={STAGGER} delay={0.1} className='grid gap-4 md:grid-cols-3' itemClassName='h-full'>
          {REVIEW.map((step, index) => (
            <IconCard key={step.title} {...step} step={index + 1} heading='h3' />
          ))}
        </Stagger>
      </Section>

      <Section
        eyebrow='When something’s not right'
        title='Fixed, mostly.'
        highlight='Banned, rarely.'
        note='Most profiles that come back need a small change, nothing more.'
        tone='background'
      >
        <Stagger as='ul' itemAs='li' variant='card' gap={STAGGER} delay={0.1} className='grid gap-4 md:grid-cols-3' itemClassName='h-full'>
          {CONSEQUENCES.map((item) => (
            <IconCard key={item.title} {...item} heading='h3' />
          ))}
        </Stagger>
      </Section>

      <ReadyWhenYouAre />
    </>
  );
}
