'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { FingerprintIcon, Loader2Icon, Trash2Icon } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { useConfirm } from '@/components/common/confirm-dialog';
import { LocalTime } from '@/components/common/local-time';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Passkey = {
  id: string;
  name: string | null;
  createdAt: string | null;
  /** Synced across devices, e.g. by iCloud Keychain or a password manager. */
  backedUp: boolean;
};

/**
 * Passkeys sign in without a password, with a fingerprint, face or the
 * device's PIN. They skip two-step sign-in: they're already two steps.
 */
export function PasskeySettings({ passkeys }: { passkeys: Passkey[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [ask, confirmDialog] = useConfirm();

  async function add(formData: FormData) {
    setAdding(true);
    const name = String(formData.get('name')).trim();
    const result = await authClient.passkey.addPasskey({
      name: name || undefined,
    });
    setAdding(false);
    if (result?.error) {
      // Closing the browser's own prompt isn't worth an error.
      if ('code' in result.error && result.error.code === 'ERROR_CEREMONY_ABORTED') {
        return;
      }
      return void toast.error(result.error.message ?? 'Unable to add a passkey!', { duration: 5000, position: 'top-center' });
    }
    toast.success('Passkey added.', { duration: 5000, position: 'top-center' });
    router.refresh();
  }

  async function remove(passkey: Passkey) {
    const confirmed = await ask({
      title: `Remove ${passkey.name ?? 'this passkey'}?`,
      description: 'You can’t sign in with it anymore. It may still show on your device until you delete it there too.',
      action: 'Remove',
      destructive: true,
    });
    if (!confirmed) return;
    setRemoving(passkey.id);
    const { error } = await authClient.passkey.deletePasskey({
      id: passkey.id,
    });
    setRemoving(null);
    if (error) return void toast.error(error.message ?? 'Unable to remove the passkey!', { duration: 5000, position: 'top-center' });
    toast.success('Passkey removed.', { duration: 5000, position: 'top-center' });
    router.refresh();
  }

  return (
    <div className='flex flex-col gap-3'>
      {passkeys.length > 0 && (
        <ul className='divide-foreground/10 border-foreground/10 flex flex-col divide-y rounded-lg border'>
          {passkeys.map((passkey) => (
            <li key={passkey.id} className='flex items-center gap-3 p-3 px-4'>
              <FingerprintIcon className='text-muted-foreground size-5 shrink-0' aria-hidden />
              <div className='min-w-0 flex-1'>
                <p className='truncate font-medium'>{passkey.name ?? 'Passkey'}</p>
                <p className='text-muted-foreground text-xs'>
                  {passkey.createdAt && (
                    <>
                      Added <LocalTime iso={passkey.createdAt} />
                    </>
                  )}
                  {passkey.backedUp && ' · Synced across your devices'}
                </p>
              </div>
              <Button
                variant='destructive'
                size='icon'
                disabled={removing === passkey.id}
                onClick={() => remove(passkey)}
                aria-label={`Remove ${passkey.name ?? 'passkey'}`}
              >
                {removing === passkey.id ? <Loader2Icon className='animate-spin' /> : <Trash2Icon />}
              </Button>
            </li>
          ))}
        </ul>
      )}
      <form action={add} className='flex flex-col gap-2 sm:flex-row sm:items-end'>
        <div className='flex flex-1 flex-col gap-2'>
          <Label htmlFor='passkey-name'>Name</Label>
          <Input id='passkey-name' name='name' maxLength={50} placeholder='e.g. My phone' />
        </div>
        <Button type='submit' disabled={adding} className='w-fit'>
          {adding ? <Loader2Icon className='animate-spin' /> : <FingerprintIcon />}
          Add a passkey
        </Button>
      </form>
      {confirmDialog}
    </div>
  );
}
