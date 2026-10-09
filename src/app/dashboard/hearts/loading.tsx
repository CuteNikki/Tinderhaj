import { PageLoading } from '@/components/common/page-loading';
import { ListSkeleton, TabsSkeleton } from '@/components/common/skeletons';

export default function Loading() {
  return (
    <PageLoading eyebrow='Your sharks' title='Hearts' description='Two sharks hearting each other is a match.'>
      <TabsSkeleton count={3} className='mb-4' />
      <ListSkeleton avatar />
    </PageLoading>
  );
}
