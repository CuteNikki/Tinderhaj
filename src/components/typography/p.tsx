import { cn } from '@/lib/utils';

export function TypographyP({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('leading-7', className)}>{children}</p>;
}
