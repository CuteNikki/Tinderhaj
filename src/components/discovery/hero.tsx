'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';

const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const revealTransition = { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const };

export function DiscoveryHero() {
  return (
    <section className='relative isolate overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16'>
      <div className='pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[6rem_6rem] opacity-20 dark:opacity-25' />
      <div className='bg-primary/10 pointer-events-none absolute -top-16 -right-16 z-0 size-64 rounded-full blur-3xl lg:-top-8 lg:-right-8 lg:size-96' />
      <div className='bg-secondary/60 pointer-events-none absolute -bottom-24 -left-16 z-0 size-72 rounded-full blur-3xl lg:-bottom-12 lg:-left-8 lg:size-96' />
      <div className='relative z-10 container mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8'>
        <div className='max-w-3xl'>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.1 }}>
            <Badge variant='secondary' className='rounded-full p-4 font-semibold tracking-wide uppercase'>
              Discovery deck
            </Badge>
          </motion.div>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.2 }}>
            <h1 className='mt-6 max-w-3xl text-5xl leading-none font-black tracking-tight sm:text-7xl'>Browse the soft side of the sea.</h1>
          </motion.div>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.3 }}>
            <p className='text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg'>
              Search by name, location, pronouns, interests, or anything else that makes a profile feel like your kind of tide.
            </p>
          </motion.div>
        </div>
        <div className='relative mx-auto hidden aspect-square w-full max-w-xs items-center justify-center lg:flex'>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...revealTransition, delay: 0.15 }}
            className='border-primary/20 absolute inset-8 rounded-full border'
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...revealTransition, delay: 0.25 }}
            className='border-primary/15 absolute inset-0 rounded-full border border-dashed'
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.35 }}
            className='relative z-10'
          >
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 4.5, ease: 'easeInOut', repeat: Infinity }}>
              <Image unoptimized priority width={320} height={320} src='/blahajSmall.png' alt='Two Blåhaj sharing a hug' className='h-auto w-72' />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
