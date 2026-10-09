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

/** A section of a legal page, listed beside it (see LegalPage). */
export function LegalSection({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <ScrollReveal delay={delay}>
      <section id={sectionId(title)} className='scroll-mt-24 space-y-2'>
        <TypographyH2>{title}</TypographyH2>
        {children}
      </section>
    </ScrollReveal>
  );
}
