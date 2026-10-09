import { cn } from '@/lib/utils';

/**
 * The small blue label above a heading, the same everywhere but the big
 * heroes (see HeroBadge). Above a title it sits close (`mb-2`); as a heading
 * of its own, over a list or cards, pass `as='h2'` and more room.
 */
export function Eyebrow({ as: Tag = 'p', className, children }: { as?: 'p' | 'h2' | 'h3'; className?: string; children: React.ReactNode }) {
  return <Tag className={cn('text-primary mb-2 text-xs font-bold tracking-widest uppercase', className)}>{children}</Tag>;
}

/** A page's own title, at the top of its header. */
export function PageTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h1 className={cn('text-3xl font-black tracking-tight sm:text-4xl', className)}>{children}</h1>;
}

/** The line or two under a page's title. */
export function PageNote({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('text-muted-foreground mt-2 text-sm text-pretty', className)}>{children}</p>;
}
