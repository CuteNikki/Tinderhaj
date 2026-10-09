import { BugIcon, Code2Icon, HeartHandshakeIcon, type LucideIcon, Share2Icon } from 'lucide-react';
import type { Metadata } from 'next';

import { GITHUB_URL } from '@/constants/contact';
import { communityMetadata } from '@/constants/metadata';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { IconCard } from '@/components/common/icon-card';
import { Stagger } from '@/components/common/stagger';
import { SocialLinks } from '@/components/contact/social-links';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';
import { Section } from '@/components/sections/section';

export const metadata: Metadata = communityMetadata;

const WAYS_IN: { title: string; copy: string; icon: LucideIcon; link: { label: string; href: string } }[] = [
  {
    title: 'Show off your sharks',
    copy: 'Every account has a page at its username with all its verified sharks on it. Share the link anywhere.',
    icon: Share2Icon,
    link: { label: 'Your profiles', href: '/dashboard/profiles' },
  },
  {
    title: 'Bugs and ideas',
    copy: 'Something broken, or something you wish it did? Open an issue on GitHub, where everyone can follow along.',
    icon: BugIcon,
    link: { label: 'Open an issue', href: `${GITHUB_URL}/issues` },
  },
  {
    title: 'Under the hood',
    copy: 'All of Tinderhaj’s code is on GitHub, if you’d like a look at how it’s made.',
    icon: Code2Icon,
    link: { label: 'See the code', href: GITHUB_URL },
  },
  {
    title: 'Keep it kind',
    copy: 'What makes a good shark profile, and what gets one sent back. Worth a read before you make yours.',
    icon: HeartHandshakeIcon,
    link: { label: 'Read the guidelines', href: '/guidelines' },
  },
];

export default function CommunityPage() {
  return (
    <>
      <div data-water='band' data-tone='muted' className='flex flex-1 flex-col px-4 pt-28 pb-18 sm:px-5 lg:px-8'>
        <div className='container mx-auto max-w-7xl'>
          <Stagger id='page-header' variant='sink' className='mb-24'>
            <Eyebrow>Community</Eyebrow>
            <PageTitle>Find the pod</PageTitle>
            <PageNote>Where sharks and their people hang out, here and around the internet.</PageNote>
          </Stagger>

          <ScrollReveal delay={CONTENT_DELAY}>
            <Eyebrow as='h2' className='mb-4'>
              Follow along
            </Eyebrow>
          </ScrollReveal>
          <SocialLinks delay={CONTENT_DELAY} />
        </div>
      </div>

      <Section
        eyebrow='Join in'
        title='More than'
        highlight='sending hearts.'
        note='A few ways to be part of it, beyond your sharks’ profiles.'
        tone='background'
      >
        <Stagger as='ul' itemAs='li' variant='card' gap={STAGGER} delay={0.1} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4' itemClassName='h-full'>
          {WAYS_IN.map((way) => (
            <IconCard key={way.title} {...way} heading='h3' />
          ))}
        </Stagger>
      </Section>

      <ReadyWhenYouAre />
    </>
  );
}
