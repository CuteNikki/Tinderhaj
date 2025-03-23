import { QUERIES } from '@/lib/queries';

import { TypographyMuted } from '@/components/typography';

export async function ProfileCount() {
  const profileCount = await QUERIES.getProfileCount();

  return (
    <TypographyMuted className='text-sm'>
      Trusted by{' '}
      {new Intl.NumberFormat(navigator.language, {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(profileCount)}
      + users
    </TypographyMuted>
  );
}
