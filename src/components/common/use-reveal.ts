'use client';

import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

/**
 * When an element should come in. `delay` sets its place in the page's
 * opening sequence and only counts while the page is opening: something
 * scrolled to later comes in right away, after at most `scrollDelay`, so
 * it doesn't keep people waiting.
 */
export function useReveal<T extends Element>({ delay = 0, scrollDelay = 0 }: { delay?: number; scrollDelay?: number }) {
  const ref = useRef<T>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const openedAt = useRef<number | null>(null);
  // Null until it comes into view; then the delay it comes in after.
  const [revealDelay, setRevealDelay] = useState<number | null>(null);

  useEffect(() => {
    openedAt.current ??= performance.now();
  }, []);

  useEffect(() => {
    if (!isInView || revealDelay !== null) return;
    const opened = (performance.now() - (openedAt.current ?? performance.now())) / 1000;
    setRevealDelay(Math.max(delay - opened, scrollDelay));
  }, [isInView, revealDelay, delay, scrollDelay]);

  return { ref, visible: revealDelay !== null, delay: revealDelay ?? 0 };
}
