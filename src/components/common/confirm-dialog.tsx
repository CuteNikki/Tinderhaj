'use client';

import { useCallback, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';

export type ConfirmOptions = {
  title: string;
  description?: string;
  /** The confirm button's text, e.g. 'Remove'. */
  action: string;
  /** For changes that are hard to undo: a red confirm button. */
  destructive?: boolean;
};

type Pending = ConfirmOptions & { resolve: (confirmed: boolean) => void };

/**
 * Asks before doing something, in a dialog rather than the browser's own
 * prompt. Render `dialog` somewhere in the component.
 *
 *   const [confirm, dialog] = useConfirm();
 *   if (!(await confirm({ title: 'Remove this passkey?', action: 'Remove' }))) return;
 */
export function useConfirm() {
  // Kept after closing, so the text stays while the dialog animates out.
  const [pending, setPending] = useState<Pending | null>(null);
  const [open, setOpen] = useState(false);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setPending({ ...options, resolve });
        setOpen(true);
      }),
    [],
  );

  // Resolving twice does nothing, so closing after confirming stays a yes.
  function settle(confirmed: boolean) {
    pending?.resolve(confirmed);
    setOpen(false);
  }

  const dialog = (
    // Escape, the overlay and Cancel all count as no.
    <AlertDialog open={open} onOpenChange={(open) => !open && settle(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
          {pending?.description && <AlertDialogDescription>{pending.description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className={pending?.destructive ? buttonVariants({ variant: 'destructive' }) : undefined} onClick={() => settle(true)}>
            {pending?.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [confirm, dialog] as const;
}
