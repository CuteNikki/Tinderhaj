import Link from 'next/link';

import { SearchXIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function DiscoveryNoResults() {
  return (
    <div id='discovery-no-results' className='py-16'>
      <div className='mx-auto flex max-w-xl flex-col items-center text-center'>
        <div className='bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full'>
          <SearchXIcon className='h-7 w-7' />
        </div>
        <h2 className='mt-6 text-3xl font-black tracking-tight sm:text-4xl'>No matches surfaced.</h2>
        <p className='text-muted-foreground mt-4 text-sm leading-relaxed text-pretty'>
          We couldn&apos;t find a profile for that search. A wider tide usually brings more Blåhaj back into view.
        </p>
        <Button className='mt-7 rounded-full px-6' asChild>
          <Link href='/discovery#top'>Reset discovery</Link>
        </Button>
      </div>
    </div>
  );
}
