import { cacheLife, cacheTag } from 'next/cache';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import {
  getSharkOfTheWeek,
  SHARK_OF_THE_WEEK_TAG,
} from '@/lib/shark-of-the-week';
import { sharkPath } from '@/lib/utils';

import { DiscoveryProfile } from '@/components/discovery/profile';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Section } from '@/components/sections/section';
import { Button } from '@/components/ui/button';

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
      <ScrollReveal variant='card' delay={0.1} className='max-w-md'>
        <DiscoveryProfile profile={shark} />
      </ScrollReveal>
    </Section>
  );
}
