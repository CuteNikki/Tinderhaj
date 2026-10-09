import { FeatureContent } from '@/components/home/feature-content';

/** A last nudge toward discovery, to end a page on. */
export function ReadyWhenYouAre({ id }: { id?: string }) {
  return (
    <section id={id} className='bg-card text-card-foreground scroll-m-16 px-4 py-18 sm:px-5 lg:px-8'>
      <FeatureContent />
    </section>
  );
}
