'use client';

import Image from 'next/image';

import { SHARKS } from '@/lib/images';

import { enter } from '@/components/common/enter';
import { useReveal } from '@/components/common/use-reveal';

/**
 * A shark peeking over the top edge of a section, its arms on the line,
 * popping up from behind it as it comes into view. Set across the edge (see
 * Section's `edge`). Just for looks.
 */
export function PeekingShark() {
  // Coming into view here, not on the shark, which is cut off entirely until then
  const { ref, waiting } = useReveal<HTMLDivElement>({ delay: 0.3, scrollDelay: 0.3 });
  const { className, style } = enter('peek', 0.3, { waiting });

  return (
    // Cut off at the line, so the shark's below it is hidden behind the section
    <div ref={ref} aria-hidden className='h-16 overflow-hidden'>
      <div className={`origin-bottom ${className}`} style={style}>
        <Image unoptimized src={SHARKS.small} width={112} height={112} alt='' className='h-auto w-28' />
      </div>
    </div>
  );
}
