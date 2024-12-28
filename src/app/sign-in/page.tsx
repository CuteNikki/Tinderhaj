import { SignIn } from '@/features/sign-in/components/section';

import { signInData } from '@/constants/metadata';

export const metadata = signInData;

export default function SignInPage() {
  return (
    <main>
      <SignIn />
    </main>
  );
}
