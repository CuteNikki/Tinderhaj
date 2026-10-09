import type { TargetAndTransition, Transition, Variants } from 'motion/react';

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

/** Settles down into place from just above, so it never dips below where it rests. For headers just above the water. */
export const sink: Variants = {
  hidden: { opacity: 0, y: -16, scale: 0.97 },
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

/** A big shark swimming in: rises, grows and turns upright as it comes. */
export const swimIn: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.85, rotate: -10 },
  visible: { opacity: 1, y: 0, scale: 1, rotate: 0 },
};

/** The rings around a shark, growing into place. */
export const ringIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

/** A big shark under the pointer: grows a little and leans back. */
export const sharkHover = { scale: 1.04, rotate: -3, transition: spring.snappy };

/**
 * Floating in place, forever, every big shark the same way. Spread into a
 * motion element: `<motion.div {...bob.shark}>`.
 */
/** Floating, as spread into a motion element. */
type Float = { animate: TargetAndTransition; transition: Transition };

export const bob: { shark: Float; small: (delay?: number, rotate?: number) => Float } = {
  shark: { animate: { y: [0, -10, 0], rotate: [-2, 2, -2] }, transition: { duration: 6, ease: 'easeInOut', repeat: Infinity } },
  /** The little pills and cards floating around a shark; `delay` so they don't all bob together, `rotate` for one set at a slant. */
  small: (delay = 0, rotate) => ({
    animate: { y: [0, -5, 0], ...(rotate === undefined ? {} : { rotate: [rotate, rotate - 4, rotate] }) },
    transition: { duration: 4, ease: 'easeInOut', repeat: Infinity, delay },
  }),
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

/** The same lift, as classes: for every card you can click, so they all answer the pointer alike. */
export const LIFT = 'ease-bounce transition-all duration-300 hover:-translate-y-1 hover:rotate-[-0.6deg] hover:shadow-lg';

/** Squishes a little when pressed. */
export const press = { scale: 0.95, transition: spring.snappy };

/** Time between things coming in one after another. */
export const STAGGER = 0.1;

/** When a page's content starts coming in, once its header has. */
export const CONTENT_DELAY = 0.35;
