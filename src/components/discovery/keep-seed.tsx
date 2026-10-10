'use client';

import { useEffect } from 'react';

/**
 * Discovery arrived at without a shuffle (from a bookmark, say) shows the one
 * it picked, and this keeps it in the URL, so reloading or sharing the page
 * keeps the order. In place, rather than by redirecting: by the time a
 * redirect is reached the page is already on its way, so the browser could
 * only follow it after showing it, then load it all again.
 */
export function KeepSeed({ seed }: { seed: number }) {
  useEffect(() => {
    const url = new URL(location.href);
    if (url.searchParams.has('s')) return;
    url.searchParams.set('s', String(seed));
    window.history.replaceState(null, '', url);
  }, [seed]);

  return null;
}
