import Image from 'next/image';

import { TypographyH2, TypographyH4, TypographyMuted } from '@/components/typography';
import { Card, CardContent } from '@/components/ui/card';

export function Features() {
  return (
    <section id='features' className='w-full py-24'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <TypographyH2>Features That Make a Splash</TypographyH2>
            <TypographyMuted className='text-balance'>Discover what makes Tinderhaj the premier dating platform for plush sharks everywhere.</TypographyMuted>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-6 pt-12 lg:flex-row'>
          <Card className='max-w-96'>
            <CardContent>
              <div className='flex flex-col items-center space-y-2 text-center'>
                <Image
                  unoptimized
                  priority
                  draggable={false}
                  width={80}
                  height={80}
                  src='/blahajThink.webp'
                  alt='Group Swims'
                  className='h-10 w-10 select-none'
                />
                <TypographyH4>Smart Matching</TypographyH4>
                <TypographyMuted className='text-balance'>Our algorithm finds the perfect match based on color, size, and squishiness.</TypographyMuted>
              </div>
            </CardContent>
          </Card>
          <Card className='max-w-96'>
            <CardContent>
              <div className='flex flex-col items-center space-y-2 text-center'>
                <Image
                  unoptimized
                  priority
                  draggable={false}
                  width={80}
                  height={80}
                  src='/blahajHeart.webp'
                  alt='Group Swims'
                  className='h-10 w-10 select-none'
                />
                <TypographyH4>Exclusive Community</TypographyH4>
                <TypographyMuted className='text-balance'>Connect with fellow Blahaj lovers from around the world.</TypographyMuted>
              </div>
            </CardContent>
          </Card>
          <Card className='max-w-96'>
            <CardContent>
              <div className='flex flex-col items-center space-y-2 text-center'>
                <Image
                  unoptimized
                  priority
                  draggable={false}
                  width={80}
                  height={80}
                  src='/blahajHug.webp'
                  alt='Group Swims'
                  className='h-10 w-10 select-none'
                />
                <TypographyH4>Group Swims</TypographyH4>
                <TypographyMuted className='text-balance'>Organize group activities with other Blåhaj in your area.</TypographyMuted>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
