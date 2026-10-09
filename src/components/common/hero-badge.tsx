'use client';

import { motion } from 'motion/react';

import { after, popIn, spring } from '@/lib/motion';

import { glass } from '@/components/common/ocean';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * The label above a big hero's title, in a glass pill, as on the shared pictures, popping in after `delay`.
 * Smaller headers use an Eyebrow.
 */
export function HeroBadge({ icon, delay = 0, className, children }: { icon?: React.ReactNode; delay?: number; className?: string; children: React.ReactNode }) {
  return (
    <Badge asChild className={cn(glass, 'dark:bg-glass gap-2 p-4 font-semibold tracking-wide uppercase shadow-lg transition-none', className)}>
      {/* Popping in on itself rather than in a wrapper, so it's frosted from the start (see glass); no CSS transition to drag behind */}
      <motion.span initial='hidden' animate='visible' variants={popIn} transition={after(delay, spring.pop)}>
        {icon}
        {children}
      </motion.span>
    </Badge>
  );
}
