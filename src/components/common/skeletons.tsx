import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * What a page looks like while it loads, piece by piece: each shaped like
 * what it stands in for, so nothing jumps when the page arrives.
 */

/**
 * A shark's card (see DiscoveryProfile), ending as the real one does: a
 * heart to send (`heart`), when it was verified and a button to unverify it
 * (`unverify`), nothing (`none`, as in a preview), or a row of buttons (`actions`): to verify or reject it (see
 * VerifyProfileCard), or to edit or delete your own (see ProfileCard).
 * `blank` for one with nothing but a name yet, as a new one's preview.
 */
export function ProfileCardSkeleton({ ending = 'heart', blank = false }: { ending?: 'heart' | 'unverify' | 'actions' | 'none'; blank?: boolean }) {
  const actions = ending === 'actions';

  return (
    <Card className={cn('bg-background h-full w-full overflow-hidden pt-0 shadow-sm', !actions && 'pb-0')}>
      <Skeleton className='aspect-5/2 w-full rounded-none' />
      {/* Row for row as tall as a real card's, so the cards don't grow when they arrive */}
      <CardContent className={cn('-mt-8 flex flex-1 flex-col px-4 sm:px-6', actions ? 'pb-5' : 'pb-4 sm:pb-6')}>
        <div className='relative flex items-start gap-4'>
          {/* On a solid disc, so where it overlaps the banner it isn't lighter there */}
          <span className='border-background bg-background size-18 shrink-0 overflow-hidden rounded-full border-4 shadow-md'>
            <Skeleton className='size-full rounded-full' />
          </span>
          <div className='min-w-0 flex-1 pt-4'>
            <Skeleton className='h-6 w-36' />
            <Skeleton className='mt-2 h-4 w-24' />
          </div>
        </div>
        {blank ? (
          // As an empty one is: no details, bio or interests, only the room they'd have
          <>
            <div className='mt-5' />
            <div className='pt-4' />
          </>
        ) : (
          <>
            <div className='mt-5 flex h-5 flex-wrap items-center gap-x-4'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-16' />
            </div>
            {/* Two lines, as most bios are, even on narrow cards */}
            <div className='mt-4 flex h-[2.875rem] flex-col justify-center gap-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6' />
            </div>
            <div className='flex flex-wrap gap-1.5 pt-4'>
              <Skeleton className='h-5 w-16 rounded-full' />
              <Skeleton className='h-5 w-20 rounded-full' />
              <Skeleton className='h-5 w-14 rounded-full' />
            </div>
          </>
        )}
        {ending === 'heart' && (
          <div className='mt-auto flex justify-end pt-3'>
            <Skeleton className='size-8 rounded-full' />
          </div>
        )}
        {ending === 'unverify' && (
          <div className='mt-auto flex items-center justify-between gap-2 pt-3'>
            <Skeleton className='h-3 w-28' />
            <Skeleton className='h-8 w-24 rounded-full' />
          </div>
        )}
        {actions && (
          <div className='mt-4 flex gap-2'>
            <Skeleton className='h-8 flex-1 rounded-full' />
            <Skeleton className='h-8 flex-1 rounded-full' />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Sharks' cards in the usual grid. */
export function ProfileGridSkeleton({ count = 3, ending }: { count?: number; ending?: 'heart' | 'unverify' | 'actions' | 'none' }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: count }, (_, index) => (
        <ProfileCardSkeleton key={index} ending={ending} />
      ))}
    </div>
  );
}

/** The tabs above a list (see Hearts and Verification). */
export function TabsSkeleton({ count, className }: { count: number; className?: string }) {
  return (
    <div className={cn('bg-muted grid max-w-md gap-1 rounded-full p-1', className)} style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className={cn('h-9 rounded-full', index === 0 ? 'bg-background' : 'bg-transparent')} />
      ))}
    </div>
  );
}

/** A list of rows in one card, each with a round picture or not (see Hearts and Users). */
export function ListSkeleton({ rows = 4, avatar = false }: { rows?: number; avatar?: boolean }) {
  return (
    <div className='border-foreground/10 bg-card divide-foreground/10 divide-y rounded-2xl border shadow-sm'>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className='flex items-center gap-3 p-4'>
          {avatar && <Skeleton className='size-12 shrink-0 rounded-full' />}
          <div className='min-w-0 flex-1 space-y-2'>
            <Skeleton className='h-4 w-40 max-w-full' />
            <Skeleton className='h-3 w-56 max-w-full' />
          </div>
        </div>
      ))}
    </div>
  );
}

/** A section of settings, as on the account page: a title, a line about it, and its controls. */
export function SettingsSectionSkeleton({ lines = 2, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('border-foreground/10 bg-card rounded-2xl border p-4 shadow-sm', className)}>
      <Skeleton className='h-6 w-32' />
      <Skeleton className='mt-2 h-4 w-64 max-w-full' />
      <div className='mt-4 space-y-2'>
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton key={index} className='h-9 w-full rounded-xl' />
        ))}
      </div>
    </div>
  );
}

/**
 * Text that's coming, as a placeholder: the real words, unseen, on a pulsing
 * bar, so it wraps onto as many lines as the real text will at any width.
 */
export function GhostText({ as: Tag = 'p', className, children }: { as?: 'p' | 'span'; className?: string; children: React.ReactNode }) {
  return (
    <Tag aria-hidden className={cn('text-sm text-pretty', className)}>
      <span className='bg-foreground/10 animate-breathe rounded-md [box-decoration-break:clone] text-transparent [-webkit-box-decoration-break:clone] [text-shadow:none]'>
        {children}
      </span>
    </Tag>
  );
}

/** A labelled input, as in the forms: its label above it. */
export function FieldSkeleton({ className, input = 'h-9' }: { className?: string; input?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Skeleton className='h-3.5 w-24' />
      <Skeleton className={cn('w-full rounded-md', input)} />
    </div>
  );
}

/** A button, as wide as its label makes the real one: the label's there, unseen. */
export function ButtonSkeleton({
  size = 'default',
  icon = true,
  className,
  children,
}: {
  size?: 'default' | 'sm';
  icon?: boolean;
  className?: string;
  children: string;
}) {
  return (
    <Skeleton
      aria-hidden
      className={cn(
        'inline-flex w-fit shrink-0 items-center justify-center rounded-full text-sm font-medium text-transparent [text-shadow:none]',
        size === 'sm' ? 'h-8 gap-1 px-3' : 'h-9 gap-1.5 px-3.5',
        className,
      )}
    >
      {icon && <span className='size-4' />}
      {children}
    </Skeleton>
  );
}
