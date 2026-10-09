import Image from 'next/image';

import { AUTH_HEIGHT } from '@/components/auth/height';
import { glass } from '@/components/common/ocean';

/** Signing in and the like, while it loads: a Blåhaj spinning in the water, there being no layout worth sketching. */
export function AuthLoading() {
  return (
    <div data-water='full' role='status' aria-busy='true' className={`${AUTH_HEIGHT} flex flex-1 flex-col items-center justify-center gap-4 px-4 py-28`}>
      {/* A GIF rather than a video: it's see-through, so it swims in the water */}
      <Image unoptimized src='/blahajSpinSmall.gif' width={382} height={201} alt='' className='h-auto w-48 motion-reduce:hidden' />
      {/* Still, for those who ask for less motion */}
      <Image unoptimized src='/blahajSmall.png' width={192} height={192} alt='' className='hidden h-auto w-32 motion-reduce:block' />
      <span className={`${glass} rounded-full px-3 py-2 text-xs font-semibold shadow-lg`}>Swimming over…</span>
    </div>
  );
}
