'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import { Ocean } from '@/components/common/ocean';

/** The pages set in the water as a whole: signing in and the like, all built on AuthShell. */
const WATER_PATHS = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/two-factor', '/verified', '/banned', '/dashboard/account/delete'];

/**
 * The water behind those pages, kept in the layout rather than the page, so
 * going from one to the next carries on the same water instead of starting it
 * over (pages are built anew on every path, see Replay).
 */
export function PageWater() {
  return (
    <Suspense>
      <Water />
    </Suspense>
  );
}

function Water() {
  const pathname = usePathname();
  if (!WATER_PATHS.includes(pathname)) return null;

  // Flowing into the footer below
  return <Ocean into='fill-muted dark:fill-background' />;
}
