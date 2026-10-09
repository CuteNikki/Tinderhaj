import { PageLoading } from '@/components/common/page-loading';
import { ListSkeleton } from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <PageLoading
      eyebrow='Moderation'
      title='Users'
      placeholder='Open someone to see their profiles, or ban them. Only admins change roles and manage accounts.'
    >
      <div className='mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className='h-20 rounded-2xl' />
        ))}
      </div>
      <div className='mb-4 flex gap-2'>
        <Skeleton className='h-9 flex-1 rounded-xl' />
        <Skeleton className='h-9 w-20 rounded-full' />
      </div>
      <ListSkeleton rows={6} />
    </PageLoading>
  );
}
