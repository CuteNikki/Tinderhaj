import { Eyebrow } from '@/components/common/heading';
import { ProfileCardSkeleton } from '@/components/common/skeletons';
import { DiscoveryPaginationSkeleton } from '@/components/discovery/pagination';
import { Skeleton } from '@/components/ui/skeleton';

/** The search bar while it loads, each part the size and shape of the real one (see DiscoveryFilter). */
function DiscoveryFilterSkeleton() {
  return (
    <div className='rounded-3xl border border-foreground/10 bg-background/85 p-3 shadow-lg backdrop-blur-md sm:rounded-full'>
      <div className='flex flex-col gap-1 xs:flex-row xs:items-center'>
        <Skeleton className='h-9 w-full min-w-0 rounded-2xl rounded-br-sm rounded-bl-sm xs:flex-1 xs:rounded-tr-sm xs:rounded-br-sm xs:rounded-bl-2xl' />
        <Skeleton className='h-9 w-full rounded-sm xs:w-24' />
        <Skeleton className='h-9 w-full rounded-2xl rounded-tl-sm rounded-tr-sm xs:w-24.25 xs:rounded-tl-sm xs:rounded-tr-2xl xs:rounded-bl-sm' />
      </div>
    </div>
  );
}

/** Discovery's profiles while they load; the hero above them is already there (see layout). */
export default function DiscoveryLoading() {
  return (
    <section
      className='w-full flex-1 px-4 pb-8 text-card-foreground sm:px-5 lg:px-8'
      aria-busy='true'
      aria-label='Loading'
    >
      <div className='container mx-auto max-w-7xl'>
        <div className='-mt-8 mb-4'>
          <DiscoveryFilterSkeleton />
        </div>
        <div className='py-6'>
          <Eyebrow as='h2' className='mb-0'>
            Fresh possibilities
          </Eyebrow>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }, (_, index) => (
            <ProfileCardSkeleton key={index} />
          ))}
        </div>
        <DiscoveryPaginationSkeleton />
      </div>
    </section>
  );
}
