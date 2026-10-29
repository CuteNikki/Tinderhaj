'use client';

import { useEffect, useRef } from 'react';

/**
 * Safari, and every browser on iOS, plays AnimatedCount's animation but
 * doesn't draw the counter again as it climbs, so the number sits at 0 until
 * it lands. There, this follows the animation each frame and puts where it's
 * got to in data-now, which the counter shows instead (see .count-up in
 * globals.css). Elsewhere it does nothing.
 */
export function WebKitCount() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = ref.current?.parentElement;
    if (!counter || navigator.vendor !== 'Apple Computer, Inc.') return;
    const animation = counter.getAnimations({ subtree: true }).find((a) => a instanceof CSSAnimation && a.animationName === 'count-up');
    if (!animation) return;
    const target = Number(counter.style.getPropertyValue('--count'));

    let frame = 0;
    const follow = () => {
      // Eased, as the animation is; 0 while it waits its turn
      const progress = animation.effect?.getComputedTiming().progress ?? 1;
      counter.dataset.now = String(Math.round(progress * target));
      if (animation.playState !== 'finished') frame = requestAnimationFrame(follow);
    };
    follow();
    return () => cancelAnimationFrame(frame);
  }, []);

  return <span ref={ref} hidden />;
}
