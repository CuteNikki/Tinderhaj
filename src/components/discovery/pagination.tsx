'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type MouseEvent } from 'react';

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const scrollToProfilesKey = 'discovery-scroll-to-profiles';

export function DiscoveryPagination({
  displayedUsers,
  totalUsers,
  totalPages,
  take,
  page,
  query,
}: {
  displayedUsers: number;
  totalPages: number;
  totalUsers: number;
  take: number;
  page: number;
  query: string;
}) {
  if (!totalUsers) {
    return null;
  }

  const router = useRouter();
  const pageHref = (targetPage: number) => `?q=${query}&p=${targetPage}&t=${take}`;
  const scrollToProfiles = () => document.getElementById('profiles')?.scrollIntoView();
  const navigateToPage = (targetPage: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (targetPage === page) {
      scrollToProfiles();
      return;
    }

    sessionStorage.setItem(scrollToProfilesKey, 'true');
    router.push(pageHref(targetPage), { scroll: false });
  };

  useEffect(() => {
    if (sessionStorage.getItem(scrollToProfilesKey) !== 'true') {
      return;
    }

    sessionStorage.removeItem(scrollToProfilesKey);
    scrollToProfiles();
  }, [page, query, take]);

  return (
    <div className='flex flex-col items-center gap-4 px-5 pt-8 text-center text-balance'>
      <p className='text-muted-foreground text-sm'>
        Showing {displayedUsers} of {totalUsers} users (page {page} of {totalPages})
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={pageHref(Math.max(page - 1, 1))} onClick={navigateToPage(Math.max(page - 1, 1))} />
          </PaginationItem>
          {totalPages > 2 && page === totalPages && (
            <PaginationItem>
              <PaginationLink href={pageHref(page - 2)} onClick={navigateToPage(page - 2)}>
                {page - 2}
              </PaginationLink>
            </PaginationItem>
          )}
          {page > 1 && (
            <PaginationItem>
              <PaginationLink href={pageHref(page - 1)} onClick={navigateToPage(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href={pageHref(page)} isActive onClick={navigateToPage(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
          {page < totalPages && (
            <PaginationItem>
              <PaginationLink href={pageHref(page + 1)} onClick={navigateToPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          {totalPages > 2 && page === 1 && (
            <PaginationItem>
              <PaginationLink href={pageHref(3)} onClick={navigateToPage(3)}>
                3
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext href={pageHref(Math.min(page + 1, totalPages))} onClick={navigateToPage(Math.min(page + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function DiscoveryPaginationSkeleton() {
  return (
    <div className='bg-muted flex flex-col items-center gap-4 p-4 text-center text-balance'>
      <p className='flex items-center gap-2 text-sm'>Showing ? of ? users (page ? of ?)</p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>?</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>?</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>?</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
