'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { ActivityIcon, HourglassIcon, LogInIcon, MonitorIcon, NetworkIcon, SmartphoneIcon, type LucideIcon } from 'lucide-react';

import { revokeOtherSessions, revokeSession } from '@/lib/actions';
import { formatDate, relative } from '@/lib/time';
import { cn } from '@/lib/utils';

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

export function SessionList({ sessions }: { sessions: SessionInfo[] }) {
  const [pending, startTransition] = useTransition();
  const others = sessions.filter((session) => !session.current);

  function run(action: () => Promise<{ message: string } | void>, success: string) {
    startTransition(async () => {
      const error = await action();
      if (error) toast.error(error.message, { duration: 5000, position: 'top-center' });
      else toast.success(success, { duration: 5000, position: 'top-center' });
    });
  }

  return (
    <div className='flex flex-col gap-2'>
      <ul className='divide-foreground/10 border-foreground/10 flex flex-col divide-y rounded-lg border'>
        {sessions.map((session) => {
          const Icon = /iPhone|iPad|Android/.test(session.device) ? SmartphoneIcon : MonitorIcon;
          return (
            <li key={session.id} className='flex items-start gap-3 p-3 px-4 sm:gap-4'>
              <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <p className='flex flex-wrap items-center gap-2 font-medium'>
                  <Icon className='text-muted-foreground size-5 shrink-0' />
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
                {/* Times are shown in the viewer's own time zone and relative
                    to now, so the server's render can differ slightly. */}
                <Details className='text-xs' suppressHydrationWarning>
                  <Detail icon={LogInIcon}>Signed in {formatDate(session.createdAt)}</Detail>
                  <Detail icon={ActivityIcon}>Active {relative(session.lastActive)}</Detail>
                  <Detail icon={HourglassIcon}>Expires {relative(session.expiresAt)}</Detail>
                </Details>
              </div>
              {!session.current && (
                <Button variant='destructive' size='sm' disabled={pending} onClick={() => run(() => revokeSession(session.id), 'Signed out.')}>
                  Sign out
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {others.length > 0 && (
        <Button variant='destructive' className='w-fit' disabled={pending} onClick={() => run(revokeOtherSessions, 'Signed out on all other devices.')}>
          Sign out all other devices
        </Button>
      )}
    </div>
  );
}

function Details({ className, children, suppressHydrationWarning }: { className?: string; children: React.ReactNode; suppressHydrationWarning?: boolean }) {
  return (
    <ul className={cn('text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5', className)} suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </ul>
  );
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
    <li className='flex min-w-0 items-center gap-1' suppressHydrationWarning>
      <Icon className='size-3.5 shrink-0 opacity-70' aria-hidden />
      {label && <span className='sr-only'>{label}: </span>}
      <span className='min-w-0 wrap-break-word'>{children}</span>
    </li>
  );
}
