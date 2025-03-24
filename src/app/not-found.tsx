import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Search } from 'lucide-react';

import { notFoundMetadata } from '@/constants/metadata';

import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';
import { TypographyH1, TypographyMuted } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = notFoundMetadata;

export default function Home() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        <section id='hero' className='bg-muted w-full py-12 sm:py-24 lg:py-32'>
          <div className='container mx-auto px-4 md:px-8'>
            <div className='flex flex-col items-center justify-evenly gap-4 sm:flex-row md:gap-8'>
              <div className='flex flex-col items-center gap-4 text-center sm:items-start sm:text-left'>
                <Badge variant='secondary'>404</Badge>
                <TypographyH1 className='text-3xl sm:text-4xl lg:text-5xl'>Blahaj not found</TypographyH1>
                <TypographyMuted className='max-w-md text-balance'>
                  {"Oops! Looks like you've swum too far."}
                  <br />
                  ...or we lost this page in the deep sea.
                </TypographyMuted>
                <div className='flex flex-col gap-4 sm:flex-row'>
                  <Button asChild>
                    <Link href='/'>
                      Swim Home
                      <ArrowRight className='h-4 w-4' />
                    </Link>
                  </Button>
                  <Button asChild variant='secondary'>
                    <Link href='/discovery'>
                      View Discovery
                      <Search className='h-4 w-4' />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className='animate-float w-fit'>
                <Image
                  unoptimized
                  priority
                  draggable={false}
                  width={280}
                  height={280}
                  src='/blahajSpin.gif'
                  alt='Blahaj plush'
                  className='w-70y h-70 rounded-xl object-cover select-none'
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
