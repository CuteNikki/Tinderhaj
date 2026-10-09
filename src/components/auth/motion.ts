import type { Variants } from 'motion/react';

import { reveal, spring, stagger } from '@/lib/motion';

/** The fields and buttons of the auth forms, one after another. */
export const staggerContainer = stagger(0.06, 0.05);

/** Each rising like everything else does (see reveal). */
export const staggerItem: Variants = {
  hidden: reveal.hidden,
  visible: { ...(reveal.visible as object), transition: spring.pop },
};
