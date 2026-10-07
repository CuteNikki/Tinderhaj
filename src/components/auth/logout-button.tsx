'use client';

import { logOut } from '@/lib/actions';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOutIcon } from 'lucide-react';

export function LogOutButton({ className }: { className?: string }) {
  return (
    <Button variant='destructive' className={cn('cursor-pointer', className)} onClick={async () => await logOut()}>
      <LogOutIcon aria-hidden='true' />
      Log out
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
