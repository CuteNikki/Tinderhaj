import Link from 'next/link';

import { ArrowRight, ArrowUpRightIcon, type LucideIcon } from 'lucide-react';

import { isExternalLink } from '@/lib/social-link';
import { cn } from '@/lib/utils';

/**
 * A card of a page's grid: its icon beside its title, so the icon doesn't cost
 * a row of its own, and a few words under them. `step` numbers it, `link` ends
 * it on somewhere to go (a new tab, if it's off the site), and `heading` is
 * h3 under a section's own heading. `onGlass` leaves its own card off, for
 * one set on glass by what holds it (see Features).
 */
export function IconCard({
  title,
  copy,
  icon: Icon,
  step,
  link,
  heading: Heading = 'h2',
  onGlass = false,
}: {
  title: string;
  copy: string;
  icon: LucideIcon;
  step?: number;
  link?: { label: string; href: string };
  heading?: 'h2' | 'h3';
  onGlass?: boolean;
}) {
  // Down at the bottom, so the links of cards side by side line up
  // Blue on a card; on glass, where blue can't stay clear, the glass's own text color
  const linkClassName = cn(
    'mt-auto inline-flex items-center gap-1 self-start pt-3 text-sm font-semibold',
    onGlass ? 'hover:underline' : 'text-primary hover:underline'
  );

  return (
    <div
      className={cn(
        'flex h-full flex-col p-6',
        !onGlass && 'rounded-2xl border border-foreground/10 bg-card shadow-sm'
      )}
    >
      {step !== undefined && (
        <p className='mb-3 font-mono text-xs text-muted-foreground'>
          Step {step}
        </p>
      )}
      <div className='flex items-center gap-3'>
        <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <Icon className='size-4.5' aria-hidden='true' />
        </span>
        <Heading className='text-lg leading-tight font-bold'>{title}</Heading>
      </div>
      <p className='mt-2 text-sm leading-relaxed text-pretty text-muted-foreground'>
        {copy}
      </p>
      {link &&
        (isExternalLink(link.href) ? (
          <a
            href={link.href}
            target='_blank'
            rel='noreferrer'
            className={linkClassName}
          >
            {link.label}
            <ArrowUpRightIcon className='size-3.5' aria-hidden='true' />
          </a>
        ) : (
          <Link href={link.href} className={linkClassName}>
            {link.label}
            <ArrowRight className='size-3.5' aria-hidden='true' />
          </Link>
        ))}
    </div>
  );
}
