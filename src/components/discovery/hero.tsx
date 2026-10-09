'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

import { after, bob, ringIn, sharkHover, sink, spring, swimIn } from '@/lib/motion';

import { HeroBadge } from '@/components/common/hero-badge';
import { Ocean } from '@/components/common/ocean';

export function DiscoveryHero() {
  return (
    <section data-water='band' data-floor='card' className='relative isolate overflow-hidden px-4 pt-28 pb-24 sm:px-5 md:pt-32 md:pb-28 lg:px-8'>
      {/* The layout's band of water, carried on from the page before; this one only where browsers can't fit that to the hero */}
      <div className='own-water'>
        <Ocean into='fill-card' />
      </div>
      {/* Where the band of water across the top ends (see PageBand): the waves' height above the bottom, so they roll in where this hero ends */}
      <div id='page-header' aria-hidden='true' className='absolute inset-x-0 bottom-22 sm:bottom-26' />
      <div className='relative z-10 container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]'>
        <div className='on-water max-w-3xl'>
          <HeroBadge>Discovery deck</HeroBadge>
          <motion.div initial='hidden' animate='visible' variants={sink} transition={after(0.1)}>
            <h1 className='mt-6 max-w-3xl text-5xl leading-none font-black tracking-tight sm:text-7xl'>
              Browse the soft side <span className='text-primary'>of the sea.</span>
            </h1>
          </motion.div>
          <motion.div initial='hidden' animate='visible' variants={sink} transition={after(0.2)}>
            <p className='text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg'>
              Search by name, location, pronouns, interests, or anything else that makes a profile feel like your kind of tide.
            </p>
          </motion.div>
        </div>
        <div className='relative mx-auto hidden aspect-square w-full max-w-xs items-center justify-center lg:flex'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={ringIn}
            transition={after(0.15)}
            className='border-primary/20 absolute inset-8 rounded-full border'
          />
          <motion.div
            initial='hidden'
            animate='visible'
            variants={ringIn}
            transition={after(0.25)}
            className='border-primary/15 absolute inset-0 rounded-full border border-dashed'
          />
          <motion.div
            initial='hidden'
            animate='visible'
            variants={swimIn}
            transition={after(0.3, spring.pop)}
            whileHover={sharkHover}
            className='relative z-10'
          >
            <motion.div {...bob.shark}>
              <Image unoptimized priority width={320} height={320} src='/blahajSmall.png' alt='Two Blåhaj sharing a hug' className='h-auto w-72' />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
