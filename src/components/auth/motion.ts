import type { Variants } from 'motion/react';

import { spring, stagger } from '@/lib/motion';

/** The fields and buttons of the auth forms, one after another. */
export const staggerContainer = stagger(0.06, 0.05);

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring.pop },
};
