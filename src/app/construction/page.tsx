import { Hero } from '@/features/under-construction/components/hero';

import { constructionData } from '@/constants/metadata';

export const metadata = constructionData;

export default function Page() {
  return (
    <main>
      <Hero />
    </main>
  );
}
