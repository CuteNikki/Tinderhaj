import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import {
  ArrowDown,
  ArrowRight,
  Search,
  Sparkles,
  Users2Icon,
  ZapIcon,
} from 'lucide-react';

import { SHARKS } from '@/lib/images';
import { bob, BOB_SHARK, SHARK_HOVER } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { Enter, enter } from '@/components/common/enter';
import { HeroBadge } from '@/components/common/hero-badge';
import { HeroWater } from '@/components/common/hero-water';
import { glass, sunlit } from '@/components/common/ocean';
import { DiscoveryLink } from '@/components/discovery/link';
import { AnimatedCount } from '@/components/home/animated-count';
import { ScrollToElement } from '@/components/home/scroll-to-element';
import { TypographyH1, TypographyMuted } from '@/components/typography';
import { Button } from '@/components/ui/button';

/** `profileCount` is rendered on the server, where the count comes from. Its line comes in at 0.4s, so counts start then. */
export function Hero({ profileCount }: { profileCount: React.ReactNode }) {
  const shark = enter('swim', 0.3);
  const heart = enter('pop', 0.9);
  const hint = enter('pop', 1);

  return (
    <section
      id='hero'
      data-water='band'
      data-floor='muted'
      className='relative isolate overflow-hidden px-4 sm:px-5 lg:px-8'
    >
      <HeroWater floor='muted' />
      <div className='relative z-10 container mx-auto grid min-h-screen max-w-7xl items-center gap-4 pt-24 pb-16 lg:grid-cols-2 lg:gap-8'>
        <div className='on-water relative z-10 flex max-w-2xl flex-col items-start'>
          <HeroBadge
            icon={
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-primary' />
              </span>
            }
          >
            The plush dating club
          </HeroBadge>
          <Enter variant='sink' delay={0.1}>
            <TypographyH1 className='mt-6 max-w-3xl text-4xl leading-none font-black tracking-tight xs:text-5xl md:text-7xl xl:text-8xl'>
              Make a splash.
              <br />
              <span className='text-primary'>Meet your match.</span>
            </TypographyH1>
          </Enter>
          <Enter variant='sink' delay={0.2}>
            <TypographyMuted className='mt-2 max-w-lg text-base leading-relaxed text-pretty sm:mt-6 sm:text-lg'>
              A warm, weird little corner of the internet for Blåhaj looking for
              their person. Browse profiles, find a feeling, make it official.
            </TypographyMuted>
          </Enter>
          <Enter
            variant='sink'
            delay={0.3}
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
          </Enter>
          <Enter
            variant='sink'
            delay={0.4}
            className='mt-4 flex flex-wrap gap-x-4 gap-y-2 border-foreground/10 sm:mt-6'
          >
            <div className='flex items-center gap-2 text-sm'>
              <Users2Icon className='h-4 w-4 text-primary' />
              <Suspense
                fallback={
                  <TypographyMuted className='text-sm'>
                    0 profiles
                  </TypographyMuted>
                }
              >
                <TypographyMuted className='text-sm tabular-nums'>
                  {profileCount}
                </TypographyMuted>
              </Suspense>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <ZapIcon className='h-4 w-4 text-primary' />
              <TypographyMuted className='text-sm tabular-nums'>
                <AnimatedCount target={100} duration={1000} delay={0.4} />%
                plush certified
              </TypographyMuted>
            </div>
          </Enter>
        </div>
        <div className='relative mx-auto flex aspect-square w-full max-w-lg min-w-0 items-center justify-center overflow-hidden'>
          <Enter
            variant='ring'
            delay={0.15}
            className='absolute top-1/2 left-1/2 size-3/4 -translate-1/2 rounded-full border border-primary/20 bg-[radial-gradient(circle_closest-side,var(--ocean-light),transparent)]'
          />
          <Enter
            variant='ring'
            delay={0.25}
            className='absolute top-1/2 left-1/2 size-11/12 -translate-1/2 rounded-full border border-dashed border-primary/15'
          />
          {/* The glass pops in on itself, inside what bobs, so it's frosted from the start (see glass) */}
          <div
            {...bob({
              delay: 0.6,
              className: 'absolute top-4 left-1/2 z-10 -translate-x-1/2',
            })}
          >
            <Enter
              variant='pop'
              delay={0.6}
              className={`${glass} flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap shadow-lg`}
            >
              <Sparkles className='h-3.5 w-3.5 text-[#ed3867]' /> A match worth
              meeting
            </Enter>
          </div>
          <div className='relative z-1 w-3/4 max-w-md'>
            <div
              className={cn(shark.className, SHARK_HOVER)}
              style={shark.style}
            >
              <div className={BOB_SHARK}>
                <Image
                  unoptimized
                  loading='eager'
                  fetchPriority='high'
                  draggable={false}
                  width={448}
                  height={448}
                  src={SHARKS.float}
                  alt='A Blåhaj ready to find a match'
                  className='h-auto w-full select-none'
                />
              </div>
            </div>
          </div>
          <div
            {...bob({
              delay: 0.2,
              className: 'absolute right-4 bottom-8 z-10',
            })}
          >
            <Enter
              variant='pop'
              delay={0.75}
              className={`${glass} flex max-w-64 items-center gap-3 rounded-2xl p-3 shadow-xl`}
            >
              <Image
                width={64}
                height={64}
                src={SHARKS.hug}
                alt=''
                className='h-14 w-14 shrink-0 rounded-lg bg-primary/10 object-contain dark:bg-white/20'
              />
              <div>
                <p className='text-sm font-bold'>Good chemistry</p>
                <p className='mt-1 text-xs leading-relaxed text-glass-muted'>
                  The right people are out there. You&apos;ll find &apos;em.
                </p>
              </div>
            </Enter>
          </div>
          <div
            {...bob({
              delay: 1,
              rotate: 12,
              className: 'absolute top-1/4 right-8',
            })}
          >
            <div
              style={heart.style}
              className={cn(
                heart.className,
                glass,
                'spring-hover flex size-20 rotate-12 items-center justify-center rounded-full shadow-xl hover:scale-115 hover:rotate-4'
              )}
            >
              <Image
                width={80}
                height={80}
                src={SHARKS.heart}
                alt='Heart'
                className='w-12 sm:w-15'
              />
            </div>
          </div>
        </div>
      </div>
      {/* Riding the waves, like the shark's own little cards float by it */}
      <div
        {...bob({
          delay: 1.2,
          className:
            'absolute bottom-4 left-1/2 z-20 -translate-x-1/2 sm:bottom-6',
        })}
      >
        <ScrollToElement
          targetId='guide'
          style={hint.style}
          className={cn(
            hint.className,
            glass,
            'group/hint flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap shadow-lg transition-[filter] hover:brightness-110'
          )}
        >
          See how it works
          <ArrowDown className='h-3.5 w-3.5 text-glass-muted transition-transform duration-300 ease-bounce group-hover/hint:translate-y-0.5' />
        </ScrollToElement>
      </div>
    </section>
  );
}
