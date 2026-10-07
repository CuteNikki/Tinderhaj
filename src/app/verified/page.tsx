import { MailCheckIcon, MailXIcon, SendIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { verifiedMetadata } from '@/constants/metadata';

import { AuthShell } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = verifiedMetadata;

const messages = {
  // A new account's address, or a resent link.
  verified: {
    badge: 'All set',
    title: 'Email verified',
    text: 'Thanks! Your email address is confirmed.',
  },
  // Changing email, step 1: confirmed from the old address.
  confirmed: {
    badge: 'Almost there',
    title: 'Check your new inbox',
    text: 'We sent one more link to your new address. Open it to finish changing your email.',
  },
  // Changing email, step 2: confirmed from the new address.
  changed: {
    badge: 'All set',
    title: 'Email changed',
    text: 'Your new email address is confirmed and now in use.',
  },
};

/** Where the links in verification and email change emails land. */
export default async function VerifiedPage({ searchParams }: PageProps<'/verified'>) {
  const { error, step } = await searchParams;

  if (error) {
    return (
      <AuthShell
        badge='Link expired'
        icon={<MailXIcon className='size-4 shrink-0' aria-hidden='true' />}
        title='That link didn’t work'
        description={`${error === 'TOKEN_EXPIRED' ? 'It has expired. Links work for 24 hours.' : 'It is invalid or was already used.'} Sign in and try again from your account settings.`}
      >
        <Button asChild className='w-full'>
          <Link href='/dashboard/account'>Go to account settings</Link>
        </Button>
      </AuthShell>
    );
  }

  const message = step === 'confirmed' || step === 'changed' ? messages[step] : messages.verified;

  return (
    <AuthShell
      badge={message.badge}
      icon={
        step === 'confirmed' ? <SendIcon className='size-4 shrink-0' aria-hidden='true' /> : <MailCheckIcon className='size-4 shrink-0' aria-hidden='true' />
      }
      title={message.title}
      description={message.text}
    >
      <Button asChild className='w-full'>
        <Link href={step ? '/dashboard/account' : '/dashboard/profiles'}>{step ? 'Go to account settings' : 'Go to your profiles'}</Link>
      </Button>
    </AuthShell>
  );
}
