'use client';

import { Children, useRef } from 'react';

import { enter, type EnterVariant } from '@/components/common/enter';
import { useReveal } from '@/components/common/use-reveal';
import { STAGGER } from '@/lib/motion';
import { cn } from '@/lib/utils';

const variants = { section: 'reveal', sink: 'sink', card: 'card', pop: 'pop' } satisfies Record<string, EnterVariant>;

/** How close together things must come into view to count as coming in together. */
const TOGETHER = 50;

/**
 * Shows its children one after another as the page opens, or as they're
 * scrolled into view (see useReveal), each wrapped in an `itemAs` element:
 * `li` inside a `ul`, `span` in a line of badges. `section` rises, `sink`
 * settles from above (for a page's header), `card` tips up, `pop` grows with
 * a wobble. `delay` places it in the page's opening sequence.
 *
 * Each child comes in by itself, so a list taller than the window doesn't
 * come in all at once while most of it is out of view; those scrolled into
 * view together still come in one after another.
 */
export function Stagger({
  id,
  children,
  className,
  itemClassName,
  as: Container = 'div',
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
  // Children scrolled into view at about the same moment, so each waits its turn
  const batch = useRef({ at: -Infinity, count: 0 });
  const nextInLine = () => {
    const now = performance.now();
    if (now - batch.current.at > TOGETHER) batch.current = { at: now, count: 0 };
    return batch.current.count++ * gap;
  };
  let index = 0;

  return (
    <Container id={id} className={className}>
      {Children.map(children, (child) =>
        child === null || child === undefined || child === false ? null : (
          <StaggerItem as={itemAs} variant={variants[variant]} delay={delay + index++ * gap} scrollDelay={nextInLine} className={itemClassName}>
            {child}
          </StaggerItem>
        ),
      )}
    </Container>
  );
}

function StaggerItem({
  as: Item,
  variant,
  delay,
  scrollDelay,
  className,
  children,
}: {
  as: 'div' | 'li' | 'span';
  variant: EnterVariant;
  delay: number;
  scrollDelay: () => number;
  className?: string;
  children: React.ReactNode;
}) {
  const { ref, waiting, delay: revealDelay } = useReveal<HTMLElement>({ delay, scrollDelay });
  const { className: enterClassName, style } = enter(variant, revealDelay, { waiting });

  return (
    // Transforms don't move inline elements, so spans become inline boxes.
    <Item ref={ref as React.Ref<never>} className={cn(enterClassName, Item === 'span' && 'inline-flex', className)} style={style}>
      {children}
    </Item>
  );
}
