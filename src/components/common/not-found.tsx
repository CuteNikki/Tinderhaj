'use client';

import Image from 'next/image';
import Link from 'next/link';

import { SHARKS } from '@/lib/images';
import { BOB_SHARK, bob, SHARK_HOVER, STAGGER } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { ArrowLeft, Compass, Radio, Search } from 'lucide-react';

import { Enter } from '@/components/common/enter';
import { HeroBadge } from '@/components/common/hero-badge';
import { HeroWater } from '@/components/common/hero-water';
import { glass, sunlit } from '@/components/common/ocean';
import { DiscoveryLink } from '@/components/discovery/link';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    // Flowing into the sections below (see app/not-found.tsx)
    <section data-water='band' data-floor='muted' className='relative isolate overflow-hidden px-4 sm:px-5 lg:px-8'>
      <HeroWater floor='muted' />

      <div className='container mx-auto grid max-w-7xl items-center gap-10 pt-20 pb-32 md:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-24 lg:pb-36'>
        <div className='on-water order-2 max-w-xl md:order-1'>
          <HeroBadge icon={<Radio className='size-4 animate-pulse' aria-hidden='true' />} className='mb-6'>
            Signal lost
          </HeroBadge>
          <Enter as='h1' variant='sink' delay={STAGGER} className='text-foreground text-6xl leading-[0.9] font-black tracking-tight sm:text-8xl'>
            404
            <br />
            <span className='text-primary'>gone fishing.</span>
          </Enter>
          <Enter as='p' variant='sink' delay={0.2} className='text-muted-foreground mt-6 max-w-md text-base leading-relaxed text-pretty sm:text-lg'>
            This page drifted out of range. Let&apos;s get you back to the good stuff before the tide changes.
          </Enter>
          <Enter variant='sink' delay={0.3} className='mt-8 flex flex-wrap gap-3'>
            <Button size='xl' className={sunlit} asChild>
              <Link href='/'>
                <ArrowLeft />
                Back home
              </Link>
            </Button>
            <Button size='xl' variant='outline' asChild>
              <DiscoveryLink>
                Find a match
                <Search />
              </DiscoveryLink>
            </Button>
          </Enter>
        </div>

        <div className='relative order-1 mx-auto aspect-square w-full max-w-136 md:order-2'>
          <Enter variant='swim' delay={0.1} className='absolute inset-0'>
            <div className='border-primary/20 absolute top-1/2 left-1/2 aspect-square w-[82%] -translate-1/2 animate-[spin_18s_linear_infinite] rounded-full border border-dashed'>
              <span className='bg-primary absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full shadow-[0_0_1rem_var(--primary)]' />
            </div>
            <div className='border-primary/15 absolute top-1/2 left-1/2 aspect-square w-[62%] -translate-1/2 animate-[spin_26s_linear_infinite_reverse] rounded-full border'>
              <span className='bg-foreground/70 absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rounded-full' />
            </div>
            <div className='border-primary/10 absolute top-1/2 left-1/2 aspect-square w-[42%] -translate-1/2 rounded-full border' />
            <div className={cn(BOB_SHARK, SHARK_HOVER, 'absolute top-1/2 left-1/2 z-10 -translate-1/2')}>
              <Image
                unoptimized
                src={SHARKS.think}
                width={320}
                height={320}
                alt='A Blåhaj looking for the missing page'
                className='h-32 w-32 drop-shadow-2xl'
              />
            </div>
          </Enter>
          {/* Popping in on their own once the shark's in, not swimming in with it, so they're frosted from the start (see glass) */}
          <div {...bob({ delay: 0.6, className: 'absolute top-[14%] right-[8%] z-20' })}>
            <Enter variant='pop' delay={0.45} className={`${glass} flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-lg`}>
              <Compass className='h-3.5 w-3.5 text-[#ed3867]' /> Out of range
            </Enter>
          </div>
          <div {...bob({ delay: 0.2, className: 'absolute bottom-[15%] left-[5%] z-20' })}>
            <Enter variant='pop' delay={0.6} className={`${glass} rounded-2xl px-4 py-3 shadow-xl`}>
              <p className='text-sm font-bold'>Last known location</p>
              <p className='text-glass-muted mt-1 text-xs leading-relaxed'>Somewhere between here &amp; there</p>
            </Enter>
          </div>
        </div>
      </div>
    </section>
  );
}
