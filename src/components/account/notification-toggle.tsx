'use client';

import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import {
  NOTIFICATIONS,
  type NotificationKind,
} from '@/constants/notifications';

import { setNotificationEmails } from '@/lib/actions';

import { Switch } from '@/components/ui/switch';

const TOAST = { position: 'top-center' } as const;

/** Whether we send one kind of email. Saves as it's switched. */
export function NotificationToggle({
  kind,
  on,
}: {
  kind: NotificationKind;
  on: boolean;
}) {
  const [, startTransition] = useTransition();
  const [checked, setChecked] = useOptimistic(on);
  const { field, label, about } = NOTIFICATIONS[kind];

  function change(next: boolean) {
    startTransition(async () => {
      setChecked(next);
      const result = await setNotificationEmails(kind, next).catch(() => ({
        message: 'Unable to save that. Please try again.',
      }));
      if (result?.message) {
        toast.error(result.message, { ...TOAST, duration: 5000 });
        return;
      }
      toast.success(
        next ? `We'll email you ${about}.` : `We won't email you ${about}.`,
        { ...TOAST, duration: 3000 }
      );
    });
  }

  return (
    <label
      htmlFor={field}
      className='flex cursor-pointer items-center justify-between gap-4 text-sm'
    >
      {label}
      <Switch id={field} checked={checked} onCheckedChange={change} />
    </label>
  );
}
