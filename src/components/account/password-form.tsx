'use client';

import { KeyRoundIcon, Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/constants/auth';
import { setPassword } from '@/lib/actions';
import { authClient } from '@/lib/auth-client';

import { useFormReady } from '@/components/common/use-form-ready';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Changes the password, or adds one for accounts made with a provider. */
export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const [revokeOthers, setRevokeOthers] = useState(false);
  const { ready, onInput, clear } = useFormReady();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Not a form action: React would empty the fields after a mistake, too.
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get('newPassword'));
    if (newPassword !== formData.get('confirmPassword')) return setError('Passwords do not match!');

    setPending(true);
    setError(undefined);
    if (!hasPassword) {
      const failed = await setPassword(newPassword);
      setPending(false);
      if (failed) return setError(failed.message);

      formRef.current?.reset();
      clear();
      toast.success('Password added. You can now sign in with your email too.', { duration: 5000, position: 'top-center' });
      return router.refresh();
    }

    const { error } = await authClient.changePassword({
      currentPassword: String(formData.get('currentPassword')),
      newPassword,
      revokeOtherSessions: revokeOthers,
    });
    setPending(false);

    if (error) return setError(error.code === 'INVALID_PASSWORD' ? 'Your current password is wrong.' : (error.message ?? 'Unable to change your password!'));

    formRef.current?.reset();
    clear();
    setRevokeOthers(false);
    toast.success('Password changed.', { duration: 5000, position: 'top-center' });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} onInput={onInput} className='flex flex-col gap-3'>
      {hasPassword && (
        <div className='flex flex-col gap-2'>
          <Label htmlFor='currentPassword'>Current password</Label>
          <Input id='currentPassword' name='currentPassword' type='password' required autoComplete='current-password' maxLength={MAX_PASSWORD_LENGTH} />
        </div>
      )}
      <div className='grid gap-3 sm:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='newPassword'>New password</Label>
          <Input
            id='newPassword'
            name='newPassword'
            type='password'
            required
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={MAX_PASSWORD_LENGTH}
            autoComplete='new-password'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='confirmPassword'>Confirm new password</Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            required
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={MAX_PASSWORD_LENGTH}
            autoComplete='new-password'
          />
        </div>
      </div>
      {error && <p className='text-destructive text-sm'>{error}</p>}
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        {hasPassword && (
          <label htmlFor='revokeOthers' className='flex cursor-pointer items-center gap-2 text-sm'>
            <Checkbox id='revokeOthers' checked={revokeOthers} onCheckedChange={(checked) => setRevokeOthers(checked === true)} />
            Sign out on other devices
          </label>
        )}
        <Button type='submit' disabled={pending || !ready} className='w-fit sm:ml-auto'>
          {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <KeyRoundIcon aria-hidden='true' />}
          {hasPassword ? 'Change password' : 'Add password'}
        </Button>
      </div>
    </form>
  );
}
