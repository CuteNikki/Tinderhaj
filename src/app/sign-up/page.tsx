import { SignUp } from '@/features/sign-up/components/section';

import { signUpData } from '@/constants/metadata';

export const metadata = signUpData;

export default function SignUpPage() {
  return (
    <main>
      <SignUp />
    </main>
  );
}
