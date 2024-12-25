import { Home } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { links } from '@/constants/links';
import { construction } from '@/constants/texts/construction';

export function Hero() {
  return (
    <section className='py-32'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='mb-2 text-3xl font-bold'>{construction.title}</h2>
        <p className='mb-4 text-balance text-muted-foreground'>{construction.description}</p>
        <Button size='lg' asChild>
          <Link href={links.home}>
            {construction.action}
            <Home />
          </Link>
        </Button>
      </div>
    </section>
  );
}
