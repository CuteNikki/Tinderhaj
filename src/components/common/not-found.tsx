'use client';

import { motion } from 'motion/react';

import { after, bob, popIn, sharkHover, sink, spring, STAGGER, swimIn } from '@/lib/motion';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowLeft, Compass, Radio, Search } from 'lucide-react';

import { HeroBadge } from '@/components/common/hero-badge';
import { Ocean, glass, sunlit } from '@/components/common/ocean';
import { DiscoveryLink } from '@/components/discovery/link';
import { Button } from '@/components/ui/button';

const orbitTransition = { duration: 18, ease: 'linear' as const, repeat: Infinity };

export function NotFoundPage() {
  return (
    <section className='relative isolate overflow-hidden px-4 sm:px-5 lg:px-8'>
      {/* Flowing into the sections below (see app/not-found.tsx) */}
      <Ocean into='fill-muted' />

      <div className='container mx-auto grid max-w-7xl items-center gap-10 pt-20 pb-32 md:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-24 lg:pb-36'>
        <div className='on-water order-2 max-w-xl md:order-1'>
          <HeroBadge icon={<Radio className='size-4 animate-pulse' aria-hidden='true' />} className='mb-6'>
            Signal lost
          </HeroBadge>
          <motion.h1
            initial='hidden'
            animate='visible'
            variants={sink}
            transition={after(STAGGER)}
            className='text-foreground text-6xl leading-[0.9] font-black tracking-tight sm:text-8xl'
          >
            404
            <br />
            <span className='text-primary'>gone fishing.</span>
          </motion.h1>
          <motion.p
            initial='hidden'
            animate='visible'
            variants={sink}
            transition={after(0.2)}
            className='text-muted-foreground mt-6 max-w-md text-base leading-relaxed text-pretty sm:text-lg'
          >
            This page drifted out of range. Let&apos;s get you back to the good stuff before the tide changes.
          </motion.p>
          <motion.div initial='hidden' animate='visible' variants={sink} transition={after(0.3)} className='mt-8 flex flex-wrap gap-3'>
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
          </motion.div>
        </div>

        <div className='relative order-1 mx-auto aspect-square w-full max-w-136 md:order-2'>
          <motion.div initial='hidden' animate='visible' variants={swimIn} transition={after(0.1, spring.pop)} className='absolute inset-0'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={orbitTransition}
              className='border-primary/20 absolute top-1/2 left-1/2 aspect-square w-[82%] -translate-1/2 rounded-full border border-dashed'
            >
              <span className='bg-primary absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full shadow-[0_0_1rem_var(--primary)]' />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ ...orbitTransition, duration: 26 }}
              className='border-primary/15 absolute top-1/2 left-1/2 aspect-square w-[62%] -translate-1/2 rounded-full border'
            >
              <span className='bg-foreground/70 absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rounded-full' />
            </motion.div>
            <div className='border-primary/10 absolute top-1/2 left-1/2 aspect-square w-[42%] -translate-1/2 rounded-full border' />
            <motion.div {...bob.shark} whileHover={sharkHover} className='absolute top-1/2 left-1/2 z-10 -translate-1/2'>
              <Image
                unoptimized
                src='/blahajThink.webp'
                width={320}
                height={320}
                alt='A Blåhaj looking for the missing page'
                className='h-32 w-32 drop-shadow-2xl'
              />
            </motion.div>
          </motion.div>
          {/* Popping in on their own once the shark's in, not swimming in with it, so they're frosted from the start (see glass) */}
          <motion.div {...bob.small(0.6)} className='absolute top-[14%] right-[8%] z-20'>
            <motion.div
              initial='hidden'
              animate='visible'
              variants={popIn}
              transition={after(0.45, spring.pop)}
              className={`${glass} flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-lg`}
            >
              <Compass className='h-3.5 w-3.5 text-[#ed3867]' /> Out of range
            </motion.div>
          </motion.div>
          <motion.div {...bob.small(0.2)} className='absolute bottom-[15%] left-[5%] z-20'>
            <motion.div
              initial='hidden'
              animate='visible'
              variants={popIn}
              transition={after(0.6, spring.pop)}
              className={`${glass} rounded-2xl px-4 py-3 shadow-xl`}
            >
              <p className='text-sm font-bold'>Last known location</p>
              <p className='text-glass-muted mt-1 text-xs leading-relaxed'>Somewhere between here &amp; there</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
