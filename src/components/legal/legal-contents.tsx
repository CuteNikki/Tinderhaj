'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/common/heading';

const LEGAL_PAGES = [
  { href: '/privacy', name: 'Privacy Policy' },
  { href: '/terms', name: 'Terms of Service' },
  { href: '/imprint', name: 'Imprint' },
];

/** How far below the top of the window a section counts as the one being read: just under the navbar. */
const READING_LINE = 120;

/** Beside a legal page: its sections, the one being read marked, and the other legal pages. */
export function LegalContents({ sections }: { sections: { id: string; title: string }[] }) {
  const pathname = usePathname();
  const [reading, setReading] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // At the very bottom, the last one, even if it's too short to reach the top
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const passed = sections.filter(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= READING_LINE);
      setReading(atBottom ? sections[sections.length - 1]?.id : (passed[passed.length - 1]?.id ?? sections[0]?.id));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sections]);

  return (
    <nav aria-label='On this page' className='text-sm'>
      <Eyebrow as='h2' className='mb-4'>
        On this page
      </Eyebrow>
      <ol className='border-border border-l'>
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={reading === id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l-2 py-1.5 pl-3 leading-snug transition-colors',
                // Marked by color and the line alone: bolder, it'd be wider, and could wrap and push the rest down
                reading === id ? 'border-primary text-foreground' : 'text-muted-foreground hover:text-foreground border-transparent',
              )}
            >
              {title.replace(/^\d+\.\s*/, '')}
            </a>
          </li>
        ))}
      </ol>
      <Eyebrow as='h2' className='mt-8 mb-4'>
        Legal
      </Eyebrow>
      <ul className='space-y-1.5'>
        {LEGAL_PAGES.map(({ href, name }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              className={cn('transition-colors', pathname === href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
