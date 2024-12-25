import Image from 'next/image';
import Link from 'next/link';

import { HomeIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { links } from '@/constants/links';
import { construction } from '@/constants/texts/construction';

export function Hero() {
  return (
    <section className='py-16 md:py-32'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center justify-center gap-16 md:flex-row'>
          <div className='flex flex-col items-center text-center md:items-start md:text-start'>
            <span className='mb-2 text-3xl font-bold'>{construction.title}</span>
            <p className='mb-4 text-balance text-muted-foreground'>{construction.description}</p>
            <Button size='lg' className='w-fit' asChild>
              <Link href={links.home}>
                {construction.action}
                <HomeIcon />
              </Link>
            </Button>
          </div>
          <div className='w-fit'>
            <Image src={construction.image.src} alt={construction.image.alt} unoptimized width={400} height={400} className='mx-auto mb-4 rounded-lg' />
          </div>
        </div>
      </div>
    </section>
  );
}
