import { BanIcon, ChevronRightIcon, SearchIcon, UsersRoundIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { usersMetadata } from '@/constants/metadata';
import { isBanned } from '@/lib/bans';
import { QUERIES } from '@/lib/queries';
import { isAdmin, isRole, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, type AccountRole } from '@/lib/roles';
import { isModerator, requireUser } from '@/lib/session';
import { CONTENT_DELAY } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { EmptyState } from '@/components/common/empty-state';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = usersMetadata;

const PAGE_SIZE = 20;

type Show = AccountRole | 'BANNED' | null;

/** The users page with these filters, leaving out the defaults. */
function usersHref({ query, show, page }: { query: string; show: Show; page: number }) {
  const params = new URLSearchParams({ ...(query && { q: query }), ...(show && { show }), ...(page > 1 && { p: String(page) }) });
  return params.size ? `/moderation/users?${params}` : '/moderation/users';
}

/** Everyone with an account, for moderators and admins. Each opens their own page. */
export default async function UsersPage({ searchParams }: PageProps<'/moderation/users'>) {
  const session = await requireUser();

  if (!isModerator(session.user.role)) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center px-4 py-28 text-center'>
        <h1 className='text-3xl font-black tracking-tight'>Nothing to see here.</h1>
        <p className='text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed'>You need moderator access to see users.</p>
      </div>
    );
  }

  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const show: Show = isRole(params.show) || params.show === 'BANNED' ? params.show : null;
  const page = Math.max(1, Number.parseInt(String(params.p)) || 1);
  const admin = isAdmin(session.user.role);

  const { users, total, counts } = await QUERIES.getUsers({ query, show, page, take: PAGE_SIZE, withEmail: admin });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  if (page > totalPages) redirect(usersHref({ query, show, page: totalPages }));

  const everyone = ROLES.reduce((sum, role) => sum + (counts[role] ?? 0), 0);
  const filters: { show: Show; label: string; count: number; description: string }[] = [
    { show: null, label: 'Everyone', count: everyone, description: 'All accounts on Tinderhaj.' },
    ...ROLES.map((role) => ({ show: role, label: `${ROLE_LABELS[role]}s`, count: counts[role] ?? 0, description: ROLE_DESCRIPTIONS[role] })),
    { show: 'BANNED', label: 'Banned', count: counts.BANNED, description: 'Can’t sign in until their ban ends or is lifted.' },
  ];
  const shownLabel = show === 'BANNED' ? 'banned accounts' : show ? `${ROLE_LABELS[show].toLowerCase()}s` : 'accounts';

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Moderation</p>
          <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Users</h1>
          <p className='text-muted-foreground mt-2 text-sm text-pretty'>
            {admin
              ? 'Open someone to see their profiles, change their role, ban them, or manage their account.'
              : 'Open someone to see their profiles, or ban them. Only admins change roles and manage accounts.'}
          </p>
        </Stagger>

        <nav aria-label='Filter users'>
          <Stagger className='mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5' itemClassName='h-full' gap={0.05} delay={CONTENT_DELAY}>
            {filters.map((filter) => {
              const active = filter.show === show;
              return (
                <Link
                  key={filter.label}
                  href={usersHref({ query, show: filter.show, page: 1 })}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'block h-full rounded-xl border p-4 transition-colors',
                    active ? 'border-primary/50 bg-primary/10' : 'border-foreground/10 bg-card hover:bg-muted/50 shadow-sm',
                  )}
                >
                  <span className='flex items-baseline justify-between gap-2'>
                    <span className='font-bold'>{filter.label}</span>
                    <span className='text-2xl font-black tabular-nums'>{filter.count}</span>
                  </span>
                  <span className='text-muted-foreground mt-1 block text-xs text-pretty'>{filter.description}</span>
                </Link>
              );
            })}
          </Stagger>
        </nav>

        <ScrollReveal delay={0.65}>
          {/* A plain form, so searching works before the page's scripts load. */}
          <form action='/moderation/users' className='mb-4 flex gap-2'>
            {show && <input type='hidden' name='show' value={show} />}
            <label className='relative min-w-0 flex-1'>
              <span className='sr-only'>{admin ? 'Search by username or email' : 'Search by username'}</span>
              <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' aria-hidden='true' />
              <Input
                name='q'
                type='search'
                defaultValue={query}
                placeholder={admin ? 'Search by username or email...' : 'Search by username...'}
                className='pl-9'
              />
            </label>
            <Button type='submit'>Search</Button>
          </form>
        </ScrollReveal>

        <>
          {users.length ? (
            <Stagger
              as='ul'
              itemAs='li'
              className='border-foreground/10 bg-card divide-foreground/10 divide-y rounded-xl border shadow-sm'
              // All rows at once: one list, not a cascade.
              gap={0}
              delay={0.75}
            >
              {users.map((user) => {
                const self = user.id === session.user.id;
                return (
                  <Link
                    key={user.id}
                    href={`/moderation/users/${user.id}`}
                    className='hover:bg-muted/50 flex items-center gap-3 p-4 transition-colors first:rounded-t-xl last:rounded-b-xl'
                  >
                    <div className='min-w-0 flex-1'>
                      <p className='flex flex-wrap items-center gap-2 font-medium'>
                        <span className='truncate'>@{user.username}</span>
                        {self && <Badge variant='secondary'>You</Badge>}
                      </p>
                      {'email' in user && user.email && <p className='text-muted-foreground truncate text-sm'>{user.email}</p>}
                      <p className='text-muted-foreground text-xs'>
                        Joined {user.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ·{' '}
                        {user._count.profiles === 1 ? '1 profile' : `${user._count.profiles} profiles`}
                      </p>
                    </div>
                    <div className='flex flex-wrap justify-end gap-1.5'>
                      {isBanned(user) && (
                        <Badge variant='destructive'>
                          <BanIcon aria-hidden='true' />
                          Banned
                        </Badge>
                      )}
                      <Badge variant={user.role === 'USER' ? 'outline' : 'default'}>{ROLE_LABELS[user.role]}</Badge>
                    </div>
                    <ChevronRightIcon className='text-muted-foreground size-4 shrink-0' aria-hidden='true' />
                  </Link>
                );
              })}
            </Stagger>
          ) : (
            <ScrollReveal delay={0.75}>
              <EmptyState
                icon={UsersRoundIcon}
                title='No one found.'
                description={query ? `No ${shownLabel} match “${query}”.` : `There are no ${shownLabel} right now.`}
              />
            </ScrollReveal>
          )}

          {totalPages > 1 && (
            <ScrollReveal delay={0.85}>
              <nav aria-label='Pages' className='mt-4 flex items-center justify-between gap-2'>
                <Button variant='outline' asChild className={cn(page <= 1 && 'pointer-events-none opacity-50')}>
                  <Link href={usersHref({ query, show, page: page - 1 })} aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined}>
                    Previous
                  </Link>
                </Button>
                <p className='text-muted-foreground text-sm'>
                  Page {page} of {totalPages}
                </p>
                <Button variant='outline' asChild className={cn(page >= totalPages && 'pointer-events-none opacity-50')}>
                  <Link href={usersHref({ query, show, page: page + 1 })} aria-disabled={page >= totalPages} tabIndex={page >= totalPages ? -1 : undefined}>
                    Next
                  </Link>
                </Button>
              </nav>
            </ScrollReveal>
          )}
        </>
      </div>
    </div>
  );
}
