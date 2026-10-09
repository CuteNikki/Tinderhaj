'use client';

import { motion } from 'motion/react';
import { Children } from 'react';

import { useReveal } from '@/components/common/use-reveal';
import { cardReveal, popIn, reveal, sink, spring, STAGGER, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

const variants = { section: reveal, sink, card: cardReveal, pop: popIn };

/**
 * Shows its children one after another once scrolled into view, each
 * wrapped in an `itemAs` element: `li` inside a `ul`, `span` in a line of
 * badges. `section` rises, `sink` settles from above, `card` tips up, `pop`
 * grows with a wobble.
 */
export function Stagger({
  id,
  children,
  className,
  itemClassName,
  as = 'div',
  itemAs = 'div',
  variant = 'section',
  gap = STAGGER,
  delay = 0,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
  as?: 'div' | 'ul' | 'nav' | 'header';
  itemAs?: 'div' | 'li' | 'span';
  variant?: keyof typeof variants;
  gap?: number;
  delay?: number;
}) {
  const Container = motion[as];
  const Item = motion[itemAs];
  // `delay` places it in the page's opening sequence (see useReveal).
  const { ref, visible, delay: revealDelay } = useReveal<HTMLElement>({ delay });

  return (
    <Container
      id={id}
      ref={ref as React.Ref<never>}
      className={className}
      initial='hidden'
      animate={visible ? 'visible' : 'hidden'}
      variants={stagger(gap, revealDelay)}
    >
      {Children.map(children, (child) =>
        child === null || child === undefined || child === false ? null : (
          // Transforms don't move inline elements, so spans become inline boxes.
          <Item
            className={cn(itemAs === 'span' && 'inline-flex', itemClassName)}
            variants={variants[variant]}
            transition={variant === 'section' || variant === 'sink' ? spring.soft : spring.pop}
          >
            {child}
          </Item>
        ),
      )}
    </Container>
  );
}
