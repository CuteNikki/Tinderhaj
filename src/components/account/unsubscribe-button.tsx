'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Loader2Icon } from 'lucide-react';

import { unsubscribeVerifiedEmails } from '@/lib/actions';

import { Button } from '@/components/ui/button';

/** Unsubscribes, then says so, where the button was. */
export function UnsubscribeButton({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function unsubscribe() {
    startTransition(async () => {
      const result = await unsubscribeVerifiedEmails(userId, token);
      if (result?.message) {
        toast.error(result.message, { duration: 5000, position: 'top-center' });
        return;
      }
      setDone(true);
    });
  }

  if (done)
    return (
      <div className='flex flex-col gap-3'>
        <p className='text-sm text-muted-foreground' role='status'>
          Done. You can turn them back on in your account settings.
        </p>
        <Button variant='outline' asChild className='w-full'>
          <Link href='/dashboard/account'>Go to account settings</Link>
        </Button>
      </div>
    );

  return (
    <Button className='w-full' onClick={unsubscribe} disabled={pending}>
      {pending && <Loader2Icon className='animate-spin' aria-hidden='true' />}
      Unsubscribe
    </Button>
  );
}
