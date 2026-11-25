import Image from 'next/image';

import { SHARKS } from '@/lib/images';
import { cn } from '@/lib/utils';

/**
 * The hugging shark, in a party hat: a striped cone with a pompom, drawn over
 * its head and tipped the way it leans.
 */
export function PartyShark({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <Image
        src={SHARKS.hug}
        alt='A Blåhaj in a party hat, with hearts above it'
        className='h-auto w-full'
        priority
      />
      <svg
        viewBox='0 0 40 52'
        aria-hidden='true'
        className='absolute top-[6%] left-[13%] w-[28%] -rotate-24'
      >
        <defs>
          <clipPath id='party-hat'>
            <path d='M20 4 L37 48 L3 48 Z' />
          </clipPath>
        </defs>
        <path d='M20 4 L37 48 L3 48 Z' className='fill-primary' />
        {/* Stripes, cut to the cone */}
        <g clipPath='url(#party-hat)' className='fill-amber-300'>
          <path d='M0 22 L40 14 L40 20 L0 28 Z' />
          <path d='M0 38 L40 30 L40 36 L0 44 Z' />
        </g>
        <circle cx='20' cy='5' r='4.5' className='fill-pink-400' />
      </svg>
    </div>
  );
}
