import { SignInForm } from '@/features/sign-in/components/form';

export function SignIn() {
  return (
    <section className='py-32'>
      <div className='container mx-auto flex flex-col items-center px-4'>
        <SignInForm />
      </div>
    </section>
  );
}
