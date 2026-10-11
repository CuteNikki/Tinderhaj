import { ArrowRightIcon, BadgeCheckIcon, Code2Icon, type LucideIcon, SmileIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { socialLink } from '@/lib/social-link';
import { aboutMetadata } from '@/constants/metadata';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { Logo } from '@/components/common/logo';
import { IconCard } from '@/components/common/icon-card';
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
      <a href='https://niso.moe' target='_blank' rel='noreferrer' className='hover:text-primary underline'>
        One person
      </a>
    ),
  },
  {
    label: 'Code',
    value: (
      <a href={socialLink('github')} target='_blank' rel='noreferrer' className='hover:text-primary underline'>
        Open source
      </a>
    ),
  },
  { label: 'Price', value: 'Free' },
  // As the privacy policy says
  { label: 'Ads', value: 'None' },
  { label: 'Moderated', value: 'Every profile' },
];

const VALUES: { title: string; copy: string; icon: LucideIcon; link?: { label: string; href: string } }[] = [
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
      <div data-water='band' data-tone='muted' className='flex flex-1 flex-col px-4 pt-28 pb-18 sm:px-5 lg:px-8'>
        <div className='container mx-auto max-w-7xl'>
          <Stagger id='page-header' variant='sink' className='mb-24'>
            <Eyebrow>About</Eyebrow>
            <PageTitle>Made for the sharks</PageTitle>
            <PageNote>Why Tinderhaj exists, and who&apos;s behind it.</PageNote>
          </Stagger>

          {/* The story, and beside it on wide screens, the short version */}
          <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16'>
            <Stagger gap={STAGGER} delay={CONTENT_DELAY} className='text-foreground/85 flex max-w-2xl flex-col gap-4 text-base leading-relaxed text-pretty'>
              <p>
                Blåhaj is IKEA&apos;s big blue plush shark. Plenty of people have one, a lot of people have several, and every one of them has a personality its
                people could tell you all about.
              </p>
              <p>
                Tinderhaj gives those sharks somewhere to show it: a profile of their own, a place to be found, and other sharks to meet. It&apos;s a dating
                site, but the daters are plush, and the point is the fun of it.
              </p>
              <p>
                It started in December 2024 as a small side project, and it&apos;s still made by one person, in the open on GitHub. There&apos;s nothing to buy
                and nothing to unlock.
              </p>
              <p>
                Questions, ideas, or just want to say hi?
                <Link href='/contact' className='text-primary flex w-fit items-center gap-1 font-semibold hover:underline'>
                  Contact us
                  <ArrowRightIcon className='size-4' aria-hidden='true' />
                </Link>
              </p>
              {/* The small print, right under the story, before the card on small screens too */}
              <p className='text-muted-foreground border-border mt-2 border-t pt-4 text-xs leading-relaxed'>
                Blåhaj is a trademark of IKEA. Tinderhaj is an independent project, not affiliated with IKEA or Tinder.
              </p>
            </Stagger>
            <ScrollReveal delay={CONTENT_DELAY + STAGGER} variant='card' className='max-w-2xl'>
              <aside aria-labelledby='at-a-glance' className='border-foreground/10 bg-card rounded-2xl border p-6 shadow-sm'>
                {/* Headed across the top, over a line: the words centered, and the logo beside them, not counted in */}
                <div className='border-border -mx-6 -mt-6 mb-6 flex justify-center border-b px-6 py-5'>
                  <div className='relative text-center'>
                    <Logo className='absolute top-1/2 right-full mr-3 size-10 -translate-y-1/2' />
                    <h2 id='at-a-glance' className='text-lg leading-tight font-black tracking-tight'>
                      Tinderhaj
                    </h2>
                    <p className='text-muted-foreground text-sm'>At a glance</p>
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
        <Stagger as='ul' itemAs='li' variant='card' gap={STAGGER} delay={0.1} className='grid gap-4 md:grid-cols-3' itemClassName='h-full'>
          {VALUES.map((value) => (
            <IconCard key={value.title} {...value} heading='h3' />
          ))}
        </Stagger>
      </Section>

      <ReadyWhenYouAre />
    </>
  );
}
