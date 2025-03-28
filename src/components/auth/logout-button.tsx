'use client';

import { logOut } from '@/lib/actions';

import { Button } from '@/components/ui/button';

export function LogOutButton() {
  return (
    <Button variant='destructive' onClick={async () => await logOut()}>
      Log Out
    </Button>
  );
}
