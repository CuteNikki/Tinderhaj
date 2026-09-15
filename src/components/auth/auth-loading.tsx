import { LoaderCircleIcon } from 'lucide-react';

export function AuthLoading() {
  return (
    <div className='bg-background flex flex-1 items-center justify-center px-4 py-28'>
      <LoaderCircleIcon className='text-primary size-8 shrink-0 animate-spin' aria-hidden='true' />
      <span className='sr-only'>Loading...</span>
    </div>
  );
}
