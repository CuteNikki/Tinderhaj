import { PageLoading } from '@/components/common/page-loading';
import { ButtonSkeleton, ProfileGridSkeleton } from '@/components/common/skeletons';

export default function Loading() {
  return (
    <PageLoading eyebrow='Your sharks' title='Profiles' below={<ButtonSkeleton className='mt-4'>New profile</ButtonSkeleton>}>
      <ProfileGridSkeleton ending='actions' />
    </PageLoading>
  );
}
