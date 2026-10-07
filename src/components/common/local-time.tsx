'use client';

import { formatDate, relative } from '@/lib/time';

/**
 * A time like '5 minutes ago', with the full date on hover, or with
 * `absolute` the date itself, e.g. 'Sep 23, 2:05 PM'. Formatted in the
 * browser, so it shows the viewer's own time zone.
 */
export function LocalTime({ iso, absolute, className }: { iso: string; absolute?: boolean; className?: string }) {
  return (
    <time dateTime={iso} title={absolute ? undefined : formatDate(iso)} className={className} suppressHydrationWarning>
      {absolute ? formatDate(iso) : relative(iso)}
    </time>
  );
}
