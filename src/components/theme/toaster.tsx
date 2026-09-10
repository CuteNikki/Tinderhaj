'use client';

import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  const { resolvedTheme } = useTheme();

  return <SonnerToaster theme={resolvedTheme === 'dark' ? 'dark' : 'light'} richColors closeButton {...props} />;
}
