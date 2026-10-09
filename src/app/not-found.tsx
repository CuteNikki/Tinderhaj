import type { Metadata } from 'next';

import { notFoundMetadata } from '@/constants/metadata';

import { NotFoundPage } from '@/components/common/not-found';
import { FreshSharks } from '@/components/sections/fresh-sharks';
import { WhereToNext } from '@/components/sections/where-to-next';

export const metadata: Metadata = notFoundMetadata;

export default function NotFound() {
  return (
    <>
      <NotFoundPage />
      <WhereToNext tone='muted' />
      <FreshSharks tone='card' />
    </>
  );
}
