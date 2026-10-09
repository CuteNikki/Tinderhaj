'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

import { glass } from '@/components/common/ocean';
import { after, bob, popIn, ringIn, sharkHover, spring, swimIn } from '@/lib/motion';

/** Question marks floating around the shark: where, how big, and when each bobs. */
const MARKS = [
  { className: 'top-[12%] right-[14%] size-14 text-2xl', delay: 0, rotate: 12 },
  { className: 'top-[42%] left-[4%] size-11 text-xl', delay: 0.8, rotate: -10 },
  { className: 'right-[6%] bottom-[18%] size-9 text-base', delay: 1.6, rotate: 6 },
];

/** A shark thinking it over, beside the questions on wide screens. Just for looks. */
export function PonderingShark() {
  return (
    <div aria-hidden className='relative hidden aspect-square w-80 items-center justify-center lg:flex xl:w-96'>
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={ringIn}
        transition={after(0.1)}
        className='border-primary/20 absolute inset-10 rounded-full border'
      />
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={ringIn}
        transition={after(0.2)}
        className='border-primary/15 absolute inset-0 rounded-full border border-dashed'
      />
      <motion.div
        initial='hidden'
        whileInView='visible'
        variants={swimIn}
        viewport={{ once: true }}
        transition={after(0.3, spring.pop)}
        whileHover={sharkHover}
        className='relative z-10'
      >
        <motion.div {...bob.shark}>
          <Image unoptimized src='/blahajThink.webp' width={320} height={320} alt='' className='h-auto w-40 drop-shadow-2xl xl:w-48' />
        </motion.div>
      </motion.div>
      {/* The glass pops in on itself, inside what bobs, so it's frosted from the start (see glass) */}
      {MARKS.map(({ className, delay, rotate }) => (
        <motion.span key={className} {...bob.small(delay, rotate)} className={`absolute ${className}`}>
          <motion.span
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={popIn}
            transition={after(0.4 + delay / 4, spring.pop)}
            className={`${glass} flex size-full items-center justify-center rounded-full font-black shadow-lg`}
          >
            <span className='text-[#ed3867]'>?</span>
          </motion.span>
        </motion.span>
      ))}
      <motion.div {...bob.small(0.4)} className='absolute bottom-[8%] left-[10%] z-20'>
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={popIn}
          transition={after(0.7, spring.pop)}
          className={`${glass} rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap shadow-lg`}
        >
          Good question!
        </motion.div>
      </motion.div>
    </div>
  );
}
