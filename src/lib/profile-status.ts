import { BadgeCheckIcon, ClockIcon, FileIcon, XCircleIcon } from 'lucide-react';

import { ProfileStatus } from '@/generated/enums';

export const PROFILE_STATUS_META: Record<ProfileStatus, { label: string; badgeClassName: string; icon: typeof ClockIcon; description: string }> = {
  CREATED: {
    label: 'Draft',
    badgeClassName: 'bg-slate-500 text-white dark:bg-slate-600',
    icon: FileIcon,
    description: 'Saved as a draft. Submit it for review when you\u2019re ready to go live.',
  },
  PENDING: {
    label: 'Pending Review',
    badgeClassName: 'bg-amber-500 text-white dark:bg-amber-600',
    icon: ClockIcon,
    description: 'Waiting on a moderator to verify it before it shows up in discovery.',
  },
  VERIFIED: {
    label: 'Verified',
    badgeClassName: 'bg-emerald-500 text-white dark:bg-emerald-600',
    icon: BadgeCheckIcon,
    description: 'Live in discovery. Editing it will send it back for re-verification.',
  },
  REJECTED: {
    label: 'Rejected',
    badgeClassName: 'bg-red-500 text-white dark:bg-red-600',
    icon: XCircleIcon,
    description: 'A moderator rejected this profile. Edit it and resubmit for review.',
  },
};
