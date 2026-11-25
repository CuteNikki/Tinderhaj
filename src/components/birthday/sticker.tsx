import Image, { type StaticImageData } from 'next/image';

import { cn } from '@/lib/utils';

import { Confetti } from '@/components/birthday/confetti';
import { handwriting } from '@/components/birthday/handwriting';

/**
 * A shark on a little card, tipped one way or the other, with confetti around
 * it and a handwritten note under it: the birthday card's look, beside each
 * line of the story. `still` is shown instead of `src` to those who ask for
 * less motion, for a moving one.
 */
export function Sticker({
  src,
  still,
  note,
  tilt,
}: {
  src: StaticImageData;
  still?: StaticImageData;
  note: string;
  tilt: 'left' | 'right';
}) {
  return (
    <div className='relative mx-auto w-full max-w-60'>
      <Confetti />
      <figure
        className={cn(
          'relative flex flex-col items-center gap-2 rounded-3xl border border-foreground/10 bg-card p-6 shadow-lg',
          tilt === 'left' ? '-rotate-3' : 'rotate-3'
        )}
      >
        <Image
          src={src}
          alt=''
          unoptimized={src.src.endsWith('.gif')}
          className={cn('h-auto w-40', still && 'motion-reduce:hidden')}
        />
        {still && (
          <Image
            src={still}
            alt=''
            className='hidden h-auto w-40 motion-reduce:block'
          />
        )}
        <figcaption
          className={cn(
            handwriting.className,
            'text-2xl font-bold text-primary'
          )}
        >
          {note}
        </figcaption>
      </figure>
    </div>
  );
}
