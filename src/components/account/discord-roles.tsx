'use client';

import { CheckIcon, ExternalLinkIcon, Loader2Icon, RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { DISCORD_URL } from '@/constants/contact';
import { refreshDiscordRoles } from '@/lib/actions';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

type Role = { key: string; label: string; about: string; earned: boolean };

/**
 * The roles on the Tinderhaj Discord server for what you've done here, which
 * come and go by themselves (see discord-roles). Refresh is for when they look
 * out of date: after joining the server, say, or when the roles change.
 */
export function DiscordRoles({ roles, linked }: { roles: Role[]; linked: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function refresh() {
    startTransition(async () => {
      const result = await refreshDiscordRoles().catch(() => ({ status: 'failed' as const }));
      const toastOptions = { duration: 5000, position: 'top-center' as const };
      if (result.status === 'synced')
        toast.success(result.roles.length ? `Your roles: ${result.roles.join(', ')}.` : 'Up to date. No roles yet.', toastOptions);
      else if (result.status === 'not-member') toast.error('You’re not on the server yet. Join it, then refresh.', toastOptions);
      else if (result.status === 'unlinked') toast.error('Connect Discord first, under Sign-in methods.', toastOptions);
      else toast.error('Unable to reach Discord. Please try again in a moment.', toastOptions);
      // What's earned may have changed since the page loaded.
      router.refresh();
    });
  }

  return (
    <div className='flex flex-col gap-4'>
      <ul className='flex flex-col gap-2'>
        {roles.map((role) => (
          <li key={role.key} className='flex items-start gap-3 text-sm'>
            <span
              className={cn(
                'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                role.earned ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20',
              )}
            >
              {role.earned && <CheckIcon className='size-3' aria-hidden='true' />}
            </span>
            <span>
              <span className='font-semibold'>{role.label}</span>
              <span className='text-muted-foreground'> · {role.about}</span>
              <span className='sr-only'>{role.earned ? ' (earned)' : ' (not yet)'}</span>
            </span>
          </li>
        ))}
      </ul>

      {linked ? (
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' onClick={refresh} disabled={pending}>
            {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <RefreshCwIcon aria-hidden='true' />}
            Refresh roles
          </Button>
          <Button variant='ghost' asChild>
            <a href={DISCORD_URL} target='_blank' rel='noreferrer'>
              Join the server
              <ExternalLinkIcon aria-hidden='true' />
            </a>
          </Button>
        </div>
      ) : (
        <p className='text-muted-foreground text-sm'>Connect Discord under Sign-in methods to get them.</p>
      )}
    </div>
  );
}
