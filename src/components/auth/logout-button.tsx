'use client';

import { logOut } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOutIcon } from 'lucide-react';

export function LogOutButton() {
  return (
    <Button variant='destructive' className='cursor-pointer' onClick={async () => await logOut()}>
      Log Out
    </Button>
  );
}
export function LogOutDropdownMenuItem() {
  return (
    <DropdownMenuItem variant='destructive' onClick={async () => await logOut()}>
      <LogOutIcon />
      Log out
    </DropdownMenuItem>
  );
}
