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
          <AlertDialogAction
            className={
              pending?.destructive
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60'
                : undefined
            }
            onClick={() => settle(true)}
          >
            {pending?.action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [confirm, dialog] as const;
}
