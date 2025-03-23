import { QUERIES } from '@/lib/queries';

import { TypographyMuted } from '@/components/typography';

export async function UserCount() {
  const userCount = await QUERIES.getUserCount();

  return (
    <TypographyMuted className='text-sm'>
      Trusted by{' '}
      {new Intl.NumberFormat(navigator.language, {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(userCount)}
      + users
    </TypographyMuted>
  );
}
