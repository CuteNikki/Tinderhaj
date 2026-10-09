'use client';

import { motion, type HTMLMotionProps } from 'motion/react';

/** A button scrolling to `targetId`, which can come in as any motion element does. */
export function ScrollToElement({ targetId, ...props }: { targetId: string } & Omit<HTMLMotionProps<'button'>, 'type' | 'onClick'>) {
  function handleClick() {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return <motion.button type='button' onClick={handleClick} {...props} />;
}
