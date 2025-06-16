import { cn } from '@/lib/utils';

export function TypographyMuted({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-muted-foreground text-base', className)}>{children}</p>;
}
