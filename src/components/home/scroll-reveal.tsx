'use client';

import { enter } from '@/components/common/enter';
import { useReveal } from '@/components/common/use-reveal';
import { cn } from '@/lib/utils';

/**
 * Springs into place as the page opens, or once scrolled into view. `card`
 * tips up from a slight tilt, for cards in a grid; sections and text just
 * rise. `delay` places it in the page's opening sequence; `scrollDelay` is
 * all it waits when it's only scrolled to later (see useReveal).
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
  const { ref, waiting, delay: revealDelay } = useReveal<HTMLDivElement>({ delay, scrollDelay });
  const { className: enterClassName, style } = enter(variant === 'card' ? 'card' : 'reveal', revealDelay, { waiting });

  return (
    <div id={id} ref={ref} className={cn(enterClassName, className)} style={style}>
      {children}
    </div>
  );
}
