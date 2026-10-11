import Image from 'next/image';

import { SHARKS } from '@/lib/images';
import { BOB_SHARK, SHARK_HOVER } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { Enter, enter } from '@/components/common/enter';
import { HeroBadge } from '@/components/common/hero-badge';
import { HeroWater } from '@/components/common/hero-water';

export function DiscoveryHero() {
  const shark = enter('swim', 0.3);

  return (
    <section data-water='band' data-tone='muted' className='relative isolate overflow-hidden px-4 pt-28 pb-24 sm:px-5 md:pt-32 md:pb-28 lg:px-8'>
      <HeroWater floor='muted' />
      <div className='relative z-10 container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]'>
        <div className='on-water max-w-3xl'>
          <HeroBadge>Discovery deck</HeroBadge>
          <Enter variant='sink' delay={0.1}>
            <h1 className='mt-6 max-w-3xl text-5xl leading-none font-black tracking-tight sm:text-7xl'>
              Browse the soft side <span className='text-primary'>of the sea.</span>
            </h1>
          </Enter>
          <Enter variant='sink' delay={0.2}>
            <p className='text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg'>
              Search by name, location, pronouns, interests, or anything else that makes a profile feel like your kind of tide.
            </p>
          </Enter>
        </div>
        <div className='relative mx-auto hidden aspect-square w-full max-w-xs items-center justify-center lg:flex'>
          <Enter variant='ring' delay={0.15} className='border-primary/20 absolute inset-8 rounded-full border' />
          <Enter variant='ring' delay={0.25} className='border-primary/15 absolute inset-0 rounded-full border border-dashed' />
          <div style={shark.style} className={cn(shark.className, SHARK_HOVER, 'relative z-10')}>
            <div className={BOB_SHARK}>
              <Image
                unoptimized
                loading='eager'
                fetchPriority='high'
                width={320}
                height={320}
                src={SHARKS.small}
                alt='Two Blåhaj sharing a hug'
                className='h-auto w-72'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
