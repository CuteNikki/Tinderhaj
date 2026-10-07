import { siApple, siDiscord, siFacebook, siGithub, siGoogle, siTwitch, siX } from 'simple-icons';

import type { SocialProviderId } from '@/lib/providers';

const paths: Record<Exclude<SocialProviderId, 'microsoft'>, string> = {
  google: siGoogle.path,
  apple: siApple.path,
  github: siGithub.path,
  discord: siDiscord.path,
  twitter: siX.path,
  twitch: siTwitch.path,
  facebook: siFacebook.path,
};

/** A provider's logo in the text color, sized like a Lucide icon. */
export function ProviderIcon({ provider, className }: { provider: SocialProviderId; className?: string }) {
  return (
    <svg viewBox='0 0 24 24' className={className} fill='currentColor' aria-hidden='true'>
      {provider === 'microsoft' ? (
        // Not in Simple Icons: Microsoft's four squares.
        <path d='M1 1h10.5v10.5H1zM12.5 1H23v10.5H12.5zM1 12.5h10.5V23H1zM12.5 12.5H23V23H12.5z' />
      ) : (
        <path d={paths[provider]} />
      )}
    </svg>
  );
}
