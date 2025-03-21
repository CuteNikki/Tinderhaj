import { TypographySmall } from '@/components/typography';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export function UserDiscoveryPagination({
  take,
  count,
  page,
  query,
  totalPages,
}: {
  take: number;
  count: number;
  page: number;
  query: string;
  totalPages: number;
}) {
  return (
    <div className='flex flex-col items-center gap-4 p-4 text-center text-balance'>
      <TypographySmall>
        Showing {count < take ? count : take} of {count} users (page {page} of {totalPages})
      </TypographySmall>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={page === 1 ? '#' : `?query=${query}&page=${page - 1}&take=${take}`} />
          </PaginationItem>
          {totalPages > 2 && page === totalPages && (
            <PaginationItem>
              <PaginationLink href={`?query=${query}&page=${page - 2}&take=${take}`}>{page - 2}</PaginationLink>
            </PaginationItem>
          )}
          {page > 1 && (
            <PaginationItem>
              <PaginationLink href={`?query=${query}&page=${page - 1}&take=${take}`}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href={`?query=${query}&page=${page}&take=${take}`} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>
          {page < totalPages && (
            <PaginationItem>
              <PaginationLink href={`?query=${query}&page=${page + 1}&take=${take}`}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}
          {totalPages > 2 && page === 1 && (
            <PaginationItem>
              <PaginationLink href={`?query=${query}&page=3&take=${take}`}>3</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext href={page === totalPages ? '#' : `?query=${query}&page=${page + 1}&take=${take}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function UserDiscoveryPaginationSkeleton({ take }: { take: number }) {
  return (
    <div className='flex flex-col items-center gap-4 p-4 text-center text-balance'>
      <TypographySmall className='flex items-center gap-2'>Showing {take} of ? users (page ? of ?)</TypographySmall>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href='#' />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#'>?</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#' isActive>
              ?
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='#'>?</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href='#' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
