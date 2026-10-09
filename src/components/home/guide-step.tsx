'use client';

import { Heart, Search, Sparkles } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

import { after, cardReveal, spring, STAGGER } from '@/lib/motion';

const icons = { sparkles: Sparkles, search: Search, heart: Heart };

export function GuideStep({ number, title, copy, icon }: { number: string; title: string; copy: string; icon: keyof typeof icons }) {
  const Icon = icons[icon];
  const elementRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={elementRef}
      className='group/step border-b border-current/20 py-5 last:border-b-0 md:border-r md:border-b-0 md:px-6 md:first:pl-0 last:md:border-r-0'
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={cardReveal}
      transition={after((Number(number) - 1) * STAGGER, spring.pop)}
    >
      <div className='mb-4 flex items-center justify-between'>
        <span className='text-muted-foreground font-mono text-sm'>{number}</span>
        <span className='bg-primary/10 ease-bounce flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover/step:scale-110'>
          <Icon className='text-primary group-hover/step:animate-wiggle h-5 w-5' />
        </span>
      </div>
      <h3 className='text-2xl font-bold'>{title}</h3>
      <p className='text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed'>{copy}</p>
    </motion.div>
  );
}
