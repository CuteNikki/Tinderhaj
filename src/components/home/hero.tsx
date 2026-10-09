'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { ArrowDown, ArrowRight, Search, Sparkles, Users2Icon, ZapIcon } from 'lucide-react';

import { after, bob, popIn, reveal, ringIn, sharkHover, spring, swimIn } from '@/lib/motion';

import { DiscoveryLink } from '@/components/discovery/link';
import { AnimatedCount } from '@/components/home/animated-count';
import { HeroBadge } from '@/components/common/hero-badge';
import { Ocean, glass, sunlit } from '@/components/common/ocean';
import { ScrollToElement } from '@/components/home/scroll-to-element';
import { TypographyH1, TypographyMuted } from '@/components/typography';
import { Button } from '@/components/ui/button';

/** `profileCount` is rendered on the server, where the count comes from. */
export function Hero({ profileCount }: { profileCount: React.ReactNode }) {
  return (
    <section id='hero' className='relative isolate overflow-hidden px-4 sm:px-5 lg:px-8'>
      <Ocean />
      <div className='relative z-10 container mx-auto grid min-h-screen max-w-7xl items-center gap-4 pt-24 pb-16 lg:grid-cols-2 lg:gap-8'>
        <div className='on-water relative z-10 flex max-w-2xl flex-col items-start'>
          <motion.div initial='hidden' animate='visible' variants={popIn} transition={spring.pop}>
            <HeroBadge
              icon={
                <span className='relative flex h-2 w-2'>
                  <span className='bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
                  <span className='bg-primary relative inline-flex h-2 w-2 rounded-full' />
                </span>
              }
            >
              The plush dating club
            </HeroBadge>
          </motion.div>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={after(0.1)}>
            <TypographyH1 className='xs:text-5xl mt-6 max-w-3xl text-4xl leading-none font-black tracking-tight md:text-7xl xl:text-8xl'>
              Make a splash.
              <br />
              <span className='text-primary'>Meet your match.</span>
            </TypographyH1>
          </motion.div>
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={after(0.2)}>
            <TypographyMuted className='mt-2 max-w-lg text-base leading-relaxed text-pretty sm:mt-6 sm:text-lg'>
              A warm, weird little corner of the internet for Blåhaj looking for their person. Browse profiles, find a feeling, make it official.
            </TypographyMuted>
          </motion.div>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={reveal}
            transition={after(0.3)}
            className='mt-4 flex w-full flex-wrap items-start gap-2 sm:mt-8'
          >
            <Button size='xl' className={sunlit} asChild>
              <Link href='/sign-up'>
                Join
                <ArrowRight />
              </Link>
            </Button>
            <Button size='xl' variant='outline' asChild>
              <DiscoveryLink>
                Explore
                <Search />
              </DiscoveryLink>
            </Button>
          </motion.div>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={reveal}
            transition={after(0.4)}
            className='border-foreground/10 mt-4 flex flex-wrap gap-x-4 gap-y-2 sm:mt-6'
          >
            <div className='flex items-center gap-2 text-sm'>
              <Users2Icon className='text-primary h-4 w-4' />
              <Suspense fallback={<TypographyMuted className='text-sm'>0 profiles</TypographyMuted>}>
                <TypographyMuted className='text-sm tabular-nums'>{profileCount}</TypographyMuted>
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
            initial='hidden'
            animate='visible'
            variants={ringIn}
            transition={after(0.15)}
            className='border-primary/20 absolute top-1/2 left-1/2 size-3/4 -translate-1/2 rounded-full border bg-[radial-gradient(circle_closest-side,var(--ocean-light),transparent)]'
          />
          <motion.div
            initial='hidden'
            animate='visible'
            variants={ringIn}
            transition={after(0.25)}
            className='border-primary/15 absolute top-1/2 left-1/2 size-11/12 -translate-1/2 rounded-full border border-dashed'
          />
          <motion.div
            initial='hidden'
            animate='visible'
            variants={popIn}
            transition={after(0.6, spring.pop)}
            className='absolute top-4 left-1/2 z-10 -translate-x-1/2'
          >
            <motion.div
              {...bob.small(0.6)}
              className={`${glass} flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap shadow-lg`}
            >
              <Sparkles className='h-3.5 w-3.5 text-[#ed3867]' /> A match worth meeting
            </motion.div>
          </motion.div>
          <div className='relative z-1 w-3/4 max-w-md'>
            <motion.div initial='hidden' animate='visible' variants={swimIn} transition={after(0.3, spring.pop)} whileHover={sharkHover}>
              <motion.div {...bob.shark}>
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
          <motion.div initial='hidden' animate='visible' variants={popIn} transition={after(0.75, spring.pop)} className='absolute right-4 bottom-8 z-10'>
            <motion.div {...bob.small(0.2)} className={`${glass} flex max-w-64 items-center gap-3 rounded-2xl p-3 shadow-xl`}>
              <Image
                unoptimized
                width={64}
                height={64}
                src='/blahajHug.webp'
                alt=''
                className='bg-primary/10 h-14 w-14 shrink-0 rounded-lg object-contain dark:bg-white/20'
              />
              <div>
                <p className='text-sm font-bold'>Good chemistry</p>
                <p className='text-glass-muted mt-1 text-xs leading-relaxed'>The right people are out there. You&apos;ll find &apos;em.</p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={popIn}
            transition={after(0.9, spring.pop)}
            whileHover={{ scale: 1.15, rotate: -8, transition: spring.snappy }}
            className='absolute top-1/4 right-8'
          >
            <motion.div {...bob.small(1, 12)} className={`${glass} flex size-20 rotate-12 items-center justify-center rounded-full shadow-xl`}>
              <Image unoptimized width={80} height={80} src='/blahajHeart.webp' alt='Heart' className='w-12 sm:w-15' />
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Riding the waves, like the shark's own little cards float by it */}
      <motion.div
        initial='hidden'
        animate='visible'
        variants={popIn}
        transition={after(1, spring.pop)}
        className='absolute bottom-4 left-1/2 z-20 -translate-x-1/2 sm:bottom-6'
      >
        <motion.div {...bob.small(1.2)}>
          <ScrollToElement
            targetId='guide'
            className={`${glass} group/hint flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap shadow-lg transition-[filter] hover:brightness-110`}
          >
            See how it works
            <ArrowDown className='text-glass-muted ease-bounce h-3.5 w-3.5 transition-transform duration-300 group-hover/hint:translate-y-0.5' />
          </ScrollToElement>
        </motion.div>
      </motion.div>
    </section>
  );
}
