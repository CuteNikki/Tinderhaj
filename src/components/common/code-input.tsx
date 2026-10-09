'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useRef } from 'react';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

/** How many digits sign-in codes have, from an app or by email. */
export const CODE_LENGTH = 6;

/**
 * A 6-digit sign-in code, one box per digit. It's one real input underneath,
 * so pasting, a phone offering the code from a new email, and password
 * managers with authenticator codes all work. Once every digit is in, it
 * submits its form.
 */
export function CodeInput({
  id,
  name = 'code',
  invalid,
}: {
  id?: string;
  name?: string;
  /** Marks the boxes red, e.g. after a wrong code. */
  invalid?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <InputOTP
      ref={input}
      id={id}
      name={name}
      required
      maxLength={CODE_LENGTH}
      pattern={REGEXP_ONLY_DIGITS}
      inputMode='numeric'
      autoComplete='one-time-code'
      aria-invalid={invalid || undefined}
      // Typed, pasted or filled in: send it right away.
      onComplete={() => input.current?.form?.requestSubmit()}
    >
      <InputOTPGroup>
        {Array.from({ length: CODE_LENGTH }, (_, index) => (
          <InputOTPSlot key={index} index={index} aria-invalid={invalid || undefined} className='size-10 text-base' />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
