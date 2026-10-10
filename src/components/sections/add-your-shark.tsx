import { ArrowRight, BadgeCheckIcon, SearchIcon, UserRoundPlusIcon } from 'lucide-react';
import Link from 'next/link';

import { sunlit } from '@/components/common/ocean';
import { Stagger } from '@/components/common/stagger';
import { Section } from '@/components/sections/section';
import { Button } from '@/components/ui/button';

const STEPS = [
  { label: 'Make a profile', Icon: UserRoundPlusIcon },
  { label: 'A moderator checks it', Icon: BadgeCheckIcon },
  { label: 'It shows up here', Icon: SearchIcon },
];

/**
 * To end discovery on: from browsing others' sharks to putting up your own.
 * Signing up, or for someone already signed in, their profiles (see
 * requireSignedOut), a click from a new one.
 */
export function AddYourShark({ tone }: { tone?: 'muted' | 'card' | 'background' }) {
  return (
    <Section
      eyebrow='Your turn'
      title='Don’t see your shark?'
      highlight='Add them to the pod.'
      note='Every shark here started with a profile. Yours could be the next one someone hearts.'
      tone={tone}
      aside={
        <Button size='xl' className={sunlit} asChild>
          <Link href='/sign-up'>
            Make a profile
            <ArrowRight />
          </Link>
        </Button>
      }
    >
      <Stagger className='text-muted-foreground flex flex-wrap gap-x-8 gap-y-4 text-sm' itemAs='span' variant='pop' gap={0.1} delay={0.2}>
        {STEPS.map(({ label, Icon }) => (
          <span key={label} className='flex items-center gap-2'>
            <Icon className='text-primary h-4 w-4' aria-hidden='true' /> {label}
          </span>
        ))}
      </Stagger>
    </Section>
  );
}
