import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { ScrollReveal } from '@/components/home/scroll-reveal';
import { TypographyH2 } from '@/components/typography';

/** Where a section of a legal page is, to link to: its title, without its number. */
export function sectionId(title: string) {
  return title
    .replace(/^\d+\.\s*/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * A section of a legal page, listed beside it (see LegalPage). The first few
 * come in one after another as the page opens; the rest as they're scrolled to.
 */
export function LegalSection({ title, index = 0, children }: { title: string; index?: number; children: React.ReactNode }) {
  return (
    <ScrollReveal delay={CONTENT_DELAY + Math.min(index, 3) * STAGGER}>
      <section id={sectionId(title)} className='scroll-mt-24 space-y-2'>
        <TypographyH2>{title}</TypographyH2>
        {children}
      </section>
    </ScrollReveal>
  );
}
