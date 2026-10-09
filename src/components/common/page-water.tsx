import { Ocean } from '@/components/common/ocean';
import { PageBand } from '@/components/common/page-band';

/**
 * The water behind most pages, kept in the layout rather than the page, so
 * going from one to the next carries on the same water instead of starting it
 * over (pages are built anew on every path, see Replay). A page asks for it
 * with `data-water`: `full` to be set in it as a whole (signing in and the
 * like), `band` for its header (marked `page-header`) in a band of it across
 * the top. Both are always here, and CSS shows and fits them as the page asks
 * (see .page-band), so they're there from the very first paint and change
 * with the page, not after it.
 */
export function PageWater() {
  return (
    <>
      {/* Flowing into the footer below */}
      <div className='water-full pointer-events-none absolute inset-0 -z-10'>
        <Ocean into='fill-muted dark:fill-background' />
      </div>
      <PageBand />
    </>
  );
}
