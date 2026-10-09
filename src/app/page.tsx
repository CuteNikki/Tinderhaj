import { Metadata } from 'next';

import { homeMetadata } from '@/constants/metadata';

import { GuideStep } from '@/components/home/guide-step';
import { Hero } from '@/components/home/hero';
import { ProfileCount } from '@/components/home/profile-count';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';
import { Section } from '@/components/sections/section';

export const metadata: Metadata = homeMetadata;

const GUIDE = [
  { number: '01', title: 'Build your vibe', copy: 'Tell the world what makes your fins flutter.', icon: 'sparkles' as const },
  { number: '02', title: 'Find your people', copy: 'Discover compatible plush from near and far.', icon: 'search' as const },
  { number: '03', title: 'Make it official', copy: 'Send a little heart. Start something lovely.', icon: 'heart' as const },
];

export default function Home() {
  return (
    <>
      <Hero profileCount={<ProfileCount />} />
      <Section
        id='guide'
        eyebrow='A better kind of first date'
        title='Less swiping.'
        highlight='More finding.'
        note='No games, no ghosting, no pressure. Just good profiles and a community that knows what it means to be soft.'
      >
        <div className='grid md:grid-cols-3'>
          {GUIDE.map(({ number, title, copy, icon }) => (
            <GuideStep key={number} number={number} title={title} copy={copy} icon={icon} />
          ))}
        </div>
      </Section>
      <ReadyWhenYouAre id='features' />
    </>
  );
}
