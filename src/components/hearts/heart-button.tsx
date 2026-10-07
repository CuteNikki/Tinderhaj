'use client';

import { HeartIcon, HeartOffIcon, Loader2Icon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { sendHeart, takeBackHeart } from '@/lib/actions';
import { popIn, spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

type Named = { id: string; displayName: string };

/** Sends and takes back hearts, with the toasts that say how it went. */
export function useHeartActions() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function send(from: Named, to: Named) {
    startTransition(async () => {
      const result = await sendHeart({ fromProfileId: from.id, toProfileId: to.id }).catch(() => ({ message: 'Unable to send the heart!' }));
      if ('message' in result) return void toast.error(result.message, { duration: 5000, position: 'top-center' });

      if (result.matched)
        toast.success(`It’s a match! ${from.displayName} and ${to.displayName} hearted each other.`, { duration: 6000, position: 'top-center' });
      else toast.success(`${from.displayName} sent ${to.displayName} a heart.`, { duration: 5000, position: 'top-center' });
      router.refresh();
    });
  }

  function takeBack(from: Named, to: Named) {
    startTransition(async () => {
      const error = await takeBackHeart({ fromProfileId: from.id, toProfileId: to.id }).catch(() => ({ message: 'Unable to take the heart back!' }));
      if (error) return void toast.error(error.message, { duration: 5000, position: 'top-center' });

      toast.success(`${from.displayName} took back the heart.`, { duration: 5000, position: 'top-center' });
      router.refresh();
    });
  }

  return { pending, send, takeBack };
}

/** A heart that pops in, for buttons. */
export function PoppingHeart({ filled = true }: { filled?: boolean }) {
  return (
    <motion.span initial='hidden' animate='visible' variants={popIn} transition={spring.pop} className='inline-flex'>
      <HeartIcon className={cn(filled && 'fill-current')} aria-hidden='true' />
    </motion.span>
  );
}

/**
 * Hearts `to` from `from`, one of the viewer's sharks, or takes the heart
 * back. Reads "Heart back" when `to` hearted `from` first. Pass only ids and
 * names: whatever it gets is sent to the browser.
 */
export function HeartButton({
  from,
  to,
  sent,
  received,
  size = 'sm',
  className,
}: {
  from: Named;
  to: Named;
  sent: boolean;
  received: boolean;
  size?: 'sm' | 'default';
  className?: string;
}) {
  const { pending, send, takeBack } = useHeartActions();

  if (sent) {
    return (
      <Button variant='ghost' size={size} className={cn('text-muted-foreground', className)} disabled={pending} onClick={() => takeBack(from, to)}>
        {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <HeartOffIcon aria-hidden='true' />}
        Take back
      </Button>
    );
  }

  return (
    <Button size={size} className={className} disabled={pending} onClick={() => send(from, to)}>
      {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <PoppingHeart />}
      {received ? 'Heart back' : 'Send a heart'}
    </Button>
  );
}
