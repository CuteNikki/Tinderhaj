import { ArrowRight } from 'lucide-react';
import { cacheLife, cacheTag } from 'next/cache';

import { getNewestSharks, PROFILE_COUNT_TAG } from '@/lib/queries';
import { STAGGER } from '@/lib/motion';

import { DiscoveryLink } from '@/components/discovery/link';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Section } from '@/components/sections/section';
import { Button } from '@/components/ui/button';

/**
 * The newest sharks in discovery, to meet without going looking. Nothing at
 * all while there are none. Cached as a whole, like the sharks it shows, so
 * their cards can tell which are new (by the time) while the page prerenders.
 */
export async function FreshSharks({ tone }: { tone?: 'muted' | 'card' | 'background' }) {
  'use cache';
  cacheLife('hours');
  cacheTag(PROFILE_COUNT_TAG);

  const sharks = await getNewestSharks();
  if (sharks.length === 0) return null;

  return (
    <Section
      eyebrow='Fresh in the water'
      title='Meanwhile,'
      highlight='meet the new faces.'
      note='The latest sharks to join discovery, verified and ready to be hearted.'
      tone={tone}
    >
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {sharks.map((shark, index) => (
          <ScrollReveal key={shark.id} className='h-full' delay={0.1 + index * STAGGER} scrollDelay={index * STAGGER} variant='card'>
            <DiscoveryProfile profile={shark} />
          </ScrollReveal>
        ))}
      </div>
      <div className='mt-8 flex justify-center'>
        <Button size='lg' variant='outline' className='h-12 rounded-full px-6' asChild>
          <DiscoveryLink>
            See everyone
            <ArrowRight />
          </DiscoveryLink>
        </Button>
      </div>
    </Section>
  );
}
