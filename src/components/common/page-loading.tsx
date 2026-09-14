import { LoaderCircleIcon } from 'lucide-react';

export function PageLoading() {
  return (
    <div className='bg-background flex flex-1 items-center justify-center px-6 py-40'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <LoaderCircleIcon className='text-primary size-8 shrink-0 animate-spin' aria-hidden='true' />
        <p className='text-muted-foreground text-sm'>Loading...</p>
      </div>
    </div>
  );
}
