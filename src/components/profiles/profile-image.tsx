import Image from 'next/image';

import { GhostIcon, SparklesIcon } from 'lucide-react';

export function ProfileBanner({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className='bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center'>
        <GhostIcon className='size-10 shrink-0' />
      </div>
    );
  }

  return <Image unoptimized src={src} alt={alt} loading='eager' fill className='object-cover' />;
}

export function ProfileAvatar({ src, alt, size = 72 }: { src: string | null; alt: string; size?: number }) {
  if (!src) {
    return (
      <div className='bg-muted text-muted-foreground flex h-full w-full items-center justify-center'>
        <SparklesIcon className='size-6 shrink-0' />
      </div>
    );
  }

  return <Image unoptimized src={src} alt={alt} loading='eager' width={size} height={size} className='h-full w-full object-cover' />;
}
