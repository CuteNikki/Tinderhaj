import { PageLoading } from '@/components/common/page-loading';
import { ProfileGridSkeleton, TabsSkeleton } from '@/components/common/skeletons';

export default function Loading() {
  return (
    <PageLoading eyebrow='Moderation' title='Verification'>
      <TabsSkeleton count={2} className='mb-6' />
      <ProfileGridSkeleton ending='actions' />
    </PageLoading>
  );
}
