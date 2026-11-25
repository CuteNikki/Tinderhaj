'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { CheckIcon, Share2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';

const TOAST = { position: 'top-center' } as const;

/**
 * Shares the page it's on: through the phone's share sheet where there is
 * one, else the link is copied.
 */
export function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = location.href.split('#')[0];
    // A touch screen's share sheet; on a computer, copying is what people expect
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // Closed without sharing
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied.', { ...TOAST, duration: 3000 });
    } catch {
      toast.error('Unable to copy the link!', { ...TOAST, duration: 5000 });
    }
  }

  return (
    <Button size='lg' onClick={share}>
      {copied ? (
        <CheckIcon aria-hidden='true' />
      ) : (
        <Share2Icon aria-hidden='true' />
      )}
      Share the party
    </Button>
  );
}
