import { ProfileAvatar } from '@/components/profiles/profile-image';
import { cn } from '@/lib/utils';

/** A shark's picture in a circle, for rows and lists. */
export function SharkAvatar({ shark, className }: { shark: { displayName: string; avatarUrl: string | null }; className?: string }) {
  return (
    <span className={cn('bg-muted block size-10 shrink-0 overflow-hidden rounded-full', className)}>
      <ProfileAvatar src={shark.avatarUrl} alt={`${shark.displayName}’s avatar`} size={80} />
    </span>
  );
}
