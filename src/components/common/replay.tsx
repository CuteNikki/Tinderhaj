'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/** Longer than React's own unmount and remount in development, far shorter than leaving a page and coming back. */
const AWAY = 100;

/**
 * Builds a page anew whenever it's shown again, so its opening animations
 * play every time you arrive, however you got there. Next keeps pages from
 * earlier visits and would otherwise show one as it was left, which plays
 * some animations again (those done in CSS) and skips others.
 *
 * A kept page is hidden, not removed, and shown again by running its effects
 * once more, before the browser paints: that's when it's rebuilt, so the
 * page as it was left never shows. Nothing here reads the path, so pages
 * never wait for it while prerendering.
 */
export function Replay({ children }: { children: React.ReactNode }) {
  const [visit, setVisit] = useState(0);
  const hiddenAt = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (hiddenAt.current !== null && performance.now() - hiddenAt.current > AWAY) setVisit((count) => count + 1);
    return () => {
      hiddenAt.current = performance.now();
    };
  }, []);

  return (
    <div key={visit} className='contents'>
      {children}
    </div>
  );
}
