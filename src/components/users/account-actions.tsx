'use client';

import { KeyRoundIcon, Loader2Icon, LogOutIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { deleteUserAccount, sendUserPasswordReset, signOutUserEverywhere } from '@/lib/actions';

import { useConfirm, type ConfirmOptions } from '@/components/common/confirm-dialog';
import { Button } from '@/components/ui/button';

type Action = 'sign-out' | 'reset' | 'delete';

/** What admins can do to someone else's account, each after asking. */
export function AccountActions({ user, sessions }: { user: { id: string; username: string }; sessions: number }) {
  const router = useRouter();
  const [running, setRunning] = useState<Action | null>(null);
  const [, startTransition] = useTransition();
  const [ask, confirmDialog] = useConfirm();

  async function run(action: Action, confirm: ConfirmOptions, perform: () => Promise<{ message: string } | void>, success: string, after?: () => void) {
    if (!(await ask(confirm))) return;

    setRunning(action);
    startTransition(async () => {
      const error = await perform().catch(() => ({ message: 'Something went wrong, try again.' }));
      setRunning(null);
      if (error) return void toast.error(error.message, { duration: 5000, position: 'top-center' });

      toast.success(success, { duration: 5000, position: 'top-center' });
      if (after) after();
      else router.refresh();
    });
  }

  const icon = (action: Action, Icon: typeof LogOutIcon) =>
    running === action ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <Icon aria-hidden='true' />;

  return (
    <div className='flex flex-wrap gap-2'>
      <Button
        variant='destructive'
        disabled={running !== null || sessions === 0}
        title={sessions === 0 ? 'They aren’t signed in anywhere.' : undefined}
        onClick={() =>
          run(
            'sign-out',
            {
              title: `Sign @${user.username} out everywhere?`,
              description: `Ends ${sessions === 1 ? 'their 1 session' : `all ${sessions} of their sessions`}. They can sign in again.`,
              action: 'Sign out',
              destructive: true,
            },
            () => signOutUserEverywhere(user.id),
            `@${user.username} is signed out everywhere.`,
          )
        }
      >
        {icon('sign-out', LogOutIcon)}
        Sign out everywhere
      </Button>
      <Button
        variant='outline'
        disabled={running !== null}
        onClick={() =>
          run(
            'reset',
            {
              title: `Send @${user.username} a password reset?`,
              description: 'We email them a link to choose a new password. Their current password keeps working until they do.',
              action: 'Send',
            },
            () => sendUserPasswordReset(user.id),
            'Password reset sent.',
          )
        }
      >
        {icon('reset', KeyRoundIcon)}
        Send password reset
      </Button>
      <Button
        variant='destructive'
        disabled={running !== null}
        onClick={() =>
          run(
            'delete',
            {
              title: `Delete @${user.username}?`,
              description: 'This deletes their account and all of their profiles right away. It can’t be undone.',
              action: 'Delete',
              destructive: true,
            },
            () => deleteUserAccount(user.id),
            `@${user.username} is deleted.`,
            () => router.push('/moderation/users'),
          )
        }
      >
        {icon('delete', Trash2Icon)}
        Delete account
      </Button>
      {confirmDialog}
    </div>
  );
}
