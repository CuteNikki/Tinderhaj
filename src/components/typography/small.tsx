import { cn } from '@/lib/utils';

export function TypographySmall({ children, className }: { children: React.ReactNode; className?: string }) {
  return <small className={cn('text-sm leading-none font-medium', className)}>{children}</small>;
}
