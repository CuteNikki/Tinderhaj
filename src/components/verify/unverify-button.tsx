'use client';

import { Loader2Icon, ShieldOffIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { unverifyProfile } from '@/lib/actions';

import { useConfirm } from '@/components/common/confirm-dialog';
import { LocalTime } from '@/components/common/local-time';
import { Button } from '@/components/ui/button';

/** Sends a verified profile back to review, after asking. Shows when it was verified, if given. */
export function UnverifyButton({ profile, verifiedAt }: { profile: { id: string; displayName: string }; verifiedAt?: string | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ask, confirmDialog] = useConfirm();

  async function unverify() {
    const confirmed = await ask({
      title: `Unverify ${profile.displayName}?`,
      description: 'It leaves discovery right away and goes back to waiting for review. Its hearts come back if it’s verified again.',
      action: 'Unverify',
      destructive: true,
    });
    if (!confirmed) return;

    startTransition(async () => {
      const error = await unverifyProfile({ profileId: profile.id }).catch(() => ({ message: 'Unable to unverify this profile!' }));
      if (error) return void toast.error(error.message, { duration: 5000, position: 'top-center' });

      toast.success(`${profile.displayName} is back in review.`, { duration: 5000, position: 'top-center' });
      router.refresh();
    });
  }

  return (
    <div className='flex items-center gap-2'>
      {verifiedAt && (
        <span className='text-muted-foreground text-xs'>
          Verified <LocalTime iso={verifiedAt} />
        </span>
      )}
      <Button variant='outline' size='sm' disabled={pending} onClick={unverify}>
        {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <ShieldOffIcon aria-hidden='true' />}
        Unverify
      </Button>
      {confirmDialog}
    </div>
  );
}
