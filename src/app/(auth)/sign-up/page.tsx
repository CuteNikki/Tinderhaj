import { getCurrentUser } from '@/lib/actions';

import { SignUpForm } from '@/components/auth/sign-up-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SignUp() {
  await getCurrentUser({ redirectIfFound: true });

  return (
    <div className='container mx-auto max-w-[750px] p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
