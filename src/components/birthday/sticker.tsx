import Image, { type StaticImageData } from 'next/image';

import { STAGGER } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { Confetti } from '@/components/birthday/confetti';
import { glass } from '@/components/common/ocean';
import { ScrollReveal } from '@/components/home/scroll-reveal';

/**
 * A shark on a little glass card, tipped one way or the other, with confetti around
 * it and a short note under it: the birthday card's look, beside each
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
      {/* Glows and confetti behind the glass, for it to frost: the bands
          around it are plain. Each comes in on its own, so the glass is
          frosted from the start (see glass) */}
      <ScrollReveal
        variant='card'
        scrollDelay={STAGGER}
        className='absolute inset-0'
      >
        <span className='absolute top-2 left-2 size-2/3 rounded-full bg-primary/40 blur-2xl' />
        <span className='absolute right-2 bottom-2 size-1/2 rounded-full bg-pink-400/40 blur-2xl' />
        <Confetti />
      </ScrollReveal>
      <ScrollReveal
        variant='card'
        scrollDelay={STAGGER}
        className={cn(
          glass,
          'relative rounded-3xl p-6 shadow-lg',
          tilt === 'left' ? '-rotate-3' : 'rotate-3'
        )}
      >
        <figure className='flex flex-col items-center gap-2'>
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
          <figcaption className='text-lg font-bold text-primary'>
            {note}
          </figcaption>
        </figure>
      </ScrollReveal>
    </div>
  );
}
