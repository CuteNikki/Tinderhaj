'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { ArrowDown, ArrowRight, Search, Sparkles, Users2Icon, ZapIcon } from 'lucide-react';

import { AnimatedCount } from '@/components/home/animated-count';
import { ScrollToElement } from '@/components/home/scroll-to-element';
import { TypographyH1, TypographyMuted } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Hero() {
  const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
  const revealTransition = { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const };

  return (
    <section id='hero' className='bg-background relative isolate overflow-hidden'>
      <div className='pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[6rem_6rem] opacity-20 dark:opacity-25' />
      <div className='bg-primary/10 pointer-events-none absolute -top-16 -right-16 z-0 size-64 rounded-full blur-3xl lg:-top-8 lg:-right-8 lg:size-96' />
      <div className='bg-secondary/60 pointer-events-none absolute -bottom-24 -left-16 z-0 size-72 rounded-full blur-3xl lg:-bottom-12 lg:-left-8 lg:size-96' />
      <div className='relative z-10 container mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-24 md:px-8 lg:grid-cols-2 lg:gap-12'>
        <div className='relative z-10 flex max-w-2xl flex-col items-start'>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.1 }}>
            <Badge
              variant='secondary'
              className='animate-in fade-in slide-in-from-bottom-4 rounded-full p-4 font-semibold tracking-wide uppercase delay-100 duration-700'
            >
              <span className='relative mr-2 flex h-2 w-2'>
                <span className='bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
                <span className='bg-primary relative inline-flex h-2 w-2 rounded-full' />
              </span>
              The plush dating club
            </Badge>
          </motion.div>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.2 }}>
            <TypographyH1 className='mt-6 max-w-3xl text-5xl leading-none font-black tracking-tight sm:text-7xl lg:text-8xl'>
              Make a splash.
              <br />
              <span className='text-primary'>Meet your match.</span>
            </TypographyH1>
          </motion.div>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.3 }}>
            <TypographyMuted className='mt-6 max-w-lg text-base leading-relaxed text-pretty sm:text-lg'>
              A warm, weird little corner of the internet for Blåhaj looking for their person. Browse profiles, find a feeling, make it official.
            </TypographyMuted>
          </motion.div>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={reveal}
            transition={{ ...revealTransition, delay: 0.4 }}
            className='mt-8 flex w-full flex-col items-start gap-3 sm:flex-row'
          >
            <Button size='lg' className='h-12 rounded-full px-6' asChild>
              <Link href='/sign-up'>
                Create your profile
                <ArrowRight />
              </Link>
            </Button>
            <Button size='lg' className='h-12 rounded-full px-6' asChild variant='outline'>
              <Link href='/discovery'>
                Explore matches
                <Search />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={reveal}
            transition={{ ...revealTransition, delay: 0.5 }}
            className='border-foreground/10 mt-6 flex flex-wrap gap-x-6 gap-y-2'
          >
            <div className='flex items-center gap-2 text-sm'>
              <Users2Icon className='text-primary h-4 w-4' />
              <Suspense fallback={<TypographyMuted className='text-sm'>0 profiles</TypographyMuted>}>
                <TypographyMuted className='text-sm tabular-nums'>
                  <AnimatedCount target={1234} duration={1000} localize /> profiles
                </TypographyMuted>
              </Suspense>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <ZapIcon className='text-primary h-4 w-4' />
              <TypographyMuted className='text-sm tabular-nums'>
                <AnimatedCount target={100} duration={1000} />% plush certified
              </TypographyMuted>
            </div>
          </motion.div>
        </div>
        <div className='relative mx-auto flex aspect-square w-full max-w-lg min-w-0 items-center justify-center overflow-hidden'>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...revealTransition, delay: 0.15 }}
            className='border-primary/20 absolute top-1/2 left-1/2 size-3/4 -translate-1/2 rounded-full border'
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...revealTransition, delay: 0.25 }}
            className='border-primary/15 absolute top-1/2 left-1/2 size-11/12 -translate-1/2 rounded-full border border-dashed'
          />
          <motion.div
            initial='hidden'
            animate='visible'
            variants={reveal}
            transition={{ ...revealTransition, delay: 0.35 }}
            className='border-foreground/10 bg-background/80 absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold whitespace-nowrap shadow-lg backdrop-blur-sm'
          >
            <Sparkles className='text-primary h-3.5 w-3.5' /> A match worth meeting
          </motion.div>
          <div className='relative z-1 w-3/4 max-w-md'>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...revealTransition, delay: 0.45 }}>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}>
                <Image
                  unoptimized
                  priority
                  draggable={false}
                  width={448}
                  height={448}
                  src='/blahaj-float.webp'
                  alt='A Blåhaj ready to find a match'
                  className='h-auto w-full select-none'
                />
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={reveal}
            transition={{ ...revealTransition, delay: 0.65 }}
            className='border-foreground/10 bg-background/90 absolute right-4 bottom-8 z-10 flex max-w-64 -rotate-3 items-center gap-3 rounded-xl border p-3 shadow-xl backdrop-blur-md'
          >
            <Image unoptimized width={64} height={64} src='/blahajHug.webp' alt='' className='bg-primary/10 h-14 w-14 shrink-0 rounded-lg object-contain' />
            <div>
              <p className='text-sm font-bold'>Good chemistry</p>
              <p className='text-muted-foreground mt-1 text-xs leading-relaxed'>The right people are out there. You&apos;ll find &apos;em.</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...revealTransition, delay: 0.9 }}
            className='absolute top-1/4 right-8'
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [12, 8, 12] }}
              transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
              className='bg-primary/15 flex size-20 rotate-12 items-center justify-center rounded-full shadow-xl'
            >
              <Image unoptimized width={80} height={80} src='/blahajHeart.webp' alt='Heart' className='w-12 sm:w-15' />
            </motion.div>
          </motion.div>
        </div>
      </div>
      <ScrollToElement
        targetId='guide'
        className='absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 animate-bounce items-center gap-2 text-xs font-semibold tracking-widest uppercase opacity-70 hover:opacity-100'
      >
        See how it works <ArrowDown className='h-4 w-4' />
      </ScrollToElement>
    </section>
  );
}
