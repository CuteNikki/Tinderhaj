'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { CheckIcon, CopyIcon } from 'lucide-react';

import { INVITE_BADGES } from '@/constants/invites';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Someone's invite link, to copy, and the badges bringing friends earns, as
 * the Discord roles list shows roles: a filled circle for each one earned.
 */
export function InviteSettings({
  link,
  count,
}: {
  link: string;
  count: number;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Invite link copied.', {
        duration: 3000,
        position: 'top-center',
      });
    } catch {
      toast.error('Unable to copy the link!', {
        duration: 5000,
        position: 'top-center',
      });
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
        <Input
          readOnly
          value={link}
          aria-label='Your invite link'
          className='flex-1'
          onFocus={(event) => event.currentTarget.select()}
        />
        <Button variant='outline' onClick={copy}>
          {copied ? (
            <CheckIcon aria-hidden='true' />
          ) : (
            <CopyIcon aria-hidden='true' />
          )}
          Copy link
        </Button>
      </div>

      <div className='flex flex-col gap-2 border-t border-foreground/10 pt-4'>
        <p className='text-sm'>
          <span className='font-semibold tabular-nums'>{count}</span>{' '}
          {count === 1 ? 'friend' : 'friends'} joined with a verified shark
        </p>
        <ul className='flex flex-col gap-2'>
          {INVITE_BADGES.map((badge) => {
            const earned = count >= badge.count;
            return (
              <li key={badge.key} className='flex items-start gap-3 text-sm'>
                <span
                  className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                    earned
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-foreground/20'
                  )}
                >
                  {earned && (
                    <CheckIcon className='size-3' aria-hidden='true' />
                  )}
                </span>
                <span>
                  <span className='font-semibold'>{badge.label}</span>
                  <span className='text-muted-foreground'>
                    {' '}
                    · {badge.about}
                  </span>
                  <span className='sr-only'>
                    {earned ? ' (earned)' : ' (not yet)'}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
