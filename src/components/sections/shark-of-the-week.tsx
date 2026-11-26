import { cacheLife, cacheTag } from 'next/cache';
import Link from 'next/link';

import { ArrowRight, Heart, Sparkles, UserRoundCheck } from 'lucide-react';

import {
  getSharkOfTheWeek,
  SHARK_OF_THE_WEEK_TAG,
} from '@/lib/shark-of-the-week';
import { sharkPath } from '@/lib/utils';

import { IconCard } from '@/components/common/icon-card';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Section } from '@/components/sections/section';
import { Button } from '@/components/ui/button';

/** What gives a shark a better chance at the draw, as its weight() counts it. */
const CHANCES = [
  {
    title: 'Hearts this week',
    copy: 'Every heart a shark gets in the week before the draw counts, up to ten, so everyone still has a chance.',
    icon: Heart,
  },
  {
    title: 'A full profile',
    copy: 'A bio, a banner, a birthday, a home, pronouns and interests each add a little more.',
    icon: UserRoundCheck,
  },
  {
    title: 'Being new',
    copy: 'Sharks verified in the last month get an extra push, to say hello.',
    icon: Sparkles,
  },
];

/**
 * This week's Shark of the Week, drawn every Monday (see
 * lib/shark-of-the-week.ts). Nothing at all while there's none. Cached as a
 * whole, like FreshSharks, so its card can tell whether it's new (by the
 * time) while the page prerenders.
 */
export async function SharkOfTheWeek({
  tone,
}: {
  tone?: 'muted' | 'card' | 'background';
}) {
  'use cache';
  cacheLife('hours');
  cacheTag(SHARK_OF_THE_WEEK_TAG);

  const shark = await getSharkOfTheWeek();
  if (!shark) return null;

  return (
    <Section
      eyebrow='Shark of the Week'
      title={`Meet ${shark.displayName},`}
      highlight="this week's star."
      note='Every Monday, a shark from discovery gets the spotlight. Yours could be next.'
      tone={tone}
      aside={
        <Button size='xl' variant='outline' asChild>
          <Link href={sharkPath(shark)}>
            See {shark.displayName}
            <ArrowRight />
          </Link>
        </Button>
      }
    >
      {/* The card beside what gets a shark picked, under it on narrow screens */}
      <div className='grid gap-6 lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-8'>
        <ScrollReveal variant='card' delay={0.1} className='max-w-md'>
          <DiscoveryProfile profile={shark} />
        </ScrollReveal>
        <ScrollReveal variant='card' delay={0.2}>
          <h3 className='mb-4 text-sm font-semibold text-muted-foreground'>
            How the star is picked
          </h3>
          <div className='grid gap-3'>
            {CHANCES.map(({ title, copy, icon }) => (
              <IconCard
                key={title}
                title={title}
                copy={copy}
                icon={icon}
                heading='h3'
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </Section>
  );
}
