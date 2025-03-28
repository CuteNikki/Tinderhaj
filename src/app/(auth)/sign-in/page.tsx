import { getCurrentUser } from '@/lib/actions';

import { SignInForm } from '@/components/auth/sign-in-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SignIn({ searchParams }: { searchParams: Promise<{ oauthError?: string }> }) {
  const { oauthError } = await searchParams;

  if (!oauthError) {
    await getCurrentUser({ redirectIfFound: true });
  }

  return (
    <div className='container mx-auto max-w-[750px] p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          {oauthError && <CardDescription className='text-destructive'>{oauthError}</CardDescription>}
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
