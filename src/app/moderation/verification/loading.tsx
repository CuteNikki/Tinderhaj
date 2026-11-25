import { PageLoading } from '@/components/common/page-loading';
import {
  ProfileGridSkeleton,
  TabsSkeleton,
} from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <PageLoading eyebrow='Moderation' title='Verification'>
      <TabsSkeleton count={2} className='mb-6' />
      {/* The Shark of the Week row, as tall as its Skip button */}
      <div className='mb-6 flex min-h-8 items-center gap-3'>
        <Skeleton className='size-4 shrink-0 rounded-full' />
        <Skeleton className='h-4 w-64 max-w-full' />
      </div>
      <ProfileGridSkeleton ending='actions' />
    </PageLoading>
  );
}
