import type { Metadata } from 'next';
import Link from 'next/link';

import {
  ArrowRightIcon,
  BadgeCheckIcon,
  Code2Icon,
  SmileIcon,
  type LucideIcon,
} from 'lucide-react';

import { aboutMetadata } from '@/constants/metadata';

import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { socialLink } from '@/lib/social-link';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { IconCard } from '@/components/common/icon-card';
import { Logo } from '@/components/common/logo';
import { glassCard } from '@/components/common/ocean';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';
import { Section } from '@/components/sections/section';

export const metadata: Metadata = aboutMetadata;

/**
 * Tinderhaj at a glance, beside its story: a word or two each, so the rows
 * look alike, in an order that keeps their lengths from stepping down the card.
 */
const FACTS: { label: string; value: React.ReactNode }[] = [
  { label: 'Started', value: 'December 2024' },
  { label: 'Made in', value: 'Germany' },
  {
    label: 'Made by',
    value: (
      <a
        href='https://niso.moe'
        target='_blank'
        rel='noreferrer'
        className='underline hover:text-primary'
      >
        One person
      </a>
    ),
  },
  {
    label: 'Code',
    value: (
      <a
        href={socialLink('github')}
        target='_blank'
        rel='noreferrer'
        className='underline hover:text-primary'
      >
        Open source
      </a>
    ),
  },
  { label: 'Price', value: 'Free' },
  // As the privacy policy says
  { label: 'Ads', value: 'None' },
  { label: 'Moderated', value: 'Every profile' },
];

const VALUES: {
  title: string;
  copy: string;
  icon: LucideIcon;
  link?: { label: string; href: string };
}[] = [
  {
    title: 'Sharks, not people',
    copy: "Every profile is a plush. That keeps it light, and keeps people's own lives out of it.",
    icon: SmileIcon,
  },
  {
    title: 'Checked by hand',
    copy: 'A person looks at every profile before anyone else can see it, so discovery stays kind.',
    icon: BadgeCheckIcon,
    link: { label: 'Read the guidelines', href: '/guidelines' },
  },
  {
    title: 'Out in the open',
    copy: "The code is public, and so are bug reports and ideas. Anyone can see what's being worked on.",
    icon: Code2Icon,
    link: { label: 'See it on GitHub', href: socialLink('github') },
  },
];

export default function AboutPage() {
  return (
    <>
      <div
        data-water='band'
        className='flex flex-1 flex-col px-4 pt-28 pb-18 sm:px-5 lg:px-8'
      >
        {/* The page's header and what's under it together, so the water
            reaches past it all and its cards float in it, as glass */}
        <div id='page-header' className='container mx-auto max-w-7xl'>
          <Stagger variant='sink' className='mb-12'>
            <Eyebrow>About</Eyebrow>
            <PageTitle>Made for the sharks</PageTitle>
            <PageNote>Why Tinderhaj exists, and who&apos;s behind it.</PageNote>
          </Stagger>

          {/* The story, and beside it on wide screens, the short version, each on glass: side by side as one block, as tall as each other, the story's lines kept a readable length */}
          <div className='grid max-w-2xl grid-cols-1 gap-4 lg:max-w-5xl lg:grid-cols-[minmax(0,1fr)_20rem]'>
            <ScrollReveal
              delay={CONTENT_DELAY}
              variant='card'
              className={glassCard}
            >
              <Stagger
                gap={STAGGER}
                delay={CONTENT_DELAY}
                className='flex flex-col gap-4 p-6 text-base leading-relaxed text-pretty text-foreground/85 sm:p-8'
              >
                <p>
                  Blåhaj (often written Blahaj) is IKEA&apos;s big blue plush
                  shark. Plenty of people have one, a lot of people have
                  several, and every one of them has a personality its people
                  could tell you all about.
                </p>
                <p>
                  Tinderhaj gives those sharks somewhere to show it: a profile
                  of their own, a place to be found, and other sharks to meet.
                  It&apos;s a dating site, but the daters are plush, and the
                  point is the fun of it.
                </p>
                <p>
                  It started in December 2024 as a small side project, and
                  it&apos;s still made by one person, in the open on GitHub.
                  There&apos;s nothing to buy and nothing to unlock.
                </p>
                <p>
                  Questions, ideas, or just want to say hi?
                  <Link
                    href='/contact'
                    className='flex w-fit items-center gap-1 font-semibold hover:underline'
                  >
                    Contact us
                    <ArrowRightIcon className='size-4' aria-hidden='true' />
                  </Link>
                </p>
              </Stagger>
            </ScrollReveal>
            <ScrollReveal
              delay={CONTENT_DELAY + STAGGER}
              variant='card'
              className={glassCard}
            >
              <aside aria-labelledby='at-a-glance' className='p-6'>
                {/* Headed across the top, over a line inside its padding like the card's other lines: the words centered, and the logo beside them, not counted in */}
                <div className='-mt-1 mb-6 flex justify-center border-b border-glass-border pb-5'>
                  <div className='relative text-center'>
                    <Logo className='absolute top-1/2 right-full mr-3 size-10 -translate-y-1/2' />
                    <h2
                      id='at-a-glance'
                      className='text-lg leading-tight font-black tracking-tight'
                    >
                      Tinderhaj
                    </h2>
                    <p className='text-sm text-muted-foreground'>At a glance</p>
                  </div>
                </div>
                <dl className='grid gap-3 text-sm'>
                  {FACTS.map(({ label, value }) => (
                    <div key={label} className='flex justify-between gap-4'>
                      <dt className='text-muted-foreground'>{label}</dt>
                      <dd className='text-right font-semibold'>{value}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Section
        eyebrow='What we care about'
        title='Soft sharks,'
        highlight='kind waters.'
        note='The few things everything else here is built around.'
        tone='background'
      >
        <Stagger
          as='ul'
          itemAs='li'
          variant='card'
          gap={STAGGER}
          delay={0.1}
          className='grid gap-4 md:grid-cols-3'
          itemClassName='h-full'
        >
          {VALUES.map((value) => (
            <IconCard key={value.title} {...value} heading='h3' />
          ))}
        </Stagger>
      </Section>

      <ReadyWhenYouAre />
    </>
  );
}
