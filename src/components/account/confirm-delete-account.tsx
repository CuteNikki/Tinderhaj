'use client';

import { Loader2Icon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';

/** The last step of deleting an account, after the link from the email. */
export function ConfirmDeleteAccount({ token }: { token: string }) {
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function confirm() {
    setPending(true);
    setError(undefined);
    const { error } = await authClient.deleteUser({ token });

    if (error) {
      setPending(false);
      return setError(
        error.code === 'INVALID_TOKEN'
          ? 'This link has expired or was for another account. Ask for a new one in your account settings.'
          : (error.message ?? 'Unable to delete your account!'),
      );
    }

    // A full reload, so every part of the page forgets the old session.
    window.location.assign('/');
  }

  return (
    <div className='flex flex-col gap-2'>
      {error && <p className='text-destructive text-center text-sm'>{error}</p>}
      <Button variant='destructive' disabled={pending} onClick={confirm}>
        {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <Trash2Icon aria-hidden='true' />}
        Delete my account
      </Button>
      <Button variant='ghost' asChild>
        <Link href='/dashboard/account'>Keep my account</Link>
      </Button>
    </div>
  );
}
