import { LoaderCircleIcon } from 'lucide-react';

type PageLoadingProps = {
  eyebrow: string;
  title: string;
  /** The line under the title, when the page has one that's always the same. */
  description?: string;
  /** About as long as the line under the title, when it's the page's own (a date, say): shown as a placeholder. */
  placeholder?: string;
};

/** A page's header while the rest comes in, as tall as the page's own, so the water across it stays put (see PageWater). */
export function PageLoading({ eyebrow, title, description, placeholder }: PageLoadingProps) {
  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        {/* Shown only if the page takes a while, so it usually comes in once, with the page, rather than showing and coming in again */}
        <div id='page-header' className='animate-late mb-24'>
          <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>{eyebrow}</p>
          <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>{title}</h1>
          {description && <p className='text-muted-foreground mt-2 text-sm text-pretty'>{description}</p>}
          {placeholder && (
            <p aria-hidden className='mt-2 text-sm'>
              <span className='bg-muted animate-pulse rounded-md text-transparent'>{placeholder}</span>
            </p>
          )}
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
