import { TypographySmall } from '@/components/typography';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export function ProfilePagination({
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
  return (
    <div className='bg-muted flex flex-col items-center gap-4 p-4 text-center text-balance'>
      <TypographySmall>
        Showing {displayedUsers} of {totalUsers} users (page {page} of {totalPages})
      </TypographySmall>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={page === 1 ? '#top' : `?q=${query}&p=${page - 1}&t=${take}`} />
          </PaginationItem>
          {totalPages > 2 && page === totalPages && (
            <PaginationItem>
              <PaginationLink href={`?q=${query}&p=${page - 2}&t=${take}`}>{page - 2}</PaginationLink>
            </PaginationItem>
          )}
          {page > 1 && (
            <PaginationItem>
              <PaginationLink href={`?q=${query}&p=${page - 1}&t=${take}`}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href={`?q=${query}&p=${page}&t=${take}`} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>
          {page < totalPages && (
            <PaginationItem>
              <PaginationLink href={`?q=${query}&p=${page + 1}&t=${take}`}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}
          {totalPages > 2 && page === 1 && (
            <PaginationItem>
              <PaginationLink href={`?q=${query}&p=3&t=${take}`}>3</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext href={page === totalPages ? '#top' : `?q=${query}&p=${page + 1}&t=${take}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function ProfilePaginationSkeleton() {
  return (
    <div className='bg-muted flex flex-col items-center gap-4 p-4 text-center text-balance'>
      <TypographySmall className='flex items-center gap-2'>Showing ? of ? users (page ? of ?)</TypographySmall>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href='#top' />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#top'>?</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#top' isActive>
              ?
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#top'>?</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href='#top' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
