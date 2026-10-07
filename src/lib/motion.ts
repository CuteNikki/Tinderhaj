import type { Transition, Variants } from 'motion/react';

/**
 * Springs with a little overshoot, so things land rather than just stop.
 * Set by how long they visibly take and how much they bounce, so they settle
 * quickly instead of wobbling on. Shared by every animation on the site.
 */
export const spring = {
  /** Sections, headings and text: settles softly. */
  soft: { type: 'spring', visualDuration: 0.45, bounce: 0.1 },
  /** Cards, badges and icons: a small bounce. */
  pop: { type: 'spring', visualDuration: 0.4, bounce: 0.25 },
  /** Things reacting to the pointer: quick. */
  snappy: { type: 'spring', visualDuration: 0.25, bounce: 0.2 },
} as const satisfies Record<string, Transition>;

/** Rises into place, growing a touch as it comes. For text and sections. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

/** Tips up from a slight tilt, like a card being set down. */
export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.94, rotate: -1.5 },
  visible: { opacity: 1, y: 0, scale: 1, rotate: 0 },
};

/** Grows out of nothing with a wobble. For badges, logos and icons. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5, rotate: -12 },
  visible: { opacity: 1, scale: 1, rotate: 0 },
};

/** Shows children one after another. */
export function stagger(gap = 0.07, delay = 0.05): Variants {
  return { hidden: {}, visible: { transition: { staggerChildren: gap, delayChildren: delay } } };
}

/** The same transition with a delay, e.g. `{ ...spring.soft, delay: 0.1 }` without repeating it. */
export function after(delay: number, transition: Transition = spring.soft): Transition {
  return { ...transition, delay };
}

/** Lifts and tips a little under the pointer. */
export const hoverLift = { y: -4, rotate: -0.8, transition: spring.snappy };

/** Squishes a little when pressed. */
export const press = { scale: 0.95, transition: spring.snappy };

/** Time between things coming in one after another. */
export const STAGGER = 0.1;

/** When a page's content starts coming in, once its header has. */
export const CONTENT_DELAY = 0.35;
