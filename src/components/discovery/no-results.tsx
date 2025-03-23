import { TypographyH2, TypographyMuted } from '@/components/typography';

export function NoResults() {
  return (
    <section id='no-results' className='from-background to-muted w-full bg-gradient-to-br py-12 md:py-24'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <TypographyH2>No Results Found</TypographyH2>
            <TypographyMuted className='text-pretty'>
              {"We couldn't find any results for your search query."}
              <br />
              Try broadening your search or check back later.
            </TypographyMuted>
          </div>
        </div>
      </div>
    </section>
  );
}
