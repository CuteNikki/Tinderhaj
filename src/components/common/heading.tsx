import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

/**
 * The small label above a heading, the same everywhere but the big heroes
 * (see HeroBadge). Blue, unless what it heads has its own blue already (a
 * section's blue second line, a menu's blue icons): `muted` then, so there's
 * one accent, not two. Above a title it sits close (`mb-2`); as a heading
 * of its own, over a list or cards, pass `as='h2'` and more room.
 */
export function Eyebrow({
  as: Tag = 'p',
  muted,
  className,
  children,
}: {
  as?: 'p' | 'h2' | 'h3';
  muted?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return <Tag className={cn('mb-2 text-xs font-bold tracking-widest uppercase', muted ? 'text-muted-foreground' : 'text-primary', className)}>{children}</Tag>;
}

/** A page's own title, at the top of its header. */
export function PageTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h1 className={cn('text-3xl font-black tracking-tight sm:text-4xl', className)}>{children}</h1>;
}

/** The line or two under a page's title. */
export function PageNote({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('text-muted-foreground mt-2 text-sm text-pretty', className)}>{children}</p>;
}

/** Back to where a page belongs, above its header's label. */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className='text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm transition-colors'>
      <ArrowLeftIcon className='size-4' aria-hidden='true' />
      {children}
    </Link>
  );
}
