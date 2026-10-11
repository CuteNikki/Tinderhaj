import Image from 'next/image';

import { GhostIcon, SparklesIcon } from 'lucide-react';

/**
 * A profile's pictures, loaded as they near the screen like any picture: a page
 * full of cards, or the fresh sharks further down the home page, would
 * otherwise all be fetched up front, ahead of what's first on the page.
 * `eager` for a card in view as the page opens, so its pictures are fetched
 * straight away (see DiscoveryProfile).
 */
export function ProfileBanner({ src, alt, eager = false }: { src: string | null; alt: string; eager?: boolean }) {
  if (!src) {
    return (
      <div className='bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center'>
        <GhostIcon className='size-10 shrink-0' />
      </div>
    );
  }

  return <Image unoptimized src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} fill className='object-cover' />;
}

export function ProfileAvatar({ src, alt, size = 72, eager = false }: { src: string | null; alt: string; size?: number; eager?: boolean }) {
  if (!src) {
    return (
      <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center'>
        <SparklesIcon className='size-6 shrink-0' />
      </div>
    );
  }

  return <Image unoptimized src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} width={size} height={size} className='h-full w-full object-cover' />;
}
