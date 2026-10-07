'use client';

import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';

import { setUserRole } from '@/lib/actions';
import { ROLE_LABELS, ROLES, type AccountRole } from '@/lib/roles';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/** An admin's control for someone else's role. The change saves right away. */
export function RoleSelect({ userId, username, role }: { userId: string; username: string; role: AccountRole }) {
  const [optimisticRole, setOptimisticRole] = useOptimistic(role);
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={optimisticRole}
      disabled={pending}
      onValueChange={(value) =>
        startTransition(async () => {
          setOptimisticRole(value as AccountRole);
          const error = await setUserRole(userId, value).catch(() => ({ message: 'Unable to change the role!' }));
          if (error) toast.error(error.message, { duration: 5000, position: 'top-center' });
          else
            toast.success(`@${username} is now ${value === 'ADMIN' ? 'an' : 'a'} ${ROLE_LABELS[value as AccountRole].toLowerCase()}.`, {
              duration: 5000,
              position: 'top-center',
            });
        })
      }
    >
      <SelectTrigger className='w-36' aria-label={`Role of @${username}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_LABELS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
