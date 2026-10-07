'use client';

import { HeartIcon, Loader2Icon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import type { HeartState } from '@/lib/hearts';
import { popIn, spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { useHeartActions } from '@/components/hearts/heart-button';
import { SharkAvatar } from '@/components/hearts/shark-avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Target = { id: string; displayName: string };

/**
 * A round heart beside the name on a discovery card. Outline: not hearted
 * yet. Filled: hearted. Solid circle: a match. A pulsing dot: they hearted
 * one of your sharks first. With several verified sharks it opens a menu to
 * pick which one hearts.
 */
export function CardHearts({
  target,
  states,
  signedIn,
  own,
}: {
  target: Target;
  /** The viewer's verified sharks; null when signed out. */
  states: HeartState[] | null;
  signedIn: boolean;
  own: boolean;
}) {
  const { pending, send, takeBack } = useHeartActions();

  if (own) return null;

  if (!signedIn || !states?.length) {
    const label = signedIn ? 'Get one of your sharks verified to send hearts' : `Sign in to send ${target.displayName} a heart`;
    return (
      <Hint label={label}>
        <Button variant='outline' size='icon-sm' className='text-muted-foreground rounded-full' asChild>
          <Link href={signedIn ? '/profiles' : '/sign-in'} aria-label={label}>
            <HeartIcon aria-hidden='true' />
          </Link>
        </Button>
      </Hint>
    );
  }

  const matched = states.some((state) => state.sent && state.received);
  const sent = states.some((state) => state.sent);
  const received = states.some((state) => state.received && !state.sent);

  if (states.length === 1) {
    const [{ shark, ...state }] = states;
    const label =
      state.sent && state.received
        ? `It’s a match! Take back ${shark.displayName}’s heart`
        : state.sent
          ? `Take back ${shark.displayName}’s heart`
          : state.received
            ? `${target.displayName} hearted ${shark.displayName}. Heart back`
            : `Send ${target.displayName} a heart from ${shark.displayName}`;
    return (
      <Hint label={label}>
        <HeartCircle
          matched={matched}
          sent={sent}
          received={received}
          pending={pending}
          label={label}
          onClick={() => (state.sent ? takeBack(shark, target) : send(shark, target))}
        />
      </Hint>
    );
  }

  const label = matched ? 'Matched. Choose a shark' : received ? `${target.displayName} hearted one of your sharks` : `Heart ${target.displayName}`;
  return (
    <DropdownMenu>
      <Hint label={label}>
        <DropdownMenuTrigger asChild>
          <HeartCircle matched={matched} sent={sent} received={received} pending={pending} label={label} />
        </DropdownMenuTrigger>
      </Hint>
      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel className='text-muted-foreground text-xs font-normal'>Heart {target.displayName} as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {states.map(({ shark, sent, received }) => (
          <DropdownMenuItem key={shark.id} onSelect={() => (sent ? takeBack(shark, target) : send(shark, target))}>
            <SharkAvatar shark={shark} className='size-6' />
            <span className='min-w-0 flex-1 truncate'>{shark.displayName}</span>
            <span className='text-muted-foreground text-xs'>{sent && received ? 'Match' : sent ? 'Hearted' : received ? 'Heart back' : ''}</span>
            <HeartIcon className={cn('text-primary', sent && 'fill-current')} aria-hidden='true' />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Hint({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function HeartCircle({
  matched,
  sent,
  received,
  pending,
  label,
  ...props
}: React.ComponentProps<typeof Button> & { matched: boolean; sent: boolean; received: boolean; pending: boolean; label: string }) {
  return (
    <Button
      variant={matched ? 'default' : 'outline'}
      size='icon-sm'
      className={cn('relative rounded-full', !matched && 'text-primary')}
      disabled={pending}
      aria-label={label}
      {...props}
    >
      {pending ? (
        <Loader2Icon className='animate-spin' aria-hidden='true' />
      ) : (
        // A new key when it fills in, so the heart pops each time.
        <motion.span key={String(sent)} initial='hidden' animate='visible' variants={popIn} transition={spring.pop} className='inline-flex'>
          <HeartIcon className={cn(sent && 'fill-current')} aria-hidden='true' />
        </motion.span>
      )}
      {received && (
        <span className='absolute -top-0.5 -right-0.5 flex size-2.5' aria-hidden='true'>
          <span className='bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75' />
          <span className='bg-primary relative inline-flex size-2.5 rounded-full' />
        </span>
      )}
    </Button>
  );
}
