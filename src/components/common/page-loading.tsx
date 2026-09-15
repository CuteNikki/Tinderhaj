import { LoaderCircleIcon } from 'lucide-react';

type PageLoadingProps = {
  eyebrow: string;
  title: string;
};

export function PageLoading({ eyebrow, title }: PageLoadingProps) {
  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <div className='mb-8'>
          <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>{eyebrow}</p>
          <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>{title}</h1>
        </div>
        <div className='flex min-h-80 items-center justify-center py-16'>
          <div className='flex flex-col items-center gap-3 text-center'>
            <LoaderCircleIcon className='text-primary size-8 shrink-0 animate-spin' aria-hidden='true' />
            <p className='text-muted-foreground text-sm'>Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
