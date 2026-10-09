'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

import { after, popIn, reveal, spring } from '@/lib/motion';

import { Ocean, glass } from '@/components/common/ocean';
import { Badge } from '@/components/ui/badge';

export function DiscoveryHero() {
  return (
    <section className='relative isolate overflow-hidden pt-28 pb-24 md:pt-32 md:pb-28'>
      <Ocean into='fill-card' />
      <div className='relative z-10 container mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8'>
        <div className='max-w-3xl'>
          <motion.div initial='hidden' animate='visible' variants={popIn} transition={spring.pop}>
            <Badge className={`${glass} rounded-full p-4 font-semibold tracking-wide uppercase shadow-lg`}>Discovery deck</Badge>
          </motion.div>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={after(0.1)}>
            <h1 className='mt-6 max-w-3xl text-5xl leading-none font-black tracking-tight sm:text-7xl'>Browse the soft side of the sea.</h1>
          </motion.div>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={after(0.2)}>
            <p className='text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg'>
              Search by name, location, pronouns, interests, or anything else that makes a profile feel like your kind of tide.
            </p>
          </motion.div>
        </div>
        <div className='relative mx-auto hidden aspect-square w-full max-w-xs items-center justify-center lg:flex'>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={after(0.15)}
            className='border-primary/20 absolute inset-8 rounded-full border'
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={after(0.25)}
            className='border-primary/15 absolute inset-0 rounded-full border border-dashed'
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.85, rotate: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={after(0.3, spring.pop)}
            whileHover={{ scale: 1.05, rotate: 3, transition: spring.snappy }}
            className='relative z-10'
          >
            <motion.div animate={{ y: [0, 6, 0], rotate: [0, 2, 0, -2, 0] }} transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity }}>
              <Image unoptimized priority width={320} height={320} src='/blahajSmall.png' alt='Two Blåhaj sharing a hug' className='h-auto w-72' />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
