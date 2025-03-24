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
            <TypographyMuted className='text-pretty'>Discover what makes Tinderhaj the premier dating platform for plush sharks everywhere.</TypographyMuted>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl items-center gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardContent>
              <div className='flex flex-col items-center space-y-2 text-center'>
                <Image unoptimized priority src='/blahajThink.webp' alt='Group Swims' className='h-10 w-10' width={80} height={80} />
                <TypographyH4>Smart Matching</TypographyH4>
                <TypographyMuted className='text-pretty'>Our algorithm finds the perfect match based on color, size, and squishiness.</TypographyMuted>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className='flex flex-col items-center space-y-2 text-center'>
                <Image unoptimized priority src='/blahajHeart.webp' alt='Group Swims' className='h-10 w-10' width={80} height={80} />
                <TypographyH4>Exclusive Community</TypographyH4>
                <TypographyMuted className='text-pretty'>Connect with fellow Blahaj lovers from around the world.</TypographyMuted>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className='flex flex-col items-center space-y-2 text-center'>
                <Image unoptimized priority src='/blahajHug.webp' alt='Group Swims' className='h-10 w-10' width={80} height={80} />
                <TypographyH4>Group Swims</TypographyH4>
                <TypographyMuted className='text-pretty'>Organize group activities with other Blahajs in your area.</TypographyMuted>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
