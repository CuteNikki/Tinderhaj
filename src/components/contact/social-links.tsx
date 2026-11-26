import { ArrowUpRightIcon } from 'lucide-react';

import { SOCIALS } from '@/constants/contact';

import { LIFT, STAGGER } from '@/lib/motion';
import { socialLink } from '@/lib/social-link';
import { cn } from '@/lib/utils';

import { glassCard } from '@/components/common/ocean';
import { Stagger } from '@/components/common/stagger';
import { SocialIcon } from '@/components/contact/social-icon';

/** Where to find Tinderhaj around the internet, as cards coming in after `delay`; nothing at all if none has a link yet. `page` picks which (see SOCIALS). `onGlass` for the water: glass, on what comes in (see glassCard). */
export function SocialLinks({
  page,
  delay,
  className,
  onGlass = false,
}: {
  page: 'contact' | 'community';
  delay: number;
  className?: string;
  onGlass?: boolean;
}) {
  const socials = SOCIALS.filter(
    (social) => social.href && (page === 'community' || social.contact)
  );
  if (socials.length === 0) return null;

  return (
    <Stagger
      as='ul'
      itemAs='li'
      variant='card'
      gap={STAGGER}
      delay={delay}
      className={cn(
        'grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-3',
        className
      )}
      itemClassName={cn('h-full', onGlass && cn(glassCard, LIFT))}
    >
      {socials.map((social) => (
        <a
          key={social.id}
          href={socialLink(social.id)}
          target='_blank'
          rel='noreferrer'
          title={social.handle ?? undefined}
          className={cn(
            'group/social flex h-full items-start gap-4 p-4',
            !onGlass &&
              `rounded-2xl border border-foreground/10 bg-card shadow-sm dark:bg-accent ${LIFT}`
          )}
        >
          <span className='flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground/5 transition-transform duration-300 ease-bounce group-hover/social:scale-110'>
            <SocialIcon
              id={social.id}
              className='size-5 group-hover/social:animate-wiggle'
            />
          </span>
          <span className='min-w-0 flex-1'>
            <span className='block font-bold'>{social.name}</span>
            <span className='block text-sm text-pretty text-muted-foreground'>
              {social.blurb}
            </span>
          </span>
          <ArrowUpRightIcon
            className='mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-bounce group-hover/social:translate-x-0.5 group-hover/social:-translate-y-0.5'
            aria-hidden='true'
          />
        </a>
      ))}
    </Stagger>
  );
}
