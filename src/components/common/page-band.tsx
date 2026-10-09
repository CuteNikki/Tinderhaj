'use client';

import { useEffect, useRef } from 'react';

import { Ocean } from '@/components/common/ocean';

/** The header of the page showing, not of one Next keeps hidden to go back to. */
function shownHeader() {
  return [...document.querySelectorAll<HTMLElement>('#page-header')].find((header) => header.checkVisibility()) ?? null;
}

/**
 * The band of water across the top of a page, flowing into the page below its
 * header (see PageWater). CSS keeps it fitted to the header (see .page-band);
 * going to a page whose header is taller or shorter, it moves to it quickly,
 * starting as the page appears, rather than jumping.
 */
export function PageBand() {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = band.current;
    const main = element?.parentElement;
    if (!element || !main) return;
    let header = shownHeader();
    let height = element.offsetHeight;

    // Before the new page is first drawn, so it moves from where it was rather than starting from where it's going
    const pages = new MutationObserver((changes) => {
      // A page coming in, or one kept hidden being shown again (going back), not the styles animations change all the time
      if (!changes.some((change) => change.type === 'childList' || change.oldValue?.includes('display: none'))) return;
      const next = shownHeader();
      if (next === header) return;
      header = next;
      // Between one page and the next, until the next one's header is here
      if (!header) return;
      // From where it is: partway through moving to the page before, if it still is (stopped there), or where it was
      const moving = element.getAnimations();
      const from = moving.length ? element.offsetHeight : height;
      for (const move of moving) move.cancel();
      height = element.offsetHeight;
      // Not when it's only just shown (coming from a page without it), or for those who ask for less motion
      if (!from || !height || from === height || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      element.animate(
        [
          { height: `${from}px`, bottom: 'auto' },
          { height: `${height}px`, bottom: 'auto' },
        ],
        { duration: 350, easing: 'ease-out' },
      );
    });
    pages.observe(main, { childList: true, subtree: true, attributeFilter: ['style'], attributeOldValue: true });
    // Fitted anew as the window changes, and none at all while hidden on a page without it
    const resizes = new ResizeObserver(() => {
      if (element.getAnimations().length === 0) height = element.offsetHeight;
    });
    resizes.observe(element);

    return () => {
      pages.disconnect();
      resizes.disconnect();
    };
  }, []);

  return (
    <div ref={band} className='page-band pointer-events-none absolute inset-x-0 -z-10'>
      {/* Deeper than it usually shows, so moving to a page whose header is taller or shorter moves only the waves */}
      <Ocean into='fill-(--band-floor)' depth='h-96 min-h-full' />
    </div>
  );
}
