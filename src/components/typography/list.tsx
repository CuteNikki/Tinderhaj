import { cn } from '@/lib/utils';

export function TypographyList({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ul className={cn('mb-4 ml-6 list-disc [&>li]:mt-2', className)}>{children}</ul>;
}
