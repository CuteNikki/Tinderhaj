import { ScrollReveal } from '@/components/home/scroll-reveal';
import { cn } from '@/lib/utils';

/**
 * A card of settings or details, with a title and a line about it: on the
 * account page, and moderation's user pages. `still` for a loading screen's,
 * which shouldn't play in only to be replaced by the page's own.
 */
export function SettingsSection({
  title,
  description,
  destructive,
  className,
  delay,
  still,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  destructive?: boolean;
  className?: string;
  delay?: number;
  still?: boolean;
  children: React.ReactNode;
}) {
  const section = (
    <section className={cn('rounded-2xl border p-4', destructive ? 'border-destructive/30 bg-destructive/5' : 'border-foreground/10 bg-card shadow-sm')}>
      <div className='mb-4'>
        <h2 className={cn('text-xl font-bold', destructive && 'text-destructive')}>{title}</h2>
        {description && <p className='text-muted-foreground mt-1 text-sm text-pretty'>{description}</p>}
      </div>
      {children}
    </section>
  );

  return still ? (
    <div className={className}>{section}</div>
  ) : (
    <ScrollReveal delay={delay} className={className}>
      {section}
    </ScrollReveal>
  );
}
