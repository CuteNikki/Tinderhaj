import { glass } from '@/components/common/ocean';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/** The label above a big hero's title, in a glass pill, as on the shared pictures. Smaller headers use an Eyebrow. */
export function HeroBadge({ icon, className, children }: { icon?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <Badge className={cn(glass, 'gap-2 p-4 font-semibold tracking-wide uppercase shadow-lg', className)}>
      {icon}
      {children}
    </Badge>
  );
}
