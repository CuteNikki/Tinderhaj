import { BanIcon, HomeIcon, LogInIcon, ShieldCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { bannedMetadata } from '@/constants/metadata';
import { BAN_NOTICE_COOKIE, readBanNotice } from '@/lib/ban-notice';
import { isBanned } from '@/lib/bans';
import prisma from '@/lib/prisma';

import { AuthShell } from '@/components/auth/auth-shell';
import { LocalTime } from '@/components/common/local-time';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = bannedMetadata;

/**
 * Where a banned account lands after trying to sign in. The reason is only
 * shown to whoever just tried, through the cookie that attempt set.
 */
export default async function BannedPage() {
  const userId = readBanNotice((await cookies()).get(BAN_NOTICE_COOKIE)?.value);
  const user = userId ? await prisma.user.findUnique({ where: { id: userId }, select: { banned: true, banReason: true, banExpires: true } }) : null;

  if (user && isBanned(user)) {
    return (
      <AuthShell
        badge='Banned'
        icon={<BanIcon className='size-4 shrink-0' aria-hidden='true' />}
        title='Your account is banned'
        description={user.banExpires ? 'You can sign in again once the ban ends.' : 'You can’t sign in until a moderator lifts the ban.'}
      >
        <div className='flex flex-col gap-4 text-sm'>
          {user.banExpires && (
            <p className='text-center'>
              The ban ends <LocalTime iso={user.banExpires.toISOString()} absolute className='font-semibold' />.
            </p>
          )}
          {user.banReason && <p className='bg-muted rounded-lg px-3 py-2 wrap-break-word whitespace-pre-line'>{user.banReason}</p>}
          <p className='text-muted-foreground text-center text-pretty'>
            Think this is a mistake? Contact us at{' '}
            <a href='mailto:contact@tinderhaj.com' className='text-foreground font-medium underline'>
              contact@tinderhaj.com
            </a>
            .
          </p>
          <Button asChild variant='outline' className='w-full'>
            <Link href='/'>
              <HomeIcon aria-hidden='true' />
              Back home
            </Link>
          </Button>
        </div>
      </AuthShell>
    );
  }

  if (user) {
    return (
      <AuthShell
        badge='All clear'
        icon={<ShieldCheckIcon className='size-4 shrink-0' aria-hidden='true' />}
        title='Your ban has ended'
        description='You can sign in again.'
      >
        <Button asChild className='w-full'>
          <Link href='/sign-in'>
            <LogInIcon aria-hidden='true' />
            Sign in
          </Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge='Nothing here'
      icon={<ShieldCheckIcon className='size-4 shrink-0' aria-hidden='true' />}
      title='Nothing to see here'
      description='This page explains a ban right after a banned account tries to sign in.'
    >
      <Button asChild className='w-full'>
        <Link href='/'>
          <HomeIcon aria-hidden='true' />
          Back home
        </Link>
      </Button>
    </AuthShell>
  );
}
