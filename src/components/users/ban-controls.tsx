'use client';

import { BanIcon, Loader2Icon, ShieldCheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { banUser, unbanUser } from '@/lib/actions';
import { BAN_DURATIONS, BAN_REASON_MAX, type BanDuration } from '@/lib/bans';

import { useConfirm } from '@/components/common/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type BanTarget = { id: string; username: string };

/** Bans someone after asking. They see the reason, if one is given, when they try to sign in. */
export function BanForm({ user }: { user: BanTarget }) {
  const router = useRouter();
  const id = useId();
  const [duration, setDuration] = useState<BanDuration>('7');
  const [pending, startTransition] = useTransition();
  const [ask, confirmDialog] = useConfirm();

  async function handleSubmit(formData: FormData) {
    const reason = String(formData.get('reason')).trim();
    const how = duration === 'permanent' ? 'until the ban is lifted' : `for ${BAN_DURATIONS[duration]}`;
    const confirmed = await ask({
      title: `Ban @${user.username} ${how}?`,
      description: 'They’re signed out everywhere right away, and their profiles leave discovery while the ban lasts.',
      action: 'Ban',
      destructive: true,
    });
    if (!confirmed) return;

    startTransition(async () => {
      const error = await banUser(user.id, { reason, duration }).catch(() => ({ message: 'Unable to ban this account!' }));
      if (error) return void toast.error(error.message, { duration: 5000, position: 'top-center' });

      toast.success(`@${user.username} is banned.`, { duration: 5000, position: 'top-center' });
      router.refresh();
    });
  }

  return (
    // onSubmit rather than action: an action clears the form afterwards,
    // which would lose the reason if they cancel or it fails.
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(new FormData(event.currentTarget));
      }}
      className='flex flex-col gap-3'
    >
      <div className='flex flex-col gap-2'>
        <Label htmlFor={`${id}-reason`}>Reason</Label>
        <Textarea id={`${id}-reason`} name='reason' maxLength={BAN_REASON_MAX} placeholder='They see this when they try to sign in.' />
      </div>
      <div className='flex flex-wrap items-end gap-3'>
        <div className='flex flex-col gap-2'>
          <Label htmlFor={`${id}-duration`}>How long</Label>
          <Select value={duration} onValueChange={(value) => setDuration(value as BanDuration)}>
            <SelectTrigger id={`${id}-duration`} className='w-40'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(BAN_DURATIONS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type='submit' variant='destructive' disabled={pending}>
          {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <BanIcon aria-hidden='true' />}
          Ban @{user.username}
        </Button>
      </div>
      {confirmDialog}
    </form>
  );
}

/** Lifts someone's ban before it ends by itself, after asking. */
export function UnbanButton({ user }: { user: BanTarget }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ask, confirmDialog] = useConfirm();

  return (
    <>
      <Button
        variant='outline'
        className='w-fit'
        disabled={pending}
        onClick={async () => {
          const confirmed = await ask({ title: `Lift @${user.username}’s ban?`, description: 'They can sign in again right away.', action: 'Lift ban' });
          if (!confirmed) return;

          startTransition(async () => {
            const error = await unbanUser(user.id).catch(() => ({ message: 'Unable to lift the ban!' }));
            if (error) return void toast.error(error.message, { duration: 5000, position: 'top-center' });

            toast.success(`@${user.username} can sign in again.`, { duration: 5000, position: 'top-center' });
            router.refresh();
          });
        }}
      >
        {pending ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <ShieldCheckIcon aria-hidden='true' />}
        Lift ban
      </Button>
      {confirmDialog}
    </>
  );
}
