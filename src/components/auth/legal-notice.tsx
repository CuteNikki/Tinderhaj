import Link from 'next/link';

/**
 * Under the forms that can create an account, including signing in with a
 * provider for the first time. New tabs, so a half-filled form isn't lost.
 */
export function LegalNotice() {
  return (
    <p className='text-muted-foreground mt-4 text-center text-xs text-balance'>
      By continuing, you agree to our{' '}
      <Link href='/terms' target='_blank' className='text-foreground underline underline-offset-2'>
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href='/privacy' target='_blank' className='text-foreground underline underline-offset-2'>
        Privacy Policy
      </Link>
      .
    </p>
  );
}
