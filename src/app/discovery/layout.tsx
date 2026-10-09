import { DiscoveryHero } from '@/components/discovery/hero';

/**
 * The hero stays while the profiles below it load, and as you search or turn
 * the page, rather than being drawn again (and played in again) each time.
 */
export default function DiscoveryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-1 flex-col'>
      <DiscoveryHero />
      {children}
    </div>
  );
}
