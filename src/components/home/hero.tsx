import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Search, Shield, Zap } from 'lucide-react';

// import { ProfileCount, ProfileCountSkeleton } from '@/components/home/profile-count';
import { TypographyH1, TypographyMuted } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section id='hero' className='flex min-h-screen'>
      <div className='relative flex min-h-full flex-1 items-center justify-center py-12 md:py-0'>
        {/* Background gradient */}
        <div className='from-background via-background to-primary/10 dark:to-primary/30 absolute inset-0 -z-10 bg-linear-to-br' />
        {/* Decorative wave shapes */}
        <div className='absolute right-0 bottom-0 left-0 h-64 overflow-hidden opacity-30'>
          <svg className='absolute bottom-0 h-full w-full' viewBox='0 0 1440 320' preserveAspectRatio='none'>
            <path
              fill='currentColor'
              className='text-primary/60'
              d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,181.3C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
            />
          </svg>
        </div>
        <div className='container mx-auto px-4 md:px-8'>
          <div className='flex flex-col items-center justify-evenly gap-4 sm:flex-row md:gap-8'>
            <div className='from-background via-background to-primary/10 dark:to-primary/30 border-primary/10 dark:border-primary/20 flex flex-col items-center gap-4 rounded-3xl border bg-linear-to-tl p-6 text-center sm:items-start sm:text-left dark:via-none'>
              <Badge variant='secondary' className='p-3'>
                <span className='relative mr-1 flex h-2 w-2'>
                  <span className='bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
                  <span className='bg-primary relative inline-flex h-2 w-2 rounded-full' />
                </span>
                Introducing Tinderhaj
              </Badge>
              <TypographyH1 className='text-3xl sm:text-4xl lg:text-5xl'>
                Find Your Perfect
                <br />
                Blåhaj Match
              </TypographyH1>
              <TypographyMuted className='max-w-md text-balance'>{"The world's first dating site exclusively for IKEA's Blåhaj plush sharks."}</TypographyMuted>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Button size='lg' className='px-4' asChild>
                  <Link href='/sign-up'>
                    Sign Up
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </Button>
                <Button size='lg' className='px-4' asChild variant='secondary'>
                  <Link href='/discovery'>
                    Start Discovering
                    <Search className='h-4 w-4' />
                  </Link>
                </Button>
              </div>
              <div className='flex flex-col items-center gap-2 pt-4 sm:flex-row sm:gap-6'>
                <div className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  {/* <Suspense fallback={<ProfileCountSkeleton />}>
                  <ProfileCount />
                  </Suspense> */}
                </div>
                <div className='flex items-center gap-2'>
                  <Zap className='h-5 w-5' />
                  <TypographyMuted className='text-sm'>100% plush certified</TypographyMuted>
                </div>
              </div>
            </div>
            <div className='animate-float w-fit'>
              <Image
                unoptimized
                priority
                draggable={false}
                width={280}
                height={280}
                src='/blahaj-float.webp'
                alt='Blåhaj Plush'
                className='h-40 w-60 rounded-xl object-cover select-none sm:w-90 lg:h-90'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
