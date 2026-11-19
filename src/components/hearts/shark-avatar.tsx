import { cn } from '@/lib/utils';

import { ProfileAvatar } from '@/components/profiles/profile-image';

/** A shark's picture in a circle, for rows and lists. */
export function SharkAvatar({
  shark,
  className,
}: {
  shark: { displayName: string; avatarUrl: string | null };
  className?: string;
}) {
  return (
    <span
      className={cn(
        'block size-10 shrink-0 overflow-hidden rounded-full bg-muted',
        className
      )}
    >
      <ProfileAvatar
        src={shark.avatarUrl}
        alt={`${shark.displayName}'s avatar`}
        size={80}
      />
    </span>
  );
}
