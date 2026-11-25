'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BellIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UserRoundIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

/** The settings' pages, each a tab. */
export const SETTINGS_TABS = [
  { label: 'Account', href: '/dashboard/account', icon: UserRoundIcon },
  {
    label: 'Security',
    href: '/dashboard/account/security',
    icon: ShieldCheckIcon,
  },
  {
    label: 'Notifications',
    href: '/dashboard/account/notifications',
    icon: BellIcon,
  },
  { label: 'Invites', href: '/dashboard/account/invites', icon: UserPlusIcon },
] as const;

/**
 * The settings' tabs, as the Hearts page has them. On phones four labels
 * don't fit: the open tab shows its label, the others only their icon.
 */
export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label='Settings'
      className='mb-6 flex max-w-xl gap-1 rounded-full bg-muted p-1 sm:grid sm:grid-cols-4'
    >
      {SETTINGS_TABS.map(({ label, href, icon: Icon }) => {
        const open = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={open ? 'page' : undefined}
            className={cn(
              'flex items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors sm:px-2',
              open
                ? 'min-w-0 flex-1 bg-background px-2 shadow-sm'
                : 'px-3 text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className='size-4 shrink-0' aria-hidden='true' />
            <span className={cn('truncate', !open && 'max-sm:sr-only')}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
