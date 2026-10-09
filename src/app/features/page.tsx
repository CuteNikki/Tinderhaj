import { BadgeCheckIcon, FingerprintIcon, GiftIcon, HeartIcon, type LucideIcon, MoonStarIcon, SearchIcon, Share2Icon, UsersRoundIcon } from 'lucide-react';
import type { Metadata } from 'next';

import { MAX_PROFILES } from '@/constants/auth';
import { featuresMetadata } from '@/constants/metadata';
import { HEARTS_PER_DAY } from '@/lib/hearts';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { FRESH_PROFILE_WINDOW_IN_DAYS } from '@/lib/profile-status';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { IconCard } from '@/components/common/icon-card';
import { Stagger } from '@/components/common/stagger';
import { FreshSharks } from '@/components/sections/fresh-sharks';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';

export const metadata: Metadata = featuresMetadata;

const FEATURES: { title: string; copy: string; icon: LucideIcon }[] = [
  {
    title: 'Discovery',
    copy: `Search every verified shark by name, location, pronouns or interests. New ones get a boost for their first ${FRESH_PROFILE_WINDOW_IN_DAYS} days, among a fresh shuffle each visit.`,
    icon: SearchIcon,
  },
  {
    title: 'Hearts and matches',
    copy: `Heart the sharks you like, up to ${HEARTS_PER_DAY} a day for each of yours. A heart sent back is a match, and all of them wait on your Hearts page.`,
    icon: HeartIcon,
  },
  {
    title: 'Checked by hand',
    copy: 'Every profile is looked over by a moderator before it’s shown, and if something needs fixing, you’re told exactly what.',
    icon: BadgeCheckIcon,
  },
  {
    title: 'A whole pod',
    copy: `Up to ${MAX_PROFILES} sharks on one account, each with its own profile, pictures and hearts.`,
    icon: UsersRoundIcon,
  },
  {
    title: 'A page to share',
    copy: 'Your sharks together on a page of their own, at your username, with a picture of them when the link’s shared.',
    icon: Share2Icon,
  },
  {
    title: 'Sign in your way',
    copy: 'A password, an account you already have, or a passkey, with two-step sign-in by app or email to keep it yours.',
    icon: FingerprintIcon,
  },
  {
    title: 'Free',
    copy: 'Every feature, for every shark. No subscriptions, nothing to unlock.',
    icon: GiftIcon,
  },
  {
    title: 'Light and dark',
    copy: 'Sunlit shallows or the deep blue sea: it follows your device, or whichever you pick.',
    icon: MoonStarIcon,
  },
];

export default function FeaturesPage() {
  return (
    <>
      <div data-water='band' className='flex flex-1 flex-col px-4 pt-28 pb-18 sm:px-5 lg:px-8'>
        <div className='container mx-auto max-w-7xl'>
          <Stagger id='page-header' variant='sink' className='mb-24'>
            <Eyebrow>Features</Eyebrow>
            <PageTitle>Everything for your sharks</PageTitle>
            <PageNote>All that Tinderhaj does to help them find each other.</PageNote>
          </Stagger>

          <Stagger
            as='ul'
            itemAs='li'
            variant='card'
            gap={STAGGER / 2}
            delay={CONTENT_DELAY}
            className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'
            itemClassName='h-full'
          >
            {FEATURES.map((feature) => (
              <IconCard key={feature.title} {...feature} />
            ))}
          </Stagger>
        </div>
      </div>
      <FreshSharks tone='muted' />
      <ReadyWhenYouAre />
    </>
  );
}
