'use client';

import { FormControl, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * An input whose label shows as its placeholder, as on most sign-in forms.
 * The real label is still there for screen readers, just not visible. Use it
 * inside a FormItem.
 */
export function AuthInput({ label, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <>
      <FormLabel className='sr-only'>{label}</FormLabel>
      <FormControl>
        <Input placeholder={label} {...props} />
      </FormControl>
    </>
  );
}
