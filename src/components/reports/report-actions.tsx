'use client';

import { CheckIcon, Loader2Icon, XIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { handleReport } from '@/lib/actions';

import { Button } from '@/components/ui/button';

/** Closes an open report: dealt with, or nothing wrong. */
export function ReportActions({ reportId }: { reportId: string }) {
  const [pending, startTransition] = useTransition();
  const [choice, setChoice] = useState<'RESOLVED' | 'DISMISSED'>();

  function close(outcome: 'RESOLVED' | 'DISMISSED') {
    setChoice(outcome);
    startTransition(async () => {
      const error = await handleReport({ reportId, outcome }).catch(() => ({ message: 'Unable to close the report!' }));
      if (error) return void toast.error(error.message, { duration: 5000, position: 'top-center' });

      toast.success(outcome === 'RESOLVED' ? 'Marked as dealt with.' : 'Dismissed.', { duration: 4000, position: 'top-center' });
    });
  }

  return (
    <div className='flex shrink-0 flex-wrap gap-2'>
      <Button size='sm' onClick={() => close('RESOLVED')} disabled={pending}>
        {pending && choice === 'RESOLVED' ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <CheckIcon aria-hidden='true' />}
        Dealt with
      </Button>
      <Button size='sm' variant='outline' onClick={() => close('DISMISSED')} disabled={pending}>
        {pending && choice === 'DISMISSED' ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <XIcon aria-hidden='true' />}
        Nothing wrong
      </Button>
    </div>
  );
}
