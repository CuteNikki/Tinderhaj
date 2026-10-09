import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';

type PageLoadingProps = {
  eyebrow: string;
  title: string;
  /** The line under the title, when the page has one that's always the same. */
  description?: string;
  /** About as long as the line under the title, when it's the page's own (a date, say): shown as a placeholder. */
  placeholder?: string;
  /** Placeholders for what the page's own header has above its label, and below its title, so it's as tall. */
  above?: React.ReactNode;
  below?: React.ReactNode;
  /** What's coming, in placeholders shaped like it (see skeletons). */
  children: React.ReactNode;
};

/**
 * A page while it loads: its header, as tall as the page's own, so the water
 * across it stays put (see PageWater), and placeholders shaped like the rest.
 */
export function PageLoading({ eyebrow, title, description, placeholder, above, below, children }: PageLoadingProps) {
  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        {/* Shown only if the page takes a while, so it usually comes in once, with the page, rather than showing and coming in again */}
        <div id='page-header' className='animate-late mb-24'>
          {above}
          <Eyebrow>{eyebrow}</Eyebrow>
          <PageTitle>{title}</PageTitle>
          {description && <PageNote>{description}</PageNote>}
          {placeholder && (
            <p aria-hidden className='mt-2 text-sm'>
              <span className='bg-foreground/10 animate-breathe rounded-md text-transparent [text-shadow:none]'>{placeholder}</span>
            </p>
          )}
          {below}
        </div>
        <div aria-busy='true' aria-label='Loading'>
          {children}
        </div>
      </div>
    </div>
  );
}
