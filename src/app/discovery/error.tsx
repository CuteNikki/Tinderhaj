'use client';

import { useEffect } from 'react';

import { RotateCwIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function DiscoveryError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    toast.error('We could not load the discovery page. Please try again.', {
      duration: 5000,
      position: 'top-center',
    });
  }, []);

  return (
    <div className='bg-background flex flex-1 items-center justify-center px-6 py-40'>
      <div className='flex max-w-md flex-col items-center gap-4 text-center'>
        <h1 className='text-2xl font-bold'>Discovery is temporarily unavailable</h1>
        <p className='text-muted-foreground text-sm'>The profiles could not be loaded right now. Try again in a moment.</p>
        <Button type='button' onClick={reset}>
          <RotateCwIcon aria-hidden='true' />
          Try again
        </Button>
      </div>
    </div>
  );
}
