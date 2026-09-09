'use client';

import { Heart, Search, Sparkles } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

const icons = { sparkles: Sparkles, search: Search, heart: Heart };

export function GuideStep({ number, title, copy, icon }: { number: string; title: string; copy: string; icon: keyof typeof icons }) {
  const Icon = icons[icon];
  const elementRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={elementRef}
      className='group/step border-b border-current/20 py-6 md:border-r md:border-b-0 md:px-8 md:py-8 first:md:pl-0 last:md:border-r-0'
      initial={{ opacity: 1, y: 22 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, delay: Number(number) * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className='mb-8 flex items-center justify-between'>
        <span className='text-muted-foreground font-mono text-sm'>{number}</span>
        <span className='bg-background flex h-10 w-10 items-center justify-center rounded-full'>
          <Icon className='text-primary h-5 w-5 transition-transform group-hover/step:rotate-12' />
        </span>
      </div>
      <h3 className='text-2xl font-bold'>{title}</h3>
      <p className='text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed'>{copy}</p>
    </motion.div>
  );
}
