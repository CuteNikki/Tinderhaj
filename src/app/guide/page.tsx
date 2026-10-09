import { ArrowRight, BadgeCheckIcon, HeartIcon, type LucideIcon, SearchIcon, UserRoundPlusIcon, WandSparklesIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { MAX_PROFILES } from '@/constants/auth';
import { guideMetadata } from '@/constants/metadata';
import { HEARTS_PER_DAY } from '@/lib/hearts';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { sunlit } from '@/components/common/ocean';
import { Stagger } from '@/components/common/stagger';
import { DiscoveryLink } from '@/components/discovery/link';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Questions } from '@/components/sections/questions';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = guideMetadata;

const STEPS: { title: string; copy: string; icon: LucideIcon; link?: { label: string; href: string } }[] = [
  {
    title: 'Sign up',
    copy: 'With an email and a password, or with an account you already have elsewhere. Passkeys and two-step sign-in are there if you want them.',
    icon: UserRoundPlusIcon,
    link: { label: 'Create an account', href: '/sign-up' },
  },
  {
    title: 'Make a profile for your shark',
    copy: `A name, a picture or two, a few words and what it loves. Its card shows beside you as you fill it in. Up to ${MAX_PROFILES} sharks on one account.`,
    icon: WandSparklesIcon,
  },
  {
    title: 'Send it for review',
    copy: 'A moderator checks every profile by hand. Once it’s verified it shows up in discovery; if something needs changing, you’re told what.',
    icon: BadgeCheckIcon,
  },
  {
    title: 'Browse discovery',
    copy: 'Search by name, location, pronouns or interests. Newly verified sharks get a boost for their first few days.',
    icon: SearchIcon,
    link: { label: 'Open discovery', href: '/discovery' },
  },
  {
    title: 'Send hearts, find matches',
    copy: `Heart a shark you like, up to ${HEARTS_PER_DAY} a day for each of yours. When it hearts one of yours back, that’s a match, and both of you can see it.`,
    icon: HeartIcon,
  },
];

export default function GuidePage() {
  return (
    <>
      <div data-water='band' className='flex flex-1 flex-col px-4 pt-28 pb-18 sm:px-5 lg:px-8'>
        <div className='container mx-auto max-w-7xl'>
          <Stagger id='page-header' variant='sink' className='mb-24'>
            <Eyebrow>Guide</Eyebrow>
            <PageTitle>How Tinderhaj works</PageTitle>
            <PageNote>From signing up to your shark&apos;s first match, in five steps.</PageNote>
          </Stagger>

          <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16'>
            <Stagger as='ul' itemAs='li' variant='card' gap={STAGGER} delay={CONTENT_DELAY} className='grid gap-4'>
              {STEPS.map(({ title, copy, icon: Icon, link }, index) => (
                <div key={title} className='border-foreground/10 bg-card flex gap-4 rounded-2xl border p-5 shadow-sm sm:gap-5 sm:p-6'>
                  <span className='bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-full'>
                    <Icon className='size-5' aria-hidden='true' />
                  </span>
                  <div className='min-w-0'>
                    <p className='text-muted-foreground font-mono text-xs'>Step {index + 1}</p>
                    <h2 className='mt-1 text-lg font-bold'>{title}</h2>
                    <p className='text-muted-foreground mt-1 text-sm leading-relaxed text-pretty'>{copy}</p>
                    {link && (
                      <Link href={link.href} className='text-primary mt-2 inline-flex items-center gap-1 text-sm font-semibold hover:underline'>
                        {link.label}
                        <ArrowRight className='size-3.5' aria-hidden='true' />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </Stagger>

            {/* Beside the steps on wide screens, staying in view: somewhere to start */}
            <ScrollReveal delay={CONTENT_DELAY + STAGGER} variant='card' className='lg:sticky lg:top-24'>
              <div className='border-foreground/10 bg-card rounded-2xl border p-6 shadow-sm'>
                <h2 className='text-xl font-bold'>Ready to dive in?</h2>
                <p className='text-muted-foreground mt-2 text-sm leading-relaxed text-pretty'>It&apos;s free. Make an account, or have a look around first.</p>
                <div className='mt-5 flex flex-col gap-2'>
                  <Button size='lg' className={sunlit} asChild>
                    <Link href='/sign-up'>
                      Join
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button size='lg' variant='outline' asChild>
                    <DiscoveryLink>
                      Explore first
                      <SearchIcon />
                    </DiscoveryLink>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <Questions tone='muted' />
      <ReadyWhenYouAre />
    </>
  );
}
