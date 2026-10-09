import { ArrowRight, ArrowUpRightIcon, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

/**
 * A card of a page's grid: its icon beside its title, so the icon doesn't cost
 * a row of its own, and a few words under them. `step` numbers it, `link` ends
 * it on somewhere to go (a new tab, if it's off the site), and `heading` is
 * h3 under a section's own heading.
 */
export function IconCard({
  title,
  copy,
  icon: Icon,
  step,
  link,
  heading: Heading = 'h2',
}: {
  title: string;
  copy: string;
  icon: LucideIcon;
  step?: number;
  link?: { label: string; href: string };
  heading?: 'h2' | 'h3';
}) {
  // Down at the bottom, so the links of cards side by side line up
  const linkClassName = 'text-primary mt-auto inline-flex items-center gap-1 self-start pt-3 text-sm font-semibold hover:underline';

  return (
    <div className='border-foreground/10 bg-card flex h-full flex-col rounded-2xl border p-6 shadow-sm'>
      {step !== undefined && <p className='text-muted-foreground mb-3 font-mono text-xs'>Step {step}</p>}
      <div className='flex items-center gap-3'>
        <span className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full'>
          <Icon className='size-4.5' aria-hidden='true' />
        </span>
        <Heading className='text-lg leading-tight font-bold'>{title}</Heading>
      </div>
      <p className='text-muted-foreground mt-2 text-sm leading-relaxed text-pretty'>{copy}</p>
      {link &&
        (link.href.startsWith('http') ? (
          <a href={link.href} target='_blank' rel='noreferrer' className={linkClassName}>
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
