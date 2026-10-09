'use client';

import { useState } from 'react';

/**
 * Whether a plain form is worth sending: no `required` field left empty, no
 * field the wrong shape for its type (an email without an @), and `check`, if
 * given, agrees. Spread `onInput` onto the form, and disable its submit button
 * until `ready`. After the form empties, e.g. once its action is done, call
 * `clear`.
 *
 * Lengths are left to the form's own messages, which say what's wrong; a
 * button that's only disabled wouldn't.
 */
export function useFormReady(check?: (form: HTMLFormElement) => boolean) {
  const [ready, setReady] = useState(false);

  function onInput(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const filled = Array.from(form.elements).every((element) => {
      const { validity } = element as HTMLInputElement;
      return !validity || (!validity.valueMissing && !validity.typeMismatch);
    });
    setReady(filled && (check?.(form) ?? true));
  }

  return { ready, onInput, clear: () => setReady(false) };
}
