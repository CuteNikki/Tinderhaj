import { SearchParams } from 'next/dist/server/request/search-params';
import { z } from 'zod';

import { QUERIES } from '@/lib/queries';

import { TypographyLead, TypographyMuted, TypographyP, TypographySmall } from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { UserFilter } from '@/components/user-filter';
import { UserDiscoveryPagination, UserDiscoveryPaginationSkeleton } from '@/components/user-pagination';
import { redirect } from 'next/navigation';

const searchParamsSchema = z.object({
  query: z.preprocess((val) => val, z.string().optional().default('')),
  page: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(1)),
  take: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(5)),
});

export async function UserDiscovery({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { page, take, query } = searchParamsSchema.parse(await searchParams);
  const { users, count } = await (query?.length ? QUERIES.filterUsers(query, page, take) : QUERIES.getUsers(page, take));

  const totalPages = Math.ceil(count / take);

  if (totalPages !== 0 && page > totalPages) {
    redirect(`?query=${query}&page=${totalPages < 1 ? 1 : totalPages}&take=${take}`);
  }

  return (
    <>
      <UserFilter take={take} query={query} />
      <ul className='flex flex-col gap-2'>
        {users.length ? (
          users.map((user, index) => (
            <li className='flex flex-col' key={`user-${index}-${user.id}`}>
              <div className='flex items-start gap-2'>
                <Avatar className='h-12 w-12'>
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{user.display_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <div className='flex flex-row items-center gap-2'>
                    <TypographyP>{user.display_name}</TypographyP>
                    <TypographyMuted>@{user.username}</TypographyMuted>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <TypographyMuted>{user.pronouns}</TypographyMuted>
                    <TypographyMuted>{new Date().getFullYear() - user.birthday.getFullYear()} y/o</TypographyMuted>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <TypographyLead>No search result!</TypographyLead>
        )}
      </ul>
      <UserDiscoveryPagination take={take} count={count} page={page} query={query} totalPages={totalPages} />
    </>
  );
}

export async function UserDiscoverySkeleton({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { take, query } = searchParamsSchema.parse(await searchParams);

  return (
    <>
      <UserFilter take={take} query={query} disabled />
      <ul className='flex flex-col gap-2'>
        {Array.from({ length: take }).map((_, index) => (
          <li className='flex flex-col' key={`skeleton-user-${index}`}>
            <div className='flex items-start gap-2'>
              <Skeleton className='h-12 w-12 rounded-full' style={{ animationDelay: index * -200 + 'ms' }} />
              <div className='flex flex-col'>
                <div className='flex flex-row items-center gap-2'>
                  <Skeleton className='h-7 w-16' style={{ animationDelay: index * -200 + 'ms' }} />
                  <Skeleton className='h-5 w-12' style={{ animationDelay: index * -300 + 'ms' }} />
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <Skeleton className='h-5 w-14' style={{ animationDelay: index * -300 + 'ms' }} />
                  <Skeleton className='h-5 w-12' style={{ animationDelay: index * -400 + 'ms' }} />
                </div>
              </div>
            </div>
          </li>
          // <li className='flex items-center gap-2' key={`user-${index}`}>
          //   <Skeleton className='h-8 w-8 rounded-full' style={{ animationDelay: index * -200 + 'ms' }} />
          //   <Skeleton className='h-6 w-24' style={{ animationDelay: index * -200 + 'ms' }} />
          //   <Skeleton className='h-5 w-12' style={{ animationDelay: index * -100 + 'ms' }} />
          // </li>
        ))}
      </ul>
      <div className='flex flex-col items-center gap-4 p-4 text-center text-balance'>
        <TypographySmall className='flex items-center'>Showing {take} of ? users (page ? of ?)</TypographySmall>
        <UserDiscoveryPaginationSkeleton />
      </div>
    </>
  );
}
