import type { Metadata } from 'next';

import { notFoundMetadata } from '@/constants/metadata';

import { NotFoundPage } from '@/components/common/not-found';

export const metadata: Metadata = notFoundMetadata;

export default function NotFound() {
  return <NotFoundPage />;
}
