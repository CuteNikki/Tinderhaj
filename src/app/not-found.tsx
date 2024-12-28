import { Hero } from '@/features/not-found/components/hero';

import { notFoundData } from '@/constants/metadata';

export const metadata = notFoundData;

export default function NotFoundPage() {
  return (
    <main>
      <Hero />
    </main>
  );
}
