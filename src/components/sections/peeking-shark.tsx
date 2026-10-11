'use client';

import Image from 'next/image';

import { motion } from 'motion/react';

import { after, spring } from '@/lib/motion';

/** Up from behind the line, turning upright as it comes. */
const peek = {
  hidden: { y: '100%', rotate: -8 },
  visible: { y: 0, rotate: 0 },
};

/**
 * A shark peeking over the top edge of a section, its arms on the line,
 * popping up from behind it as it comes into view. Set across the edge (see
 * Section's `edge`). Just for looks.
 */
export function PeekingShark() {
  return (
    // Cut off at the line, so the shark's below it is hidden behind the section. Coming into view here, not on the shark, which is cut off entirely until then.
    <motion.div aria-hidden initial='hidden' whileInView='visible' viewport={{ once: true }} className='h-16 overflow-hidden'>
      <motion.div variants={peek} transition={after(0.3, spring.pop)} className='origin-bottom'>
        <Image unoptimized src='/blahajSmall.webp' width={112} height={112} alt='' className='h-auto w-28' />
      </motion.div>
    </motion.div>
  );
}
