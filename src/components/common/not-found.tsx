'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowLeft, Compass, Radio, Search } from 'lucide-react';

import { DiscoveryLink } from '@/components/discovery/link';
import { Button } from '@/components/ui/button';

const orbitTransition = { duration: 18, ease: 'linear' as const, repeat: Infinity };

export function NotFoundPage() {
  return (
    <section className='bg-background relative isolate flex flex-1 items-center overflow-hidden'>
      <div className='pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-25' />
      <div className='bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 size-112 -translate-1/2 rounded-full blur-3xl' />

      <div className='container mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 lg:gap-16 lg:py-24'>
        <div className='order-2 max-w-xl md:order-1'>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
            className='text-primary mb-5 flex items-center gap-2 text-xs font-bold tracking-[0.24em] uppercase'
          >
            <Radio className='h-4 w-4 animate-pulse' /> Signal lost
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className='text-foreground text-6xl leading-[0.9] font-black tracking-tight sm:text-8xl'
          >
            404
            <br />
            <span className='text-primary'>gone fishing.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className='text-muted-foreground mt-6 max-w-md text-base leading-relaxed text-pretty sm:text-lg'
          >
            This page drifted out of range. Let&apos;s get you back to the good stuff before the tide changes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className='mt-8 flex flex-wrap gap-3'
          >
            <Button size='lg' className='h-12 rounded-full px-6' asChild>
              <Link href='/'>
                <ArrowLeft />
                Back home
              </Link>
            </Button>
            <Button size='lg' variant='outline' className='h-12 rounded-full px-6' asChild>
              <DiscoveryLink>
                Find a match
                <Search />
              </DiscoveryLink>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.86, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className='relative order-1 mx-auto aspect-square w-full max-w-136 md:order-2'
        >
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
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
            className='absolute top-1/2 left-1/2 z-10 -translate-1/2'
          >
            <Image
              unoptimized
              src='/blahajThink.webp'
              width={320}
              height={320}
              alt='A Blåhaj looking for the missing page'
              className='h-32 w-32 drop-shadow-2xl'
            />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity, delay: 0.6 }}
            className='border-foreground/10 bg-background/80 absolute top-[14%] right-[8%] z-20 flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-sm'
          >
            <Compass className='text-primary h-3.5 w-3.5' /> Out of range
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, delay: 0.2 }}
            className='border-foreground/10 bg-background/90 absolute bottom-[15%] left-[5%] z-20 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-md'
          >
            <p className='text-primary text-[0.65rem] font-bold tracking-widest uppercase'>Last known location</p>
            <p className='mt-1 text-sm font-bold'>Somewhere between here &amp; there</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
