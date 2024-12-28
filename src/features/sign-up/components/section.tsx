import { signUp } from '@/constants/texts/sign-up';

export function SignUp() {
  return (
    <section className='py-32'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='mb-2 text-3xl font-bold'>{signUp.title}</h2>
        <p className='mb-4 text-balance text-muted-foreground'>{signUp.description}</p>
      </div>
    </section>
  );
}
