'use client';

import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import { setVerifiedEmails } from '@/lib/actions';

import { Switch } from '@/components/ui/switch';

/** Whether we email them when one of their sharks is verified. Saves as it's ticked. */
export function VerifiedEmailsToggle({ on }: { on: boolean }) {
  const [, startTransition] = useTransition();
  const [checked, setChecked] = useOptimistic(on);

  function change(next: boolean) {
    startTransition(async () => {
      setChecked(next);
      try {
        await setVerifiedEmails(next);
        toast.success(
          next
            ? "We'll email you when a shark is verified."
            : "We won't email you when a shark is verified.",
          { duration: 3000, position: 'top-center' }
        );
      } catch {
        toast.error('Unable to save that. Please try again.', {
          duration: 5000,
          position: 'top-center',
        });
      }
    });
  }

  return (
    <label
      htmlFor='verifiedEmails'
      className='flex cursor-pointer items-center justify-between gap-4 text-sm'
    >
      Email me when one of my sharks is verified
      <Switch id='verifiedEmails' checked={checked} onCheckedChange={change} />
    </label>
  );
}
