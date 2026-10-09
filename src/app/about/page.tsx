import { BadgeCheckIcon, Code2Icon, type LucideIcon, SmileIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { GITHUB_URL } from '@/constants/contact';
import { aboutMetadata } from '@/constants/metadata';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { IconCard } from '@/components/common/icon-card';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';
import { Section } from '@/components/sections/section';

export const metadata: Metadata = aboutMetadata;

/** Tinderhaj at a glance, beside its story. */
const FACTS: { label: string; value: React.ReactNode }[] = [
  { label: 'Started', value: 'December 2024' },
  { label: 'Made in', value: 'Germany, by one person' },
  {
    label: 'Code',
    value: (
      <a href={GITHUB_URL} target='_blank' rel='noreferrer' className='hover:text-primary underline'>
        Open source on GitHub
      </a>
    ),
  },
  { label: 'Price', value: 'Free, for every shark' },
];

const VALUES: { title: string; copy: string; icon: LucideIcon; link?: { label: string; href: string } }[] = [
  {
    title: 'Sharks, not people',
    copy: 'Every profile is a plush. That keeps it light, and keeps people’s own lives out of it.',
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
    copy: 'The code is public, and so are bug reports and ideas. Anyone can see what’s being worked on.',
    icon: Code2Icon,
    link: { label: 'See it on GitHub', href: GITHUB_URL },
  },
];

export default function AboutPage() {
  return (
    <>
      <div data-water='band' className='flex flex-1 flex-col px-4 pt-28 pb-18 sm:px-5 lg:px-8'>
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
                and nothing to unlock. Questions, ideas or just saying hi:{' '}
                <Link href='/contact' className='text-primary font-semibold hover:underline'>
                  get in touch
                </Link>
                .
              </p>
            </Stagger>

            <ScrollReveal delay={CONTENT_DELAY + STAGGER} variant='card' className='lg:sticky lg:top-24'>
              <aside aria-labelledby='in-short' className='border-foreground/10 bg-card rounded-2xl border p-6 shadow-sm'>
                <div className='flex items-center gap-4'>
                  <Image
                    unoptimized
                    width={64}
                    height={64}
                    src='/blahajHug.webp'
                    alt=''
                    className='bg-primary/10 size-14 rounded-lg object-contain dark:bg-white/20'
                  />
                  <h2 id='in-short' className='text-xl font-bold'>
                    In short
                  </h2>
                </div>
                <dl className='mt-5 grid gap-3 text-sm'>
                  {FACTS.map(({ label, value }) => (
                    <div key={label} className='flex justify-between gap-4'>
                      <dt className='text-muted-foreground'>{label}</dt>
                      <dd className='text-right font-semibold'>{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className='text-muted-foreground border-border mt-5 border-t pt-4 text-xs leading-relaxed'>
                  Blåhaj is a trademark of IKEA. Tinderhaj is an independent project, not affiliated with IKEA or Tinder.
                </p>
              </aside>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Section eyebrow='What we care about' title='Soft sharks,' highlight='kind waters.' note='The few things everything else here is built around.'>
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
