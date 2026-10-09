import { Children, isValidElement } from 'react';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { LegalContents } from '@/components/legal/legal-contents';
import { LegalSection, sectionId } from '@/components/legal/legal-section';

/**
 * A legal page: its header, its sections (each a LegalSection), and on wide
 * screens, its sections listed beside them to jump to. The text keeps its
 * width and stays about centered; the list sits in the space to its left.
 */
export function LegalPage({ title, lead, updated, children }: { title: string; lead: string; updated: string; children: React.ReactNode }) {
  const sections = Children.toArray(children)
    .filter((child) => isValidElement<{ title: string }>(child) && child.type === LegalSection)
    .map((child) => {
      const { title } = (child as React.ReactElement<{ title: string }>).props;
      return { id: sectionId(title), title };
    });

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <article className='container mx-auto max-w-7xl lg:grid lg:grid-cols-[minmax(10rem,1fr)_minmax(0,56rem)_minmax(0,1fr)] lg:gap-x-12'>
        <Stagger id='page-header' variant='sink' as='header' className='mx-auto mb-24 max-w-4xl lg:col-start-2 lg:mx-0 lg:max-w-none'>
          <Eyebrow>Legal</Eyebrow>
          <PageTitle>{title}</PageTitle>
          <PageNote>{lead}</PageNote>
          <PageNote className='mt-1 text-xs'>Last updated: {updated}</PageNote>
        </Stagger>
        <aside className='hidden lg:col-start-1 lg:row-start-2 lg:block'>
          <ScrollReveal delay={0.3} className='sticky top-24'>
            <LegalContents sections={sections} />
          </ScrollReveal>
        </aside>
        <div className='mx-auto max-w-4xl space-y-6 lg:col-start-2 lg:row-start-2 lg:mx-0 lg:max-w-none'>{children}</div>
      </article>
    </div>
  );
}
