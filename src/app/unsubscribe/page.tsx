import type { Metadata } from 'next';
import Link from 'next/link';

import { MailMinusIcon, MailXIcon } from 'lucide-react';

import { unsubscribeMetadata } from '@/constants/metadata';
import { NOTIFICATIONS } from '@/constants/notifications';

import { readUnsubscribe } from '@/lib/unsubscribe';

import { UnsubscribeButton } from '@/components/account/unsubscribe-button';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = unsubscribeMetadata;

/**
 * Where the Unsubscribe link in a verified shark's email lands. Asks first,
 * rather than unsubscribing as the page opens, since mail scanners open
 * links too.
 */
export default async function UnsubscribePage({
  searchParams,
}: PageProps<'/unsubscribe'>) {
  const { u, k, t } = await searchParams;
  const link = readUnsubscribe(u, k, t);

  if (!link)
    return (
      <AuthShell
        badge='Link invalid'
        icon={<MailXIcon className='size-4 shrink-0' aria-hidden='true' />}
        title="That link didn't work"
        description='It may have been cut off when it was copied. You can also turn these emails off in your account settings.'
      >
        <Button asChild className='w-full'>
          <Link href='/dashboard/account'>Go to account settings</Link>
        </Button>
      </AuthShell>
    );

  return (
    <AuthShell
      badge='Emails'
      icon={<MailMinusIcon className='size-4 shrink-0' aria-hidden='true' />}
      title='Unsubscribe'
      description={`Stop the emails we send ${NOTIFICATIONS[link.kind].about}? You'll still get the ones you need, like sign-in codes.`}
    >
      <UnsubscribeButton
        userId={link.userId}
        kind={link.kind}
        token={String(t)}
      />
    </AuthShell>
  );
}
