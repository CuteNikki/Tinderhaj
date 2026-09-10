import { DiscoveryFilter } from '@/components/discovery/filter';
import { DiscoveryPaginationSkeleton } from '@/components/discovery/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function DiscoveryHeroSkeleton() {
  return (
    <section className='relative isolate overflow-hidden pt-28 pb-12 md:pt-32 md:pb-16'>
      <div className='pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[6rem_6rem] opacity-20 dark:opacity-25' />
      <div className='bg-primary/10 pointer-events-none absolute -top-16 -right-16 z-0 size-64 rounded-full blur-3xl lg:-top-8 lg:-right-8 lg:size-96' />
      <div className='bg-secondary/60 pointer-events-none absolute -bottom-24 -left-16 z-0 size-72 rounded-full blur-3xl lg:-bottom-12 lg:-left-8 lg:size-96' />
      <div className='relative z-10 container mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8'>
        <div className='max-w-3xl'>
          <Skeleton className='h-12 w-40 rounded-full' />
          <Skeleton className='mt-6 h-16 w-full max-w-2xl sm:h-24' />
          <div className='mt-6 space-y-2'>
            <Skeleton className='h-5 w-full max-w-xl' />
            <Skeleton className='h-5 w-4/5 max-w-lg' />
          </div>
        </div>
        <div className='relative mx-auto hidden aspect-square w-full max-w-xs items-center justify-center lg:flex'>
          <div className='border-primary/20 absolute inset-8 rounded-full border' />
          <div className='border-primary/15 absolute inset-0 rounded-full border border-dashed' />
          <Skeleton className='relative z-10 size-56 rounded-full' />
        </div>
      </div>
    </section>
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
            <DiscoveryFilter disabled page={1} query='' take={6} />
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
