import Image from 'next/image';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className='py-16 md:py-32'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center justify-center gap-16 md:flex-row'>
          <div className='flex flex-col items-center text-center md:items-start md:text-start'>
            <span className='mb-2 text-pretty text-3xl font-bold'>Find Your Perfect Blåhaj Match</span>
            <p className='mb-4 text-pretty text-xl text-muted-foreground'>The world&apos;s first dating site exclusively for IKEA Blåhaj!</p>
            <Button size='lg' className='w-fit'>
              Dive In Now
              <ArrowRight />
            </Button>
          </div>
          <div className='w-fit'>
            <Image src='/blahaj_couple.webp' alt='Blåhaj Couple' width={400} height={400} className='mx-auto mb-4 rounded-lg' />
          </div>
        </div>
      </div>
    </section>
  );
}
