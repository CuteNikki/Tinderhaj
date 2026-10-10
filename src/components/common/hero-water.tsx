import { Ocean } from '@/components/common/ocean';

/**
 * For a hero set in the band of water (see PageWater), inside a section with
 * `data-water='band'` and a `data-floor` or `data-tone` of the same color:
 * where the band ends, so its waves roll in where the hero does, and water of
 * its own for browsers that can't fit the band to it (see .own-water). `floor`
 * is what follows the hero, that its waves flow into.
 */
export function HeroWater({ floor }: { floor: 'muted' | 'card' }) {
  return (
    <>
      {/* The layout's band of water, carried on from the page before; this one only where browsers can't fit that to the hero */}
      <div className='own-water'>
        <Ocean into={floor === 'card' ? 'fill-card' : 'fill-muted'} />
      </div>
      {/* Where the band of water across the top ends (see PageBand): the waves' height above the bottom, so they roll in where the hero ends */}
      <div id='page-header' aria-hidden='true' className='absolute inset-x-0 bottom-22 sm:bottom-26' />
    </>
  );
}
