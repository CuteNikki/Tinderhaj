import { PageLoading } from '@/components/common/page-loading';
import { ButtonSkeleton, GhostText, TabsSkeleton } from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

/** The reports page while it loads: its tabs, and rows shaped like open reports. */
export default function Loading() {
  return (
    <PageLoading eyebrow='Moderation' title='Reports'>
      <TabsSkeleton count={2} className='mb-6' />
      <div className='border-foreground/10 bg-card divide-foreground/10 divide-y rounded-2xl border shadow-sm'>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className='flex flex-col gap-4 p-4 sm:flex-row sm:items-start'>
            <div className='flex min-w-0 flex-1 items-start gap-3'>
              <Skeleton className='size-12 shrink-0 rounded-full' />
              <div className='min-w-0 flex-1'>
                <div className='flex h-6 items-center gap-2'>
                  <Skeleton className='h-5 w-28' />
                  <Skeleton className='h-5 w-32 rounded-full' />
                </div>
                {/* In words, so it wraps where the real one does on narrow screens */}
                <GhostText className='text-xs'>Owned by @someone · reported by @someone 2 hours ago</GhostText>
                <GhostText className='mt-3'>What they said is wrong with it, in a line.</GhostText>
              </div>
            </div>
            <div className='flex shrink-0 gap-2'>
              <ButtonSkeleton size='sm'>Dealt with</ButtonSkeleton>
              <ButtonSkeleton size='sm'>Nothing wrong</ButtonSkeleton>
            </div>
          </div>
        ))}
      </div>
    </PageLoading>
  );
}
