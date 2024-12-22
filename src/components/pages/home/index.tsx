import { Features } from '@/components/pages/home/features';
import { Hero } from '@/components/pages/home/hero';
import { SignUp } from '@/components/pages/home/sign-up';

export function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <SignUp />
    </main>
  );
}
