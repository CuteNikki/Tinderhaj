import { siDiscord, siGithub, siInstagram, siX } from 'simple-icons';

import type { SocialId } from '@/constants/contact';

const paths: Record<SocialId, string> = {
  discord: siDiscord.path,
  x: siX.path,
  instagram: siInstagram.path,
  github: siGithub.path,
};

/** A social network's logo in the text color, sized like a Lucide icon. */
export function SocialIcon({ id, className }: { id: SocialId; className?: string }) {
  return (
    <svg viewBox='0 0 24 24' className={className} fill='currentColor' aria-hidden='true'>
      <path d={paths[id]} />
    </svg>
  );
}
