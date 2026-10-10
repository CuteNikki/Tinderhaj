import { DiscoveryHero } from '@/components/discovery/hero';
import { AddYourShark } from '@/components/sections/add-your-shark';

/**
 * The hero stays while the profiles below it load, and as you search or turn
 * the page, rather than being drawn again (and played in again) each time. So
 * does the nudge to add your own after them, on another color, so the
 * profiles don't run straight into the footer.
 */
export default function DiscoveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-1 flex-col'>
      <DiscoveryHero />
      {children}
      <AddYourShark tone='background' />
    </div>
  );
}
