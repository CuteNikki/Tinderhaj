import { cn } from '@/lib/utils';

export function TypographyH2({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn('scroll-m-20 text-3xl font-semibold tracking-tight', className)}>{children}</h2>;
}
