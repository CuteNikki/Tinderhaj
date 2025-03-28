'use client';

import { toast } from 'sonner';

import { resetProfile, verifyProfile } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Profile } from '@prisma/client';

export function VerifyProfileButton({ profile }: { profile: Profile }) {
  return (
    <Button
      onClick={async () => {
        const success = await verifyProfile(profile.id);

        if (success) {
          toast.success(`Successfully verified profile ${profile.displayName}!`);
        } else {
          toast.error(`Failed to verify profile ${profile.displayName}!`);
        }
      }}
      variant='outline'
      className='w-full cursor-pointer'
    >
      Verify Profile
    </Button>
  );
}

export function ResetProfileButton({ profile }: { profile: Profile }) {
  return (
    <Button
      onClick={async () => {
        const success = await resetProfile(profile.id);

        if (success) {
          toast.success(`Successfully reset profile ${profile.displayName}!`);
        } else {
          toast.error(`Failed to reset profile ${profile.displayName}!`);
        }
      }}
      variant='destructive'
      className='w-full cursor-pointer'
    >
      Reset Profile
    </Button>
  );
}
