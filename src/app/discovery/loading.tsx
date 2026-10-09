import { Eyebrow } from '@/components/common/heading';
import { ProfileCardSkeleton } from '@/components/common/skeletons';
import { DiscoveryPaginationSkeleton } from '@/components/discovery/pagination';
import { Skeleton } from '@/components/ui/skeleton';

/** The search bar while it loads, each part the size and shape of the real one (see DiscoveryFilter). */
function DiscoveryFilterSkeleton() {
  return (
    <div className='border-foreground/10 bg-background/85 rounded-3xl border p-3 shadow-lg backdrop-blur-md sm:rounded-full'>
      <div className='xs:flex-row xs:items-center flex flex-col gap-1'>
        <Skeleton className='xs:rounded-tr-sm xs:rounded-br-sm xs:rounded-bl-2xl xs:flex-1 h-9 w-full min-w-0 rounded-2xl rounded-br-sm rounded-bl-sm' />
        <Skeleton className='xs:w-24 h-9 w-full rounded-sm' />
        <Skeleton className='xs:rounded-tl-sm xs:rounded-tr-2xl xs:rounded-bl-sm xs:w-24.25 h-9 w-full rounded-2xl rounded-tl-sm rounded-tr-sm' />
      </div>
    </div>
  );
}

/** Discovery's profiles while they load; the hero above them is already there (see layout). */
export default function DiscoveryLoading() {
  return (
    <section className='bg-card text-card-foreground w-full flex-1 px-4 pb-8 sm:px-5 lg:px-8' aria-busy='true' aria-label='Loading'>
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
