import { PageLoading } from '@/components/common/page-loading';
import { ProfileGridSkeleton } from '@/components/common/skeletons';

export default function Loading() {
  return (
    <PageLoading eyebrow='Tinderhaj' title='Sharks' placeholder='Joined September 2026'>
      <ProfileGridSkeleton />
    </PageLoading>
  );
}
