'use client';

import type { PublicProfile } from '@/lib/queries';

import { DiscoveryProfile } from '@/components/discovery/profile';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

/** Opens a shark's card in a popup, from whatever `children` is, e.g. its name in a list. */
export function SharkDialog({ shark, children }: { shark: PublicProfile; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* The card is the dialog: no frame around it, and still, as lifting it would tip it past the dialog's edges and bring up scrollbars. */}
      <DialogContent className='max-w-sm bg-transparent p-0 shadow-none ring-0 sm:max-w-sm' showCloseButton={false}>
        <DialogTitle className='sr-only'>{shark.displayName}</DialogTitle>
        <DiscoveryProfile profile={shark} lift={false} />
      </DialogContent>
    </Dialog>
  );
}
