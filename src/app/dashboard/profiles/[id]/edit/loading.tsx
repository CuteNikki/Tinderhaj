import { BackLink } from '@/components/common/heading';
import { PageLoading } from '@/components/common/page-loading';
import { ProfileFormSkeleton } from '@/components/profiles/profile-form-skeleton';

export default function Loading() {
  return (
    <PageLoading
      eyebrow='Your sharks'
      title='Profile'
      description='Changes are saved as a draft, for you to send for review again.'
      above={<BackLink href='/dashboard/profiles'>Profiles</BackLink>}
    >
      <ProfileFormSkeleton editing />
    </PageLoading>
  );
}
