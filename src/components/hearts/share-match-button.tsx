'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { CheckIcon, Loader2Icon, Share2Icon } from 'lucide-react';

import { shareMatch } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Shark = { id: string; displayName: string };

const TOAST = { position: 'top-center' } as const;

/**
 * Shares a match: its own page, whose link unfurls into both sharks' photos
 * with a heart between them. Through the phone's share sheet where there is
 * one, else the link is copied.
 */
export function ShareMatchButton({
  mine,
  theirs,
}: {
  mine: Shark;
  theirs: Shark;
}) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const label = `Share ${mine.displayName} and ${theirs.displayName}'s match`;

  function share() {
    startTransition(async () => {
      const result = await shareMatch({ mineId: mine.id, theirsId: theirs.id });
      if ('message' in result) {
        toast.error(result.message, { ...TOAST, duration: 5000 });
        return;
      }
      const url = new URL(result.path, location.origin).href;

      // A touch screen's share sheet; on a computer, copying is what people expect
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        try {
          await navigator.share({
            title: `${mine.displayName} & ${theirs.displayName}`,
            text: `${mine.displayName} and ${theirs.displayName} matched on Tinderhaj!`,
            url,
          });
        } catch {
          // Closed without sharing
        }
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Link to the match copied.', {
          ...TOAST,
          duration: 3000,
        });
      } catch {
        toast.error('Unable to copy the link!', { ...TOAST, duration: 5000 });
      }
    });
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='outline'
          size='icon-sm'
          className='shrink-0 text-muted-foreground'
          aria-label={label}
          disabled={pending}
          onClick={share}
        >
          {pending ? (
            <Loader2Icon className='animate-spin' aria-hidden='true' />
          ) : copied ? (
            <CheckIcon aria-hidden='true' />
          ) : (
            <Share2Icon aria-hidden='true' />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Share this match</TooltipContent>
    </Tooltip>
  );
}
