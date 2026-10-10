import { PageBand } from '@/components/common/page-band';

/**
 * The water behind most pages, kept in the layout rather than the page, so
 * going from one to the next carries on the same water instead of starting it
 * over (pages are built anew on every path, see Replay). A page asks for it
 * with `data-water`: `band` for its header (marked `page-header`) in a band of
 * it across the top, `full` to be set in it as a whole (signing in and the
 * like), the band stretched to the footer. It's always here, and CSS shows and
 * fits it as the page asks (see .page-band), so it's there from the very first
 * paint and changes with the page, not after it.
 */
export function PageWater() {
  return <PageBand />;
}
