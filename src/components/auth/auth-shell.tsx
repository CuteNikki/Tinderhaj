'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

import { Logo } from '@/components/common/logo';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const revealTransition = { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const };

export function AuthShell({
  badge,
  icon,
  title,
  description,
  children,
  footer,
}: {
  badge: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className='bg-background relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-28'>
      <div className='pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[6rem_6rem] opacity-20 dark:opacity-25' />
      <div className='bg-primary/10 pointer-events-none absolute -top-16 -right-16 z-0 size-64 rounded-full blur-3xl lg:-top-8 lg:-right-8 lg:size-96' />
      <div className='bg-secondary/60 pointer-events-none absolute -bottom-24 -left-16 z-0 size-72 rounded-full blur-3xl lg:-bottom-12 lg:-left-8 lg:size-96' />

      <div className='relative z-10 flex w-full max-w-md flex-col items-center'>
        <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.05 }}>
          <Link href='/' className='mb-6 flex items-center gap-2'>
            <Logo className='h-8 w-8' />
          </Link>
        </motion.div>

        <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.1 }}>
          <Badge variant='secondary' className='rounded-full p-4 font-semibold tracking-wide uppercase'>
            {icon}
            {badge}
          </Badge>
        </motion.div>

        <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.2 }}>
          <h1 className='mt-4 text-center text-3xl leading-none font-black tracking-tight sm:text-4xl'>{title}</h1>
        </motion.div>

        <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.3 }}>
          <p className='text-muted-foreground mt-3 max-w-sm text-center text-sm leading-relaxed text-balance'>{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...revealTransition, delay: 0.4 }}
          className='mt-8 w-full'
        >
          <Card className='ring-foreground/10 shadow-xl'>
            <CardContent className='pt-2'>{children}</CardContent>
          </Card>
        </motion.div>

        {footer && (
          <motion.div initial='hidden' animate='visible' variants={reveal} transition={{ ...revealTransition, delay: 0.5 }} className='mt-6'>
            {footer}
          </motion.div>
        )}
      </div>
    </div>
  );
}
