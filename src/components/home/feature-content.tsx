'use client';

import { ArrowRight, Heart, Search, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const trustItems = [
  { label: 'Verified profiles', Icon: ShieldCheck },
  { label: '100% good intentions', Icon: Heart },
  { label: 'Zero judgment', Icon: Search },
];

export function FeatureContent() {
  return (
    <motion.div
      className='container mx-auto max-w-7xl'
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className='flex flex-col items-start justify-between gap-10 md:flex-row md:items-center lg:px-8'>
        <div>
          <p className='mb-3 text-xs font-bold tracking-widest uppercase opacity-60'>Ready when you are</p>
          <h2 className='max-w-2xl text-4xl font-black tracking-tight sm:text-5xl'>Your next great connection is probably very soft.</h2>
          <motion.div
            className='text-muted-foreground flex flex-wrap gap-x-8 gap-y-4 pt-6 text-sm'
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {trustItems.map(({ label, Icon }) => (
              <span key={label} className='flex items-center gap-2'>
                <Icon className='h-4 w-4' /> {label}
              </span>
            ))}
          </motion.div>
        </div>
        <Button size='lg' className='h-12 rounded-full px-6' asChild>
          <Link href='/discovery'>
            Start discovering <ArrowRight />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
