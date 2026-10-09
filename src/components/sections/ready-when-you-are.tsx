import { ArrowRight, Heart, Search, ShieldCheck } from 'lucide-react';

import { sunlit } from '@/components/common/ocean';
import { Stagger } from '@/components/common/stagger';
import { DiscoveryLink } from '@/components/discovery/link';
import { Section } from '@/components/sections/section';
import { Button } from '@/components/ui/button';

const PROMISES = [
  { label: 'Verified Profiles', Icon: ShieldCheck },
  { label: '100% Good Intentions', Icon: Heart },
  { label: 'Zero Judgment', Icon: Search },
];

/** A last nudge toward discovery, to end a page on. */
export function ReadyWhenYouAre({ id }: { id?: string }) {
  return (
    <Section
      id={id}
      eyebrow='Ready when you are'
      title='Your next great connection'
      highlight='is probably very soft.'
      tone='card'
      aside={
        <Button size='xl' className={sunlit} asChild>
          <DiscoveryLink>
            Start discovering
            <ArrowRight />
          </DiscoveryLink>
        </Button>
      }
    >
      <Stagger className='text-muted-foreground flex flex-wrap gap-x-8 gap-y-4 text-sm' itemAs='span' variant='pop' gap={0.1} delay={0.2}>
        {PROMISES.map(({ label, Icon }) => (
          <span key={label} className='flex items-center gap-2'>
            <Icon className='text-primary h-4 w-4' aria-hidden='true' /> {label}
          </span>
        ))}
      </Stagger>
    </Section>
  );
}
