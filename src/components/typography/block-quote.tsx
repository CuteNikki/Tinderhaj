import { cn } from '@/lib/utils';

export function TypographyBlockquote({ children, className }: { children: React.ReactNode; className?: string }) {
  return <blockquote className={cn('my-2 border-l-2 pl-6 italic', className)}>{children}</blockquote>;
}
