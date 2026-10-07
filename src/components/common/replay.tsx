'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

/**
 * Builds each page anew whenever the path changes, so its opening animations
 * play every time you arrive, however you got there. Next would otherwise
 * show a page it kept from an earlier visit as it was left, which plays some
 * animations again and skips others. Search and filters change only the
 * query, so they don't replay anything.
 *
 * A path with a param that isn't known at build time (a user's id) can't be
 * read while prerendering, so until it can, the page is shown without the key.
 */
export function Replay({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <Keyed>{children}</Keyed>
    </Suspense>
  );
}

function Keyed({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className='contents'>
      {children}
    </div>
  );
}
