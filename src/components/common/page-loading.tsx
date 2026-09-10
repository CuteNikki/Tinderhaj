import { LoaderCircleIcon } from 'lucide-react';

export function PageLoading() {
  return (
    <div className='bg-background flex flex-1 items-center justify-center px-6 py-24'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <LoaderCircleIcon className='text-primary h-8 w-8 animate-spin' aria-hidden='true' />
        <p className='text-muted-foreground text-sm'>Loading...</p>
      </div>
    </div>
  );
}
