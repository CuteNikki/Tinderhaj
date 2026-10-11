'use client';

import Image from 'next/image';

import { SHARKS } from '@/lib/images';
import { BOB_SHARK, bob, SHARK_HOVER } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { enter } from '@/components/common/enter';
import { glass } from '@/components/common/ocean';
import { useReveal } from '@/components/common/use-reveal';

/** Question marks floating around the shark: where, how big, and when each bobs. */
const MARKS = [
  { className: 'top-[12%] right-[14%] size-14 text-2xl', delay: 0, rotate: 12 },
  { className: 'top-[42%] left-[4%] size-11 text-xl', delay: 0.8, rotate: -10 },
  { className: 'right-[6%] bottom-[18%] size-9 text-base', delay: 1.6, rotate: 6 },
];

/** A shark thinking it over, beside the questions on wide screens. Just for looks. */
export function PonderingShark() {
  // All of it coming in together, in the same order however it's reached, once enough is in view that the rings at its edges are too
  const { ref, waiting } = useReveal<HTMLDivElement>({ amount: 0.5 });
  const inner = enter('ring', 0.1, { waiting });
  const outer = enter('ring', 0.2, { waiting });
  const shark = enter('swim', 0.3, { waiting });
  const pill = enter('pop', 0.7, { waiting });

  return (
    <div ref={ref} aria-hidden className='relative hidden aspect-square w-80 items-center justify-center lg:flex xl:w-96'>
      <div className={cn('border-primary/20 absolute inset-10 rounded-full border', inner.className)} style={inner.style} />
      <div className={cn('border-primary/15 absolute inset-0 rounded-full border border-dashed', outer.className)} style={outer.style} />
      <div className={cn('relative z-10', SHARK_HOVER, shark.className)} style={shark.style}>
        <div className={BOB_SHARK}>
          <Image unoptimized src={SHARKS.think} width={320} height={320} alt='' className='h-auto w-32 drop-shadow-2xl xl:w-40' />
        </div>
      </div>
      {/* The glass pops in on itself, inside what bobs, so it's frosted from the start (see glass) */}
      {MARKS.map(({ className, delay, rotate }) => {
        const mark = enter('pop', 0.4 + delay / 4, { waiting });
        return (
          <span key={className} {...bob({ delay, rotate, className: `absolute ${className}` })}>
            <span className={cn(glass, 'flex size-full items-center justify-center rounded-full font-black shadow-lg', mark.className)} style={mark.style}>
              <span className='text-[#ed3867]'>?</span>
            </span>
          </span>
        );
      })}
      <div {...bob({ delay: 0.4, className: 'absolute bottom-[8%] left-[10%] z-20' })}>
        <div className={cn(glass, 'rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap shadow-lg', pill.className)} style={pill.style}>
          Good question!
        </div>
      </div>
    </div>
  );
}
