import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Search, Shield, Zap } from 'lucide-react';

import { ProfileCount } from '@/components/home/profile-count';
import { TypographyH1, TypographyMuted } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

export function Hero() {
  return (
    <section id='hero' className='bg-muted w-full py-12 md:py-24 lg:py-32'>
      <div className='container mx-auto px-4 md:px-8'>
        <div className='flex flex-col items-center justify-evenly gap-8 sm:flex-row md:gap-24'>
          <div className='flex flex-col gap-4'>
            <Badge variant='secondary'>Introducing Tinderhaj</Badge>
            <TypographyH1 className='text-3xl sm:text-4xl lg:text-5xl'>
              Find Your Perfect
              <br />
              Blahaj Match
            </TypographyH1>
            <TypographyMuted className='max-w-md text-balance'>{"The world's first dating site exclusively for IKEA's Blahaj plush sharks."}</TypographyMuted>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button>
                Sign Up
                <ArrowRight className='h-4 w-4' />
              </Button>
              <Button asChild variant='secondary'>
                <Link href='/discovery'>
                  Start Discovering
                  <Search className='h-4 w-4' />
                </Link>
              </Button>
            </div>
            <div className='flex flex-col items-center gap-2 pt-4 sm:flex-row sm:gap-6'>
              <div className='flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                <Suspense fallback={<TypographyMuted className='text-sm'>Loading...</TypographyMuted>}>
                  <ProfileCount />
                </Suspense>
              </div>
              <div className='flex items-center gap-2'>
                <Zap className='h-5 w-5' />
                <TypographyMuted className='text-sm'>100% plush certified</TypographyMuted>
              </div>
            </div>
          </div>
          <div className='w-fit'>
            <Image
              unoptimized
              priority
              src='/blahajSpin.gif'
              width={280}
              height={280}
              alt='Blahaj plush shark with heart'
              className='rounded-xl object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
