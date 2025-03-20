import { cn } from '@/lib/utils';

export function TypographyInlineCode({ children, className }: { children: React.ReactNode; className?: string }) {
  return <code className={cn('bg-muted relative w-fit rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}>{children}</code>;
}
