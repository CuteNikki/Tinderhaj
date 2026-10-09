import { Eyebrow } from '@/components/common/heading';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { cn } from '@/lib/utils';

const TONES = { muted: 'bg-muted', card: 'bg-card text-card-foreground', background: 'bg-background' };

/**
 * A section of a page after its hero: a small blue label over a big heading,
 * its second line in blue, and a note under it, all on the left, like every
 * other heading. `tone` is its background, so sections one after another can
 * take turns. `aside`, a button to end on or a picture, sits beside it all on
 * wide screens and under it on narrow ones.
 */
export function Section({
  id,
  eyebrow,
  title,
  highlight,
  note,
  tone = 'muted',
  aside,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  note?: string;
  tone?: keyof typeof TONES;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const content = (
    <>
      <div className='mb-8 md:mb-10'>
        <Eyebrow muted={!!highlight}>{eyebrow}</Eyebrow>
        <h2 className='max-w-2xl text-3xl leading-tight font-black tracking-tight sm:text-4xl'>
          {title}
          {highlight && (
            <>
              <br />
              <span className='text-primary'>{highlight}</span>
            </>
          )}
        </h2>
        {note && <p className='text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed'>{note}</p>}
      </div>
      {children}
    </>
  );

  return (
    // Inset like the pages they follow, so their edges line up
    <section id={id} className={cn('text-foreground scroll-m-16 px-4 py-18 sm:px-5 lg:px-8', TONES[tone])}>
      <ScrollReveal>
        <div className='container mx-auto max-w-7xl'>
          {aside ? (
            <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
              <div className='min-w-0 flex-1'>{content}</div>
              <div className='shrink-0'>{aside}</div>
            </div>
          ) : (
            content
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
