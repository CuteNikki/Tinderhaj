import Image from 'next/image';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className='py-20'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='text-5xl font-bold mb-6 text-primary'>Find Your Perfect Blåhaj Match</h2>
        <p className='text-xl mb-8 text-foreground/80'>The world&apos;s first dating site exclusively for IKEA Blåhaj enthusiasts!</p>
        <Image src='/blahaj_couple.webp' alt='Blåhaj Couple' width={500} height={500} className='rounded-lg mx-auto mb-8' />
        <Button size='lg'>
          Dive In Now
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
