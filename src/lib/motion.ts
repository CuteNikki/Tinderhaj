/**
 * How things move on the site, all of it done in CSS (see globals.css): the
 * springs (`--spring-soft`, `--spring-pop`, `--spring-snappy`), what comes in
 * (see Enter and useReveal) and what floats. These are the timings and
 * classes shared between them.
 */

import { cn } from '@/lib/utils';

/** Time between things coming in one after another. */
export const STAGGER = 0.1;

/** When a page's content starts coming in, once its header has. */
export const CONTENT_DELAY = 0.35;

/** The same lift, as classes: for every card you can click, so they all answer the pointer alike. */
export const LIFT = 'ease-bounce transition-all duration-300 hover:-translate-y-1 hover:rotate-[-0.6deg] hover:shadow-lg';

/** A big shark under the pointer: grows a little and leans back. */
export const SHARK_HOVER = 'spring-hover hover:scale-104 hover:-rotate-3';

/** Floating in place, forever, every big shark the same way, on a wrapper of its own (see bob-shark). */
export const BOB_SHARK = 'bob-shark';

/**
 * The same, more gently, for the pills and cards around a shark, as props for
 * a wrapper of their own: `delay` so they don't all bob together, `rotate`
 * for one set at a slant.
 */
export function bob({ delay = 0, rotate, className }: { delay?: number; rotate?: number; className?: string } = {}) {
  return {
    className: cn(rotate === undefined ? 'bob-small' : 'bob-tilt', className),
    style: { '--bob-delay': `${delay}s`, ...(rotate === undefined ? {} : { '--bob-rotate': `${rotate}deg` }) } as React.CSSProperties,
  };
}
