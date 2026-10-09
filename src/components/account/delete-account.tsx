'use client';

import { Loader2Icon, MailCheckIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import { authClient } from '@/lib/auth-client';

import { useFormReady } from '@/components/common/use-form-ready';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Asks for the password, then emails the link that actually deletes the account. */
export function DeleteAccount({ hasPassword }: { hasPassword: boolean }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const { ready, onInput } = useFormReady();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Not a form action: React would empty the password after a mistake, too.
    event.preventDefault();
    const password = hasPassword ? String(new FormData(event.currentTarget).get('password')) : undefined;
    setPending(true);
    setError(undefined);
    const { error } = await authClient.deleteUser({ password });
    setPending(false);

    if (error) {
      return setError(
        error.code === 'INVALID_PASSWORD'
          ? 'Your password is wrong.'
          : error.code === 'SESSION_EXPIRED'
            ? 'For safety, sign out and back in, then try again.'
            : (error.message ?? 'Unable to delete your account!'),
      );
    }

    setOpen(false);
    setSent(true);
  }

  if (sent) {
    return (
      <p className='flex items-start gap-2 text-sm'>
        <MailCheckIcon className='text-primary mt-0.5 size-4 shrink-0' aria-hidden='true' />
        Check your inbox: we sent you a link to confirm. It works for one hour, in this browser.
      </p>
    );
  }

  if (!open) {
    return (
      <Button variant='destructive' onClick={() => setOpen(true)}>
        <Trash2Icon aria-hidden='true' />
        Delete account
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} onInput={onInput} className='flex flex-col gap-3'>
      {hasPassword ? (
        <div className='flex flex-col gap-2'>
          <Label htmlFor='delete-password'>Enter your password to confirm</Label>
          <Input id='delete-password' name='password' type='password' required autoComplete='current-password' />
        </div>
      ) : (
        <p className='text-sm'>Are you sure? We&rsquo;ll email you a link to confirm.</p>
      )}
      {error && <p className='text-destructive text-sm'>{error}</p>}
      <div className='flex gap-2'>
        <Button type='submit' variant='destructive' disabled={pending || (hasPassword && !ready)}>
          {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <Trash2Icon aria-hidden='true' />}
          Email me a link
        </Button>
        <Button
          type='button'
          variant='secondary'
          onClick={() => {
            setOpen(false);
            setError(undefined);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
