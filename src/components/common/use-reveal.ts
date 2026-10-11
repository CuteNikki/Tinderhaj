'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Whether at least `amount` of the element (or of the window, for one taller
 * than it) is in view, or any of it, once it's been scrolled past: jumped to
 * the bottom of a page, more of it won't come into view.
 */
function inView(element: Element, amount: number) {
  const { top, bottom, height } = element.getBoundingClientRect();
  const shown = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
  return height > 0 && shown > 0 && (top < 0 || shown >= Math.min(height, window.innerHeight) * amount);
}

/** Checked at every tenth of the element showing, so even one taller than the window is noticed once enough of it is. */
const THRESHOLDS = Array.from({ length: 11 }, (_, index) => index / 10);

type State = 'opening' | 'waiting' | 'scrolled';

/** One of the entrances (see .enter), not something floating forever. */
function entering(animation: Animation) {
  return animation instanceof CSSAnimation && animation.animationName.startsWith('enter-');
}

/**
 * When an element should come in (see enter). It's sent ready to play from
 * the start, after `delay`, its place in the page's opening sequence, so
 * what's in view comes in as the page shows, without waiting for JavaScript.
 * Once the page is running, what isn't in view waits, hidden, until `amount`
 * of it is scrolled to, then comes in after at most `scrollDelay`, so it
 * doesn't keep people waiting. `scrollDelay` can be worked out at that
 * moment instead, to line up with what comes into view alongside it.
 *
 * Where it is is checked as the page appears, and watched until it has come
 * in where it can be seen: arriving from further down another page, or going
 * back to one, the window only moves to where it ends up after the page is
 * in, so something that seemed in view may not be. Then it waits after all,
 * rather than coming in where nobody sees it. That only ever hides it out of
 * view, so nothing's seen going.
 */
export function useReveal<T extends Element>({
  delay = 0,
  scrollDelay = 0,
  amount = 0.1,
}: {
  delay?: number;
  scrollDelay?: number | (() => number);
  amount?: number;
}) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<State>('opening');
  const [scrolledDelay, setScrolledDelay] = useState(0);
  const latestScrollDelay = useRef(scrollDelay);
  useLayoutEffect(() => {
    latestScrollDelay.current = scrollDelay;
  });
  // The same, for the checks below, which can run again on a page shown again and must start from where it got to
  const current = useRef<State>('opening');

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const set = (next: State) => {
      current.current = next;
      setState(next);
    };
    const stop = () => {
      observer.disconnect();
      element.removeEventListener('animationend', settle);
    };
    // Not yet seen coming in: in view now, it comes in with the page; out of view, it waits
    const check = () => {
      const visible = inView(element, amount);
      if (current.current === 'opening' && !visible) set('waiting');
      else if (current.current === 'waiting' && visible) set('opening');
    };
    const observer = new IntersectionObserver(
      () => {
        if (current.current === 'waiting' && inView(element, amount)) {
          const next = latestScrollDelay.current;
          setScrolledDelay(typeof next === 'function' ? next() : next);
          set('scrolled');
          stop();
        } else check();
      },
      { threshold: THRESHOLDS },
    );
    // Coming in as the page opens only counts once it's done so in view; done out of view, nobody saw it, so it waits after all
    const settle = () => {
      if (
        current.current !== 'opening' ||
        element.getAnimations({ subtree: true }).some((animation) => entering(animation) && animation.playState === 'running')
      )
        return;
      if (inView(element, amount)) stop();
      else set('waiting');
    };

    check();
    if (current.current === 'scrolled') return;
    observer.observe(element);
    element.addEventListener('animationend', settle);
    return stop;
  }, [amount]);

  return { ref, waiting: state === 'waiting', delay: state === 'scrolled' ? scrolledDelay : delay };
}
