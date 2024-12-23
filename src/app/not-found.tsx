import { NotFound } from '@/components/pages/not-found';

import { allMetadata } from '@/constants/texts';

export const metadata = allMetadata.notFound;

export default function Page() {
  return <NotFound />;
}
