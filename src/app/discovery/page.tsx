import { SearchParams } from 'next/dist/server/request/search-params';
import { Suspense } from 'react';

import { discoveryMetadata } from '@/constants/metadata';

import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';
import { Discovery, DiscoverySkeleton } from '@/components/discovery/discovery';

export const metadata = discoveryMetadata;

export default function DiscoveryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        <Suspense fallback={<DiscoverySkeleton />}>
          <Discovery searchParams={searchParams} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
