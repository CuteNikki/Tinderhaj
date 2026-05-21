export function DiscoveryNoResults() {
  return (
    <section id='discovery-no-results' className='from-background to-muted w-full bg-linear-to-b py-8 md:py-12'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2>No Results Found</h2>
            <p className='text-muted-foreground text-pretty'>
              We couldn&apos;t find any results for your search query.
              <br />
              Try broadening your search or check back later.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
