import { ScrollReveal } from '@/components/home/scroll-reveal';
import { cn } from '@/lib/utils';

const TONES = { muted: 'bg-muted', card: 'bg-card text-card-foreground', background: 'bg-background' };

/**
 * A section of a page after its hero, like the home page's: a small heading
 * over a big one, the big one's second line in blue, and a note beside them.
 * `tone` is its background, so sections one after another can take turns.
 */
export function Section({
  eyebrow,
  title,
  highlight,
  note,
  tone = 'muted',
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  note?: string;
  tone?: keyof typeof TONES;
  children: React.ReactNode;
}) {
  return (
    // Inset like the pages they follow, so their edges line up
    <section className={cn('text-foreground px-4 py-18 sm:px-5 lg:px-8', TONES[tone])}>
      <ScrollReveal>
        <div className='container mx-auto max-w-7xl'>
          <div className='mb-8 flex flex-col justify-between gap-4 md:mb-10 md:flex-row md:items-end'>
            <div>
              <p className='text-primary mb-3 text-xs font-bold tracking-widest uppercase'>{eyebrow}</p>
              <h2 className='max-w-xl text-3xl leading-tight font-black tracking-tight sm:text-4xl'>
                {title}
                {highlight && (
                  <>
                    <br />
                    <span className='text-primary'>{highlight}</span>
                  </>
                )}
              </h2>
            </div>
            {note && <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>{note}</p>}
          </div>
          {children}
        </div>
      </ScrollReveal>
    </section>
  );
}
