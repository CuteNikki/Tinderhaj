'use client';

import { useEffect, useState } from 'react';

import { Loader2Icon, RotateCwIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function DiscoveryError() {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    toast.error('We could not load the discovery page. Please try again.', {
      duration: 5000,
      position: 'top-center',
    });
  }, []);

  function handleRetry() {
    setIsRetrying(true);
    window.location.reload();
  }

  return (
    <div className='bg-background flex flex-1 items-center justify-center px-6 py-40'>
      <div className='flex max-w-md flex-col items-center gap-4 text-center'>
        <h1 className='text-2xl font-bold'>Discovery is temporarily unavailable</h1>
        <p className='text-muted-foreground text-sm'>The profiles could not be loaded right now. Try again in a moment.</p>
        <Button type='button' onClick={handleRetry} disabled={isRetrying}>
          {isRetrying ? (
            <>
              <Loader2Icon className='shrink-0 animate-spin' aria-hidden='true' />
              Retrying...
            </>
          ) : (
            <>
              <RotateCwIcon className='shrink-0' aria-hidden='true' />
              Retry
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
