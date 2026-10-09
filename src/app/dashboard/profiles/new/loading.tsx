import { BackLink } from '@/components/common/heading';
import { PageLoading } from '@/components/common/page-loading';
import { ProfileFormSkeleton } from '@/components/profiles/profile-form-skeleton';

export default function Loading() {
  return (
    <PageLoading
      eyebrow='Your sharks'
      title='New profile'
      description='Fill in as much or as little as you like. You can change it all later.'
      above={<BackLink href='/dashboard/profiles'>Profiles</BackLink>}
    >
      <ProfileFormSkeleton />
    </PageLoading>
  );
}
