import { DiscoveryPaginationSkeleton } from '@/components/discovery/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function DiscoveryHeroSkeleton() {
  return (
    <section className='relative isolate overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16'>
      <div className='pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-25' />
      <div className='bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 z-0 size-112 -translate-1/2 rounded-full blur-3xl' />
      <div className='relative z-10 container mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8'>
        <div className='max-w-3xl'>
          <Skeleton className='h-12 w-40 rounded-full' />
          {/* Real copy (with a skeleton fill) so wrapping matches the loaded heading at every breakpoint */}
          <h1 aria-hidden className='mt-6 max-w-3xl text-5xl leading-none font-black tracking-tight sm:text-7xl'>
            <span className='bg-muted animate-pulse rounded-md [box-decoration-break:clone] text-transparent [-webkit-box-decoration-break:clone]'>
              Browse the soft side of the sea.
            </span>
          </h1>
          <p aria-hidden className='text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg'>
            <span className='bg-muted animate-pulse rounded-md [box-decoration-break:clone] text-transparent [-webkit-box-decoration-break:clone]'>
              Search by name, location, pronouns, interests, or anything else that makes a profile feel like your kind of tide.
            </span>
          </p>
        </div>
        <div className='relative mx-auto hidden aspect-square w-full max-w-xs items-center justify-center lg:flex'>
          <div className='border-primary/20 absolute inset-8 rounded-full border border-dashed' />
          <div className='border-primary/15 absolute inset-0 rounded-full border' />
          <Skeleton className='relative z-10 size-56 rounded-full' />
        </div>
      </div>
    </section>
  );
}

function DiscoveryFilterSkeleton() {
  return (
    <div className='border-foreground/10 bg-background/85 rounded-3xl border p-3 shadow-lg backdrop-blur-md sm:rounded-full'>
      <div className='xs:flex-row xs:items-center flex flex-col gap-1'>
        <div className='relative min-w-0 flex-1'>
          <Skeleton className='xs:rounded-tr-sm xs:rounded-br-sm xs:rounded-bl-2xl h-9 w-full rounded-2xl rounded-br-sm rounded-bl-sm' />
        </div>
        <Skeleton className='bg-background xs:h-9 xs:w-24 xs:rounded-tl-sm xs:rounded-tr-sm xs:rounded-br-sm xs:rounded-bl-sm h-9 w-full rounded-sm' />
        <Skeleton className='xs:rounded-tl-sm xs:rounded-tr-2xl xs:rounded-bl-sm h-9 w-full rounded-2xl rounded-tl-sm rounded-tr-sm sm:w-28' />
      </div>
    </div>
  );
}

function DiscoveryProfileSkeleton() {
  return (
    <Card className='border-foreground/10 bg-background h-full w-full overflow-hidden pt-0 shadow-sm'>
      <div className='relative aspect-5/2 overflow-hidden'>
        <Skeleton className='h-full w-full rounded-none' />
        <div className='from-background/70 absolute inset-0 bg-linear-to-t to-transparent' />
      </div>

      <CardContent className='-mt-8 px-4 pb-5 sm:px-6'>
        <div className='relative flex items-start gap-4'>
          <div className='relative shrink-0'>
            <Skeleton className='border-background bg-muted h-18 w-18 overflow-hidden rounded-full border-4 shadow-md' />
          </div>
          <div className='min-w-0 flex-1 pt-4'>
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
              <Skeleton className='h-6 w-36' />
              <Skeleton className='h-4 w-14' />
            </div>
            <Skeleton className='mt-2 h-4 w-24' />
          </div>
        </div>

        <div className='mt-5 flex flex-wrap items-center gap-x-4 gap-y-2'>
          <span className='flex items-center gap-1.5'>
            <Skeleton className='h-3.5 w-3.5 rounded-full' />
            <Skeleton className='h-4 w-20' />
          </span>
          <span className='flex items-center gap-1.5'>
            <Skeleton className='h-3.5 w-3.5 rounded-full' />
            <Skeleton className='h-4 w-24' />
          </span>
          <span className='flex items-center gap-1.5'>
            <Skeleton className='h-3.5 w-3.5 rounded-full' />
            <Skeleton className='h-4 w-16' />
          </span>
        </div>

        <div className='mt-4 space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </div>

        <div className='flex flex-wrap gap-1.5 pt-4'>
          <Skeleton className='h-6 w-16 rounded-full' />
          <Skeleton className='h-6 w-20 rounded-full' />
          <Skeleton className='h-6 w-14 rounded-full' />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DiscoveryLoading() {
  return (
    <div className='bg-background flex flex-1 flex-col'>
      <DiscoveryHeroSkeleton />

      <section className='bg-card text-card-foreground w-full flex-1 pb-8'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-5 lg:px-8'>
          <div className='-mt-8 mb-4'>
            <DiscoveryFilterSkeleton />
          </div>
          <div id='profiles' className='flex scroll-m-40 flex-col justify-between gap-2 py-6 md:flex-row md:items-center'>
            <Skeleton className='h-4 w-40' />
          </div>
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {Array.from({ length: 6 }, (_, index) => (
              <DiscoveryProfileSkeleton key={`discovery-profile-skeleton-${index}`} />
            ))}
          </div>
          <DiscoveryPaginationSkeleton />
        </div>
      </section>
    </div>
  );
}
