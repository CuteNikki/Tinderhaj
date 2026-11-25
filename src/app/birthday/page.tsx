import type { Metadata } from 'next';

import {
  HeartHandshakeIcon,
  HeartIcon,
  MapPinIcon,
  RulerIcon,
  SparklesIcon,
  UsersRoundIcon,
  type LucideIcon,
} from 'lucide-react';

import { birthdayMetadata } from '@/constants/metadata';

import { getBirthdayStats, STARTED } from '@/lib/birthday';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { Stagger } from '@/components/common/stagger';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { AnimatedCount } from '@/components/home/animated-count';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';
import { Section } from '@/components/sections/section';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = birthdayMetadata;

const WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];

/** "Two years", or "1 year" written out while it's small enough to read well. */
function yearsText(years: number) {
  const number = WORDS[years] ?? String(years);
  return years === 1 ? `${number} year` : `${number} years`;
}

const monthYear = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/** Tinderhaj's birthday: what the pod got up to since it began, in real numbers. */
export default async function BirthdayPage() {
  const stats = await getBirthdayStats();

  const big: { label: string; value: number; icon: LucideIcon }[] = [
    { label: 'Sharks in discovery', value: stats.sharks, icon: SparklesIcon },
    {
      label: 'People who brought them',
      value: stats.owners,
      icon: UsersRoundIcon,
    },
    { label: 'Hearts sent', value: stats.hearts, icon: HeartIcon },
    { label: 'Matches made', value: stats.matches, icon: HeartHandshakeIcon },
  ];
  const small: { label: string; value: string; icon: LucideIcon }[] = [
    ...(stats.averageSize != null
      ? [
          {
            label: 'The average shark',
            value: `${stats.averageSize} cm long`,
            icon: RulerIcon,
          },
        ]
      : []),
    ...(stats.places
      ? [
          {
            label: 'Living in',
            value:
              stats.places === 1
                ? '1 place'
                : `${stats.places} different places`,
            icon: MapPinIcon,
          },
        ]
      : []),
    ...(stats.busiestMonth
      ? [
          {
            label: 'Busiest month',
            value: `${monthYear(stats.busiestMonth.month)}, ${stats.busiestMonth.count} new sharks`,
            icon: SparklesIcon,
          },
        ]
      : []),
  ];

  return (
    <>
      <div
        data-water='band'
        data-tone='muted'
        className='flex flex-1 flex-col px-4 pt-28 pb-18 sm:px-5 lg:px-8'
      >
        <div className='container mx-auto max-w-7xl'>
          <Stagger id='page-header' variant='sink' className='mb-24'>
            <Eyebrow>Happy birthday, Tinderhaj</Eyebrow>
            <PageTitle>{yearsText(stats.years)} of sharks</PageTitle>
            <PageNote>
              Since{' '}
              {STARTED.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC',
              })}
              , in real numbers. Thank you for every shark.
            </PageNote>
          </Stagger>

          <Stagger
            as='ul'
            itemAs='li'
            variant='card'
            gap={STAGGER}
            delay={CONTENT_DELAY}
            className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'
            itemClassName='h-full'
          >
            {big.map(({ label, value, icon: Icon }, index) => (
              <div
                key={label}
                className='flex h-full flex-col gap-3 rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm'
              >
                <span className='flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Icon className='size-5' aria-hidden='true' />
                </span>
                <span className='text-4xl font-black tracking-tight tabular-nums'>
                  <AnimatedCount
                    target={value}
                    delay={0.4 + index * STAGGER}
                    localize
                  />
                </span>
                <span className='text-sm text-muted-foreground'>{label}</span>
              </div>
            ))}
          </Stagger>

          {small.length > 0 && (
            <ScrollReveal delay={CONTENT_DELAY + 4 * STAGGER} className='mt-4'>
              <dl className='grid gap-4 rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:grid-cols-3'>
                {small.map(({ label, value, icon: Icon }) => (
                  <div key={label} className='flex items-start gap-3'>
                    <Icon
                      className='mt-0.5 size-4 shrink-0 text-primary'
                      aria-hidden='true'
                    />
                    <div>
                      <dt className='text-sm text-muted-foreground'>{label}</dt>
                      <dd className='font-semibold'>{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          )}
        </div>
      </div>

      {stats.first && (
        <Section
          eyebrow='Where it started'
          title='The first shark'
          highlight='is still swimming.'
          note={`Verified in ${monthYear(stats.first.verifiedAt ?? stats.first.createdAt)}, the oldest shark in discovery today.`}
          tone='background'
        >
          <div className='max-w-md'>
            <DiscoveryProfile profile={stats.first} heading='h3' />
          </div>
        </Section>
      )}

      {stats.interests.length > 0 && (
        <Section
          eyebrow='Most loved'
          title='What sharks'
          highlight='are into.'
          note='The interests that come up most on their profiles.'
          tone='muted'
        >
          <Stagger
            as='ul'
            itemAs='li'
            variant='pop'
            gap={0.05}
            delay={0.1}
            className='flex flex-wrap gap-2'
          >
            {stats.interests.map(({ interest, count }) => (
              <Badge
                key={interest}
                variant='secondary'
                className='h-auto gap-2 px-3 py-1.5 text-sm'
              >
                {interest}
                <span className='text-muted-foreground tabular-nums'>
                  {count}
                </span>
              </Badge>
            ))}
          </Stagger>
        </Section>
      )}

      <ReadyWhenYouAre />
    </>
  );
}
