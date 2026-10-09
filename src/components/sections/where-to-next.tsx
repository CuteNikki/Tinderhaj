import { ArrowRight, type LucideIcon, MailIcon, SearchIcon, SignpostIcon, UserRoundPlusIcon } from 'lucide-react';
import Link from 'next/link';

import { LIFT } from '@/lib/motion';

import { Stagger } from '@/components/common/stagger';
import { DiscoveryLink } from '@/components/discovery/link';
import { Section } from '@/components/sections/section';

const PLACES: { title: string; copy: string; href: string; icon: LucideIcon }[] = [
  { title: 'Browse the sharks', copy: 'Every verified profile, the newest first.', href: '/discovery', icon: SearchIcon },
  { title: 'See how it works', copy: 'From signing up to a first match.', href: '/guide', icon: SignpostIcon },
  { title: 'Make your profile', copy: 'Tell the world what makes your fins flutter.', href: '/sign-up', icon: UserRoundPlusIcon },
  { title: 'Ask us anything', copy: 'Lost, stuck, or just saying hi.', href: '/contact', icon: MailIcon },
];

/** The main places to go from here, as cards. For a page that's a dead end otherwise, like the 404. */
export function WhereToNext({ tone }: { tone?: 'muted' | 'card' | 'background' }) {
  return (
    <Section
      eyebrow='Where to next'
      title='Plenty of other'
      highlight='fish in the sea.'
      note='Whatever you were after, one of these is probably close.'
      tone={tone}
    >
      <Stagger className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4' itemClassName='h-full' variant='card' gap={0.08} delay={0.1}>
        {PLACES.map((place) => (
          <Place key={place.href} {...place} />
        ))}
      </Stagger>
    </Section>
  );
}

function Place({ title, copy, href, icon: Icon }: (typeof PLACES)[number]) {
  const content = (
    <>
      <span className='bg-primary/10 text-primary ease-bounce mb-4 flex size-10 items-center justify-center rounded-full transition-transform duration-300 group-hover/place:scale-110'>
        <Icon className='group-hover/place:animate-wiggle size-5' aria-hidden='true' />
      </span>
      <span className='flex items-center gap-1.5 font-bold'>
        {title}
        <ArrowRight className='ease-bounce size-4 transition-transform duration-300 group-hover/place:translate-x-0.5' aria-hidden='true' />
      </span>
      <span className='text-muted-foreground mt-1 text-sm leading-relaxed'>{copy}</span>
    </>
  );
  const className = `group/place border-foreground/10 bg-background flex h-full flex-col rounded-2xl border p-5 shadow-sm ${LIFT}`;

  return href === '/discovery' ? (
    <DiscoveryLink className={className}>{content}</DiscoveryLink>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
