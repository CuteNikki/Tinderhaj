'use client';

import { CheckIcon, Link2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { sharkPath } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Shark = { id: string; displayName: string; user: { username: string } };

/**
 * Copies the link to a shark's own page: pasted into a chat (Discord, say), it
 * unfurls into the shark's card. `copied` for a moment after, to show it took.
 */
export function useCopySharkLink(shark: Shark) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(new URL(sharkPath(shark), location.origin).href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(`Link to ${shark.displayName} copied.`, { duration: 3000, position: 'top-center' });
    } catch {
      toast.error('Unable to copy the link!', { duration: 5000, position: 'top-center' });
    }
  }

  return { copied, copy };
}

/** A small link beside the heart on a shark's card, copying the link to its own page. */
export function ShareButton({ shark }: { shark: Shark }) {
  const { copied, copy } = useCopySharkLink(shark);
  const label = `Copy a link to ${shark.displayName}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon-sm' className='text-muted-foreground' aria-label={label} onClick={copy}>
          {copied ? <CheckIcon aria-hidden='true' /> : <Link2Icon aria-hidden='true' />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
