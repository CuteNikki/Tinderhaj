import { LinkIcon, LogInIcon, Trash2Icon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { deleteAccountMetadata } from '@/constants/metadata';
import { getSession } from '@/lib/session';

import { ConfirmDeleteAccount } from '@/components/account/confirm-delete-account';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = deleteAccountMetadata;

/** Where the link in the delete account email lands. */
export default async function DeleteAccountPage({ searchParams }: PageProps<'/dashboard/account/delete'>) {
  const { token } = await searchParams;
  const session = await getSession();

  if (typeof token !== 'string') {
    return (
      <AuthShell
        badge='Broken link'
        icon={<LinkIcon className='size-4 shrink-0' aria-hidden='true' />}
        title='That link didn’t work'
        description='It is incomplete. Open the link from the email again.'
      >
        <Button asChild className='w-full'>
          <Link href='/dashboard/account'>Go to account settings</Link>
        </Button>
      </AuthShell>
    );
  }

  if (!session) {
    return (
      <AuthShell
        badge='Sign in first'
        icon={<LogInIcon className='size-4 shrink-0' aria-hidden='true' />}
        title='Sign in to continue'
        description='For safety, the link only works in a browser where you’re signed in. Sign in, then open the link from the email again.'
      >
        <Button asChild className='w-full'>
          <Link href='/sign-in'>Sign in</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      badge='Danger zone'
      icon={<Trash2Icon className='size-4 shrink-0' aria-hidden='true' />}
      title='Delete your account?'
      description={`This deletes @${session.user.name}, all of its profiles, and signs you out everywhere. It can’t be undone.`}
    >
      <ConfirmDeleteAccount token={token} />
    </AuthShell>
  );
}
