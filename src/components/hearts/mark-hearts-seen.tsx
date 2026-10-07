'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { markHeartsSeen } from '@/lib/actions';

/** Marks the user's hearts as seen once the page shows them, then clears the nav's dot. */
export function MarkHeartsSeen({ unseen }: { unseen: number }) {
  const router = useRouter();

  useEffect(() => {
    if (!unseen) return;
    void markHeartsSeen().then(() => router.refresh());
  }, [unseen, router]);

  return null;
}
