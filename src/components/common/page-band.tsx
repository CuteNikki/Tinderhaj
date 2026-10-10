'use client';

import { useEffect, useRef } from 'react';

import { Ocean } from '@/components/common/ocean';

/** The header of the page showing, not of one Next keeps hidden to go back to. */
function shownHeader() {
  return [...document.querySelectorAll<HTMLElement>('#page-header')].find((header) => header.checkVisibility()) ?? null;
}

/**
 * What water the page showing asks for (see PageWater), onto main for CSS to
 * show and fit the band by (see .page-band). Between one page and the next,
 * what the one before asked for, until the next one's here.
 */
function showWater(main: HTMLElement) {
  const page = [...main.querySelectorAll<HTMLElement>('[data-water]')].find((element) => element.checkVisibility());
  if (!page) return;
  main.dataset.pageWater = page.dataset.water;
  for (const [from, to] of [
    ['floor', 'pageFloor'],
    ['tone', 'pageTone'],
  ] as const) {
    if (page.dataset[from]) main.dataset[to] = page.dataset[from];
    else delete main.dataset[to];
  }
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
    showWater(main);

    // Before the new page is first drawn, so it moves from where it was rather than starting from where it's going. On a page
    // coming in, and on one being hidden or shown again (going back): Next can add the new page while the old one still shows,
    // and only hide that after, so what shows is looked at anew each time, not only when a page comes in.
    const pages = new MutationObserver((changes) => {
      // Pages come in as main's children, and only those are hidden and shown again
      for (const change of changes) for (const node of change.addedNodes) if (node.parentElement === main) watchShown(node);
      // From where it is: partway through moving to the page before, if it still is (stopped there), or where it was. Before the band changes for the new page.
      const moving = element.getAnimations();
      const from = moving.length ? element.offsetHeight : height;
      showWater(main);
      const next = shownHeader();
      if (next === header) return;
      header = next;
      // Between one page and the next, until the next one's header is here
      if (!header) return;
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
    // Whether a page is shown is in its inline style. Watched on the pages alone, not on everything in them, whose styles animations change all the time.
    const watchShown = (node: Node) => pages.observe(node, { attributeFilter: ['style'] });
    pages.observe(main, { childList: true, subtree: true });
    for (const page of main.children) watchShown(page);
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
