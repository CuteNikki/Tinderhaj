'use client';

import { useSyncExternalStore } from 'react';

import { formatDate, relative } from '@/lib/time';

const subscribe = () => () => {};

/**
 * A time like '5 minutes ago', with the full date on hover, or with
 * `absolute` the date itself, e.g. 'Sep 23, 2:05 PM'. Formatted in the
 * browser, so it shows the viewer's own time zone: the server doesn't know
 * it, so its render leaves the time out, and the browser fills it in once
 * the page is running.
 */
export function LocalTime({ iso, absolute, className }: { iso: string; absolute?: boolean; className?: string }) {
  // False on the server and while hydrating, which has to match it; true right after
  const inBrowser = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <time dateTime={iso} title={absolute || !inBrowser ? undefined : formatDate(iso)} className={className}>
      {inBrowser && (absolute ? formatDate(iso) : relative(iso))}
    </time>
  );
}
