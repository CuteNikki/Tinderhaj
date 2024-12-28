import { Features } from '@/features/home/components/features';
import { Hero } from '@/features/home/components/hero';
import { SignUp } from '@/features/home/components/sign-up';

import { homeData } from '@/constants/metadata';

export const metadata = homeData;

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <SignUp />
    </main>
  );
}
