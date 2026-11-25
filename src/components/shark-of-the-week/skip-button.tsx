'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Loader2Icon, SkipForwardIcon } from 'lucide-react';

import { skipSharkOfTheWeekPick } from '@/lib/actions';

import { useConfirm } from '@/components/common/confirm-dialog';
import { Button } from '@/components/ui/button';

const TOAST = { position: 'top-center' } as const;

/** Skips this week's Shark of the Week, after asking, and draws another. */
export function SkipSharkButton({
  pickId,
  name,
}: {
  pickId: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ask, confirmDialog] = useConfirm();

  async function skip() {
    const confirmed = await ask({
      title: `Skip ${name}?`,
      description:
        'Another shark is drawn for this week straight away, and its owner gets an email too. The home page shows the new one within the hour.',
      action: 'Skip',
    });
    if (!confirmed) return;
    startTransition(async () => {
      const error = await skipSharkOfTheWeekPick(pickId).catch(() => ({
        message: 'Unable to skip. Please try again.',
      }));
      if (error) toast.error(error.message, { ...TOAST, duration: 5000 });
      else
        toast.success('Skipped. Another shark was drawn.', {
          ...TOAST,
          duration: 3000,
        });
      router.refresh();
    });
  }

  return (
    <>
      <Button variant='outline' size='sm' onClick={skip} disabled={pending}>
        {pending ? (
          <Loader2Icon className='animate-spin' aria-hidden='true' />
        ) : (
          <SkipForwardIcon aria-hidden='true' />
        )}
        Skip
      </Button>
      {confirmDialog}
    </>
  );
}
