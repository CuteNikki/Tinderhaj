'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { ActivityIcon, ChevronDownIcon, HourglassIcon, LogInIcon, MonitorIcon, NetworkIcon, SmartphoneIcon, type LucideIcon } from 'lucide-react';

import { revokeOtherSessions, revokeSession } from '@/lib/actions';
import { cn } from '@/lib/utils';

import { type ConfirmOptions, useConfirm } from '@/components/common/confirm-dialog';
import { LocalTime } from '@/components/common/local-time';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type SessionInfo = {
  id: string;
  device: string;
  ipAddress: string | null;
  createdAt: string;
  lastActive: string;
  expiresAt: string;
  current: boolean;
};

/** How many show until the rest are asked for: most people are signed in on a few devices at most. */
const SHOWN_SESSIONS = 5;

export function SessionList({ sessions }: { sessions: SessionInfo[] }) {
  const [pending, startTransition] = useTransition();
  const [ask, confirmDialog] = useConfirm();
  const [showAll, setShowAll] = useState(false);
  const others = sessions.filter((session) => !session.current);
  // This device first, then the rest as they were last active
  const ordered = [...sessions.filter((session) => session.current), ...others];
  const shown = showAll ? ordered : ordered.slice(0, SHOWN_SESSIONS);
  const hidden = ordered.length - shown.length;

  async function run(question: ConfirmOptions, action: () => Promise<{ message: string } | void>, success: string) {
    if (!(await ask(question))) return;
    startTransition(async () => {
      const error = await action();
      if (error) toast.error(error.message, { duration: 5000, position: 'top-center' });
      else toast.success(success, { duration: 5000, position: 'top-center' });
    });
  }

  return (
    <div className='flex flex-col gap-2'>
      <ul className='divide-foreground/10 border-foreground/10 flex flex-col divide-y rounded-xl border'>
        {shown.map((session) => {
          const Icon = /iPhone|iPad|Android/.test(session.device) ? SmartphoneIcon : MonitorIcon;
          return (
            <li key={session.id} className='flex items-start gap-3 p-3 px-4 sm:gap-4'>
              <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <p className='flex flex-wrap items-center gap-2 font-medium'>
                  <Icon className='text-primary size-5 shrink-0' aria-hidden='true' />
                  {session.device}
                  {session.current && <Badge>This device</Badge>}
                </p>
                {/* Each detail wraps as a whole, so narrow screens get a clean
                    list instead of sentences broken mid-phrase. */}
                {session.ipAddress && (
                  <Details className='text-sm'>
                    <Detail icon={NetworkIcon} label='IP address'>
                      {session.ipAddress}
                    </Detail>
                  </Details>
                )}
                {/* In the viewer's own time zone, and relative to now */}
                <Details className='text-xs'>
                  <Detail icon={LogInIcon}>
                    Signed in <LocalTime iso={session.createdAt} absolute />
                  </Detail>
                  <Detail icon={ActivityIcon}>
                    Active <LocalTime iso={session.lastActive} />
                  </Detail>
                  <Detail icon={HourglassIcon}>
                    Expires <LocalTime iso={session.expiresAt} />
                  </Detail>
                </Details>
              </div>
              {!session.current && (
                <Button
                  variant='destructive'
                  size='sm'
                  disabled={pending}
                  onClick={() =>
                    run(
                      { title: `Sign out ${session.device}?`, description: 'It has to sign in again to get back in.', action: 'Sign out', destructive: true },
                      () => revokeSession(session.id),
                      'Signed out.',
                    )
                  }
                >
                  Sign out
                </Button>
              )}
            </li>
          );
        })}
        {/* The list's own last row, quieter than the sessions in it */}
        {ordered.length > SHOWN_SESSIONS && (
          <li>
            <button
              type='button'
              aria-expanded={showAll}
              onClick={() => setShowAll(!showAll)}
              className='text-muted-foreground hover:bg-muted/50 hover:text-foreground focus-visible:ring-ring/50 flex w-full items-center justify-center gap-1.5 rounded-b-xl px-4 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3'
            >
              {showAll ? 'Show fewer' : `Show ${hidden} more`}
              <ChevronDownIcon className={cn('size-4 transition-transform duration-150', showAll && 'rotate-180')} aria-hidden='true' />
            </button>
          </li>
        )}
      </ul>
      {others.length > 0 && (
        <Button
          variant='destructive'
          className='w-fit'
          disabled={pending}
          onClick={() =>
            run(
              {
                title: `Sign out ${others.length === 1 ? 'your other device' : `all ${others.length} other devices`}?`,
                description: 'They have to sign in again to get back in. This device stays signed in.',
                action: 'Sign out',
                destructive: true,
              },
              revokeOtherSessions,
              'Signed out on all other devices.',
            )
          }
        >
          Sign out all other devices
        </Button>
      )}
      {confirmDialog}
    </div>
  );
}

function Details({ className, children }: { className?: string; children: React.ReactNode }) {
  return <ul className={cn('text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5', className)}>{children}</ul>;
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  /** Read out by screen readers when the icon alone says what this is. */
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <li className='flex min-w-0 items-center gap-1'>
      <Icon className='text-muted-foreground size-3.5 shrink-0' aria-hidden />
      {label && <span className='sr-only'>{label}: </span>}
      <span className='min-w-0 wrap-break-word'>{children}</span>
    </li>
  );
}
