'use client';

import { ArrowRight, Heart, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

import { popIn, reveal, spring, stagger } from '@/lib/motion';

import { DiscoveryLink } from '@/components/discovery/link';
import { Button } from '@/components/ui/button';

const trustItems = [
  { label: 'Verified Profiles', Icon: ShieldCheck },
  { label: '100% Good Intentions', Icon: Heart },
  { label: 'Zero Judgment', Icon: Search },
];

export function FeatureContent() {
  return (
    <motion.div
      className='container mx-auto max-w-7xl'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.35 }}
      variants={reveal}
      transition={spring.soft}
    >
      <div className='flex flex-col items-start justify-between gap-10 md:flex-row md:items-center'>
        <div>
          <p className='mb-3 text-xs font-bold tracking-widest uppercase opacity-60'>Ready when you are</p>
          <h2 className='max-w-2xl text-4xl font-black tracking-tight sm:text-5xl'>Your next great connection is probably very soft.</h2>
          <motion.div
            className='text-muted-foreground flex flex-wrap gap-x-8 gap-y-4 pt-6 text-sm'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.35 }}
            variants={stagger(0.1, 0.2)}
          >
            {trustItems.map(({ label, Icon }) => (
              <motion.span key={label} variants={popIn} transition={spring.pop} className='flex items-center gap-2'>
                <Icon className='h-4 w-4' /> {label}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <Button size='lg' className='h-12 rounded-full px-6' asChild>
          <DiscoveryLink>
            Start Discovering <ArrowRight />
          </DiscoveryLink>
        </Button>
      </div>
    </motion.div>
  );
}
