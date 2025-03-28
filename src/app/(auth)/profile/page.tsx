import { getCurrentUser } from '@/lib/actions';

import { ProfileForm } from '@/components/auth/profile-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProfilePage() {
  const session = await getCurrentUser({ includeProfile: true, redirectIfNotFound: true });

  return (
    <div className='container mx-auto flex max-w-[750px] flex-col gap-8 p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={session.Profile} />
        </CardContent>
      </Card>
      <pre className='truncate whitespace-pre'>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
