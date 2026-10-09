'use client';

import { motion } from 'motion/react';

import { useReveal } from '@/components/common/use-reveal';
import { after, cardReveal, reveal, spring } from '@/lib/motion';

/**
 * Springs into place once scrolled into view. `card` tips up from a slight
 * tilt, for cards in a grid; sections and text just rise. `delay` places it
 * in the page's opening sequence; `scrollDelay` is all it waits when it's
 * only scrolled to later (see useReveal).
 */
export function ScrollReveal({
  id,
  children,
  className,
  delay = 0,
  scrollDelay = 0,
  variant = 'section',
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  scrollDelay?: number;
  variant?: 'section' | 'card';
}) {
  const { ref, visible, delay: revealDelay } = useReveal<HTMLDivElement>({ delay, scrollDelay });

  return (
    <motion.div
      id={id}
      ref={ref}
      className={className}
      initial='hidden'
      animate={visible ? 'visible' : 'hidden'}
      variants={variant === 'card' ? cardReveal : reveal}
      transition={after(revealDelay, variant === 'card' ? spring.pop : spring.soft)}
    >
      {children}
    </motion.div>
  );
}
