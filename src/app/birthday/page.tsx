import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import Image from 'next/image';

import { HeartIcon } from 'lucide-react';

import { birthdayMetadata } from '@/constants/metadata';

import { getBirthdayStats } from '@/lib/birthday';
import { SHARKS } from '@/lib/images';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { PROFILE_COUNT_TAG } from '@/lib/queries';
import { cn } from '@/lib/utils';

import { Confetti } from '@/components/birthday/confetti';
import { handwriting } from '@/components/birthday/handwriting';
import { ShareButton } from '@/components/birthday/share-button';
import { Sticker } from '@/components/birthday/sticker';
import { Eyebrow } from '@/components/common/heading';
import { Stagger } from '@/components/common/stagger';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { AnimatedCount } from '@/components/home/animated-count';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = birthdayMetadata;

const ordinal = (n: number) => {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
};

/** "1 heart", "6 hearts" */
const count = (n: number, one: string, many: string) =>
  `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`;

const monthYear = (date: Date) =>
  date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/** "a, b and c" */
const list = (items: string[]) =>
  items.length > 1
    ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
    : (items[0] ?? '');

/**
 * Tinderhaj's birthday: a birthday card to open, then the story of the year
 * in real numbers, a line at a time as it's scrolled to.
 */
export default async function BirthdayPage() {
  // Cached as a whole, like its numbers, so the first shark's card can tell
  // whether it's new (by the time) while the page prerenders
  'use cache';
  cacheLife('hours');
  cacheTag(PROFILE_COUNT_TAG);

  const stats = await getBirthdayStats();
  const { number, date } = stats.birthday;
  const title = `Happy ${ordinal(number)} birthday, Tinderhaj!`;
  const favorites = stats.interests.slice(0, 3).map((item) => item.interest);
  const more = stats.interests.slice(3).map((item) => item.interest);

  return (
    <>
      {/* The card, in the water, with confetti around it */}
      <div
        data-water='band'
        className='flex flex-1 flex-col px-4 pt-28 pb-24 sm:px-5 lg:px-8'
      >
        <div className='container mx-auto flex max-w-7xl justify-center'>
          <ScrollReveal
            id='page-header'
            variant='card'
            className='relative w-full max-w-xl'
          >
            <Confetti />
            <article className='relative flex flex-col items-center gap-5 rounded-3xl border border-foreground/10 bg-card px-6 py-10 text-center shadow-lg sm:px-12'>
              <Image
                src={SHARKS.hug}
                alt='A Blåhaj hugging, with hearts above it'
                className='h-auto w-40 sm:w-48'
                priority
              />
              <Eyebrow>
                {date.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </Eyebrow>
              <h1 className='-mt-3 text-4xl font-black tracking-tight text-balance sm:text-5xl'>
                {title}
              </h1>
              {/* Each number with its word, never split across lines */}
              <ul className='flex flex-wrap justify-center gap-x-6 gap-y-1 text-lg'>
                {[
                  [stats.sharks, 'shark', 'sharks'] as const,
                  [stats.hearts, 'heart', 'hearts'] as const,
                  [stats.matches, 'match', 'matches'] as const,
                ].map(([value, one, many]) => (
                  <li key={many} className='whitespace-nowrap'>
                    <span className='font-black text-primary tabular-nums'>
                      {value.toLocaleString('en-US')}
                    </span>{' '}
                    <span className='text-muted-foreground'>
                      {value === 1 ? one : many}
                    </span>
                  </li>
                ))}
              </ul>
              <p className='max-w-sm text-pretty text-muted-foreground'>
                {number === 1 ? 'One year' : `${number} years`} ago, the first
                shark swam in. Thank you for every shark, every heart and every
                match since.
              </p>
              <p
                className={cn(
                  handwriting.className,
                  'flex items-center gap-1.5 text-2xl font-semibold text-foreground'
                )}
              >
                Love, the pod
                <HeartIcon
                  className='size-5 fill-current text-primary'
                  aria-hidden='true'
                />
              </p>
              <ShareButton
                title={title}
                text={`${count(stats.sharks, 'shark', 'sharks')}, ${count(stats.hearts, 'heart', 'hearts')} and ${count(stats.matches, 'match', 'matches')} so far.`}
              />
            </article>
          </ScrollReveal>
        </div>
      </div>

      {/* The story, a big line at a time */}
      <StoryLine
        tone='background'
        sticker={
          <Sticker src={SHARKS.face} note='welcome home!' tilt='right' />
        }
      >
        <StoryNumber value={stats.sharks} />{' '}
        {stats.sharks === 1 ? 'shark' : 'sharks'} found a home here, brought by{' '}
        <StoryNumber value={stats.owners} />{' '}
        {stats.owners === 1 ? 'person' : 'people'} who love them.
      </StoryLine>
      <StoryLine
        tone='muted'
        flip
        sticker={
          <Sticker src={SHARKS.heart} note='so much love!' tilt='left' />
        }
      >
        Together they sent <StoryNumber value={stats.hearts} />{' '}
        {stats.hearts === 1 ? 'heart' : 'hearts'} and made{' '}
        <StoryNumber value={stats.matches} />{' '}
        {stats.matches === 1 ? 'match' : 'matches'}.
      </StoryLine>
      {stats.averageSize != null && (
        <StoryLine
          tone='background'
          sticker={
            <Sticker
              src={SHARKS.spinSmall}
              still={SHARKS.face}
              note='pure softness'
              tilt='right'
            />
          }
        >
          The average shark is <StoryNumber value={stats.averageSize} /> cm of
          pure softness
          {stats.places > 1 && (
            <>
              , living in <StoryNumber value={stats.places} /> different places
            </>
          )}
          .
        </StoryLine>
      )}

      {stats.first && (
        <section className='overflow-hidden bg-muted px-4 py-24 sm:px-5 sm:py-32 lg:px-8'>
          <div className='container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2'>
            <ScrollReveal>
              <Eyebrow>Where it started</Eyebrow>
              <h2 className='text-4xl leading-tight font-black tracking-tight text-balance sm:text-6xl'>
                It all started with{' '}
                <span className='text-primary'>{stats.first.displayName}</span>.
              </h2>
              <p className='mt-4 max-w-md text-lg text-pretty text-muted-foreground'>
                Verified in{' '}
                {monthYear(stats.first.verifiedAt ?? stats.first.createdAt)},{' '}
                {stats.first.displayName} is the oldest shark in discovery, and
                still swimming today.
              </p>
            </ScrollReveal>
            <ScrollReveal
              variant='card'
              scrollDelay={STAGGER}
              className='relative w-full max-w-md lg:justify-self-end'
            >
              <Confetti />
              <p
                className={cn(
                  handwriting.className,
                  'relative mb-3 -rotate-3 text-3xl font-bold text-primary'
                )}
              >
                the very first!
              </p>
              <div className='relative'>
                <DiscoveryProfile profile={stats.first} heading='h3' />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {favorites.length > 0 && (
        <StoryLine
          tone='background'
          after={more.length > 0 && <More items={more} />}
          sticker={
            <Sticker src={SHARKS.think} note='good taste!' tilt='right' />
          }
        >
          What do sharks love most?{' '}
          <span className='text-primary'>{list(favorites)}</span>.
        </StoryLine>
      )}
      {stats.busiestMonth && (
        <StoryLine
          tone='muted'
          flip
          sticker={
            <Sticker src={SHARKS.hug} note='what a month!' tilt='left' />
          }
        >
          The busiest month was{' '}
          <span className='text-primary'>
            {monthYear(stats.busiestMonth.month)}
          </span>
          , with <StoryNumber value={stats.busiestMonth.count} /> new{' '}
          {stats.busiestMonth.count === 1 ? 'shark' : 'sharks'}.
        </StoryLine>
      )}

      <ReadyWhenYouAre />
    </>
  );
}

/**
 * One line of the story, big, on a band of its own, coming in as it's scrolled
 * to, with a sticker beside it: on the right, or the left when `flip`, so they
 * take turns down the page. Under the line on phones.
 */
function StoryLine({
  tone,
  flip = false,
  sticker,
  after,
  children,
}: {
  tone: 'background' | 'muted';
  flip?: boolean;
  sticker: React.ReactNode;
  after?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        'overflow-hidden px-4 py-24 sm:px-5 sm:py-32 lg:px-8',
        tone === 'muted' ? 'bg-muted' : 'bg-background'
      )}
    >
      <div
        className={cn(
          'container mx-auto grid max-w-7xl items-center gap-16',
          flip
            ? 'lg:grid-cols-[auto_minmax(0,1fr)]'
            : 'lg:grid-cols-[minmax(0,1fr)_auto]'
        )}
      >
        <ScrollReveal delay={CONTENT_DELAY}>
          <p className='max-w-4xl text-4xl leading-tight font-black tracking-tight text-balance sm:text-6xl'>
            {children}
          </p>
          {after}
        </ScrollReveal>
        <ScrollReveal
          variant='card'
          scrollDelay={STAGGER}
          className={cn('lg:w-60', flip && 'lg:order-first')}
        >
          {sticker}
        </ScrollReveal>
      </div>
    </section>
  );
}

/** A number in the story, in blue, counting up once its line comes in. */
function StoryNumber({ value }: { value: number }) {
  return (
    <span className='text-primary tabular-nums'>
      <AnimatedCount target={value} delay={0.3} localize />
    </span>
  );
}

/** The interests after the top three, smaller, under their line. */
function More({ items }: { items: string[] }) {
  return (
    <Stagger
      as='ul'
      itemAs='li'
      variant='pop'
      gap={0.05}
      delay={0.2}
      className='mt-8 flex flex-wrap gap-2'
    >
      {items.map((item) => (
        <Badge key={item} variant='secondary' className='px-3 py-1 text-sm'>
          {item}
        </Badge>
      ))}
    </Stagger>
  );
}
