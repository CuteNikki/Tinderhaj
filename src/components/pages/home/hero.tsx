import Image from 'next/image';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className='py-20'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='mb-6 text-5xl font-bold text-primary'>Find Your Perfect Blåhaj Match</h2>
        <p className='mb-8 text-xl text-foreground/80'>The world&apos;s first dating site exclusively for IKEA Blåhaj enthusiasts!</p>
        <Image src='/blahaj_couple.webp' alt='Blåhaj Couple' width={500} height={500} className='mx-auto mb-8 rounded-lg' />
        <Button size='lg'>
          Dive In Now
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
