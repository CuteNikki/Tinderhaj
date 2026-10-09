import { ArrowUpRightIcon } from 'lucide-react';

import { SOCIALS } from '@/constants/contact';
import { LIFT, STAGGER } from '@/lib/motion';

import { Stagger } from '@/components/common/stagger';
import { SocialIcon } from '@/components/contact/social-icon';
import { cn } from '@/lib/utils';

/** Where to find Tinderhaj around the internet, as cards coming in after `delay`; nothing at all if none has a link yet. */
export function SocialLinks({ delay, className }: { delay: number; className?: string }) {
  const socials = SOCIALS.filter((social) => social.href);
  if (socials.length === 0) return null;

  return (
    <Stagger
      as='ul'
      itemAs='li'
      variant='card'
      gap={STAGGER}
      delay={delay}
      className={cn('grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-3', className)}
      itemClassName='h-full'
    >
      {socials.map((social) => (
        <a
          key={social.id}
          href={social.href!}
          target='_blank'
          rel='noreferrer'
          title={social.handle ?? undefined}
          className={`group/social border-foreground/10 bg-card dark:bg-accent flex h-full items-start gap-4 rounded-2xl border p-4 shadow-sm ${LIFT}`}
        >
          <span className='bg-foreground/5 ease-bounce flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover/social:scale-110'>
            <SocialIcon id={social.id} className='group-hover/social:animate-wiggle size-5' />
          </span>
          <span className='min-w-0 flex-1'>
            <span className='block font-bold'>{social.name}</span>
            <span className='text-muted-foreground block text-sm'>{social.blurb}</span>
          </span>
          <ArrowUpRightIcon
            className='text-muted-foreground ease-bounce mt-1 size-4 shrink-0 transition-transform duration-300 group-hover/social:translate-x-0.5 group-hover/social:-translate-y-0.5'
            aria-hidden='true'
          />
        </a>
      ))}
    </Stagger>
  );
}
