import { PageLoading } from '@/components/common/page-loading';
import { ListSkeleton, TabsSkeleton } from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

/** Hearts while it loads: rows shaped like matches, the tab it usually opens on, each with the way to reach them under it. */
export default function Loading() {
  return (
    <PageLoading eyebrow='Your sharks' title='Hearts' description='Two sharks hearting each other is a match.'>
      <TabsSkeleton count={3} compact className='mb-4' />
      <ListSkeleton>
        <div className='p-4'>
          <div className='flex items-center gap-3'>
            <Skeleton className='size-12 shrink-0 rounded-full' />
            <div className='min-w-0 flex-1 space-y-2'>
              <Skeleton className='h-4 w-40 max-w-full' />
              <Skeleton className='h-3 w-56 max-w-full' />
            </div>
            {/* The Match badge: its heart and label there, unseen, so it's as wide */}
            <Skeleton
              aria-hidden
              className='inline-flex h-5 shrink-0 items-center gap-1 rounded-full border border-transparent px-2 text-xs font-medium text-transparent text-shadow-none'
            >
              <span className='size-3' />
              Match
            </Skeleton>
          </div>
          <div className='mt-3 flex h-5 items-center gap-2 pl-15'>
            <Skeleton className='size-4 shrink-0 rounded-full' />
            <Skeleton className='h-4 w-40 max-w-full' />
          </div>
        </div>
      </ListSkeleton>
    </PageLoading>
  );
}
